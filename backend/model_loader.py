import torch
import torch.nn as nn
from torchvision import models, datasets, transforms

# DEVICE
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# DATASET PATH
dataset_path = r"C:\Users\Eshan\agrosense\data\tomato_dataset"

# IMAGE TRANSFORM
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# LOAD DATASET
tomato_dataset = datasets.ImageFolder(
    root=dataset_path,
    transform=transform
)

# BUILD MODEL
model = models.mobilenet_v2(weights=None)

# MODIFY FINAL LAYER
num_features = model.classifier[1].in_features

model.classifier[1] = nn.Linear(
    num_features,
    len(tomato_dataset.classes)
)

# MODEL PATH
model_path = r"C:\Users\Eshan\agrosense\models\tomato_model.pth"

# LOAD TRAINED WEIGHTS
model.load_state_dict(
    torch.load(model_path, map_location=device)
)

# MOVE TO DEVICE
model = model.to(device)

# EVALUATION MODE
model.eval()

print("✅ AgroSense Tomato Model Loaded Successfully")