from PIL import Image
import torch
from torchvision import transforms

from model_loader import model, tomato_dataset, device

# Image Transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])


def predict_image(image):

    # Convert image to RGB
    image = image.convert("RGB")

    # Apply transformations
    input_tensor = transform(image)

    # Add batch dimension
    input_tensor = input_tensor.unsqueeze(0)

    # Move to GPU/CPU
    input_tensor = input_tensor.to(device)

    # Prediction
    with torch.no_grad():

        outputs = model(input_tensor)

        probabilities = torch.softmax(outputs, dim=1)

        top3_prob, top3_catid = torch.topk(probabilities, 3)

    results = []

    # Extract Top 3 Predictions
    for i in range(3):

        disease = tomato_dataset.classes[
            top3_catid[0][i]
        ]

        confidence = round(
            top3_prob[0][i].item() * 100,
            2
        )

        results.append({
            "disease": disease,
            "confidence": confidence
        })

    # Confidence Threshold Check
    best_confidence = results[0]["confidence"]

    if best_confidence < 60:
        return [{
            "disease": "Uncertain Prediction",
            "confidence": best_confidence
        }]

    return results