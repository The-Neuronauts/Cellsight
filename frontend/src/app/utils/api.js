export async function uploadImages(image1, image2) {
  const formData = new FormData();
  formData.append("image1", image1);
  formData.append("image2", image2);

  try {
    const response = await fetch("http://127.0.0.1:5000/segment", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload images. Please try again.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading images:", error);
    return { error: "Failed to upload images" };
  }
}
