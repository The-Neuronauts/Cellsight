import os
import cv2
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms as tvt
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer, Conv2D, Dropout, MaxPool2D, UpSampling2D, concatenate, Multiply
from skimage.measure import label, regionprops
from ViTHelper import MasterEncoder  # Ensure this file is present

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# ======================== CUSTOM LAYERS ======================== #
class EncoderBlock(Layer):
    def __init__(self, filters, rate, pooling=True, **kwargs):
        super().__init__(**kwargs)
        self.c1 = Conv2D(filters, 3, activation='relu', padding='same', kernel_initializer='he_normal')
        self.drop = Dropout(rate)
        self.c2 = Conv2D(filters, 3, activation='relu', padding='same', kernel_initializer='he_normal')
        self.pool = MaxPool2D() if pooling else None

    def call(self, X):
        x = self.c1(X)
        x = self.drop(x)
        x = self.c2(x)
        return (self.pool(x), x) if self.pool else x

class DecoderBlock(Layer):
    def __init__(self, filters, rate, **kwargs):
        super().__init__(**kwargs)
        self.up = UpSampling2D()
        self.concat = concatenate
        self.encoder_block = EncoderBlock(filters, rate, pooling=False)

    def call(self, inputs):
        X, skip_X = inputs
        x = self.up(X)
        x = self.concat([x, skip_X])
        return self.encoder_block(x)

class AttentionGate(Layer):
    def __init__(self, filters, **kwargs):
        super().__init__(**kwargs)
        self.down = Conv2D(filters, 3, strides=2, padding='same', activation='relu')
        self.up = UpSampling2D()
        self.sigmoid = Conv2D(1, 1, activation='sigmoid')

    def call(self, inputs):
        X, skip_X = inputs
        x = self.down(X) + self.down(skip_X)
        x = self.sigmoid(x)
        return Multiply()([self.up(x), skip_X])

# ======================== LOAD MODELS ======================== #
MODEL_1_PATH = "./models/unetseg.h5"
MODEL_2_PATH = "./models/segmentation_model.h5"
custom_objects = {"EncoderBlock": EncoderBlock, "DecoderBlock": DecoderBlock, "AttentionGate": AttentionGate}

model1 = load_model(MODEL_1_PATH, custom_objects=custom_objects)
model2 = load_model(MODEL_2_PATH, custom_objects=custom_objects)

# ======================== VIT CLASSIFIER ======================== #
class ViT(nn.Module):
    def __init__(self, image_size, patch_size, num_channels, num_classes, embedding_size, num_heads, num_layers):
        super().__init__()
        self.embedding_conv = nn.Conv2d(num_channels, embedding_size, kernel_size=patch_size, stride=patch_size)
        self.class_token = nn.Parameter(torch.randn(1, 1, embedding_size))
        self.position_embeddings = nn.Parameter(torch.randn(1, 17, embedding_size))
        self.encoder = MasterEncoder(17, embedding_size, num_layers, num_heads)
        self.mlp = nn.Linear(embedding_size, num_classes)

    def forward(self, x):
        embeddings = self.embedding_conv(x)
        embeddings = embeddings.view(embeddings.shape[0], -1, embeddings.shape[1])
        class_tokens = self.class_token.expand(embeddings.shape[0], -1, -1)
        embeddings = torch.cat([class_tokens, embeddings], dim=1)
        embeddings = embeddings + self.position_embeddings
        x = self.encoder(embeddings)
        return self.mlp(x[:, 0])

vit_model = ViT(image_size=64, patch_size=16, num_channels=3, num_classes=2,
                embedding_size=256, num_heads=8, num_layers=6)
vit_model.load_state_dict(torch.load("./models/vit_model.pth", map_location=torch.device('cpu')))
vit_model.eval()

def classify_image(image_path):
    transform = tvt.Compose([tvt.Resize((64, 64)), tvt.ToTensor()])
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        output = vit_model(input_tensor)
        pred_class = torch.argmax(output, dim=1).item()
    return "Non-Cancerous" if pred_class == 1 else "Cancerous"

# ======================== IMAGE PROCESSING ======================== #
def preprocess_image(image_path, input_shape):
    img = cv2.imread(image_path, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (input_shape[1], input_shape[2]))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def generate_mask(model, image_path, output_filename):
    img = preprocess_image(image_path, model.input_shape)
    prediction = model.predict(img)[0, :, :, 0]
    mask = (prediction > 0.5).astype(np.uint8) * 255
    mask = cv2.bitwise_not(mask)
    cv2.imwrite(output_filename, mask)
    return output_filename

def count_cells(segmented_image):
    labeled_nuclei, num_cells = label(segmented_image, return_num=True)
    return num_cells, labeled_nuclei

def calculate_mitotic_index(mask_path):
    segmented_image = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
    total_cells, labeled_nuclei = count_cells(segmented_image)
    mitotic_cells = sum(1 for region in regionprops(labeled_nuclei) if region.area > 50)
    mitotic_index = (mitotic_cells / total_cells) * 100 if total_cells > 0 else 0
    return round(mitotic_index, 2)

# ======================== API ENDPOINTS ======================== #
@app.route("/segment", methods=["POST"])
def segment_images():
    if "image1" not in request.files or "image2" not in request.files:
        return jsonify({"error": "Both images are required"}), 400

    image1 = request.files["image1"]
    image2 = request.files["image2"]

    image1_path = os.path.join(UPLOAD_FOLDER, image1.filename)
    image2_path = os.path.join(UPLOAD_FOLDER, image2.filename)
    image1.save(image1_path)
    image2.save(image2_path)

    mask1_path = os.path.join(RESULT_FOLDER, f"mask_{image1.filename}")
    mask2_path = os.path.join(RESULT_FOLDER, f"mask_{image2.filename}")
    generate_mask(model1, image1_path, mask1_path)
    generate_mask(model2, image2_path, mask2_path)

    mitotic_index = calculate_mitotic_index(mask1_path)
    classification_result = classify_image(image1_path)

    base_url = "http://127.0.0.1:5000"
    return jsonify({
        "originalUrl1": f"{base_url}/uploads/{image1.filename}",
        "originalUrl2": f"{base_url}/uploads/{image2.filename}",
        "maskUrl1": f"{base_url}/results/mask_{image1.filename}",
        "maskUrl2": f"{base_url}/results/mask_{image2.filename}",
        "mitoticIndex": mitotic_index,
        "classificationResult": classification_result
    })

# ======================== SERVE STATIC FILES ======================== #
@app.route("/uploads/<filename>")
def serve_uploaded_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/results/<filename>")
def serve_result_image(filename):
    return send_from_directory(RESULT_FOLDER, filename)

# ======================== START FLASK SERVER ======================== #
if __name__ == "__main__":
    app.run(debug=True)
