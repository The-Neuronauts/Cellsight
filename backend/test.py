import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer, Conv2D, Dropout, MaxPool2D, UpSampling2D, concatenate, Multiply
import numpy as np
import cv2
import os

# Custom EncoderBlock, DecoderBlock, and AttentionGate classes
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

# Paths to your models
MODEL_1_PATH = "./models/unetseg.h5"  # First U-Net model
MODEL_2_PATH = "./models/segmentation_model.h5"  # Second segmentation model

# Custom objects dictionary
custom_objects = {"EncoderBlock": EncoderBlock, "DecoderBlock": DecoderBlock, "AttentionGate": AttentionGate}

# Load a U-Net model with custom objects handling
def load_unet_model(model_path):
    model = load_model(model_path, custom_objects=custom_objects)
    return model

# Print model details
def model_info(model):
    print("Model Summary:")
    model.summary()  # Print model architecture
    print("\nModel Input Shape:", model.input_shape)
    print("Model Output Shape:", model.output_shape)
    print("Total Parameters:", model.count_params())

# Preprocess an image before feeding it to the model
def preprocess_image(image_path, input_shape):
    img = cv2.imread(image_path, cv2.IMREAD_COLOR)  # Read image
    img = cv2.resize(img, (input_shape[1], input_shape[2]))  # Resize
    img = img / 255.0  # Normalize
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

# Convert model output to a proper image format
def process_prediction(prediction):
    pred_mask = prediction[0, :, :, 0]  # Extract first channel
    pred_mask = (pred_mask > 0.5).astype(np.uint8) * 255  # Binarize mask
    return pred_mask

# Test a model with a sample image
def test_unet_model(model, test_image_path, output_filename):
    input_shape = model.input_shape  # Get input shape
    img = preprocess_image(test_image_path, input_shape)
    prediction = model.predict(img)  # Get segmentation output
    print("Prediction Shape:", prediction.shape)
    pred_mask = process_prediction(prediction)
    cv2.imwrite(output_filename, pred_mask)  # Save the mask as a grayscale image
    print(f"Predicted mask saved as '{output_filename}'")

# Run testing for both models
if __name__ == "__main__":
    if os.path.exists(MODEL_1_PATH):
        unet_model_1 = load_unet_model(MODEL_1_PATH)
        model_info(unet_model_1)
        TEST_IMAGE_1_PATH = "image1.png"  # Test image for first model
        if os.path.exists(TEST_IMAGE_1_PATH):
            test_unet_model(unet_model_1, TEST_IMAGE_1_PATH, "predicted_mask_1.png")
        else:
            print(f"Error: Test image '{TEST_IMAGE_1_PATH}' not found.")
    else:
        print(f"Error: Model file '{MODEL_1_PATH}' not found.")

    if os.path.exists(MODEL_2_PATH):
        unet_model_2 = load_unet_model(MODEL_2_PATH)
        model_info(unet_model_2)
        TEST_IMAGE_2_PATH = "image2.png"  # Test image for second model
        if os.path.exists(TEST_IMAGE_2_PATH):
            test_unet_model(unet_model_2, TEST_IMAGE_2_PATH, "predicted_mask_2.png")
        else:
            print(f"Error: Test image '{TEST_IMAGE_2_PATH}' not found.")
    else:
        print(f"Error: Model file '{MODEL_2_PATH}' not found.")