from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from predictor import predict_image
from disease_data.tomato_disease_info import tomato_disease_info

# CREATE FASTAPI APP
app = FastAPI()

# ENABLE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HOME ROUTE
@app.get("/")
def home():

    return {
        "message": "AgroSense AI Backend Running"
    }

# PREDICTION ROUTE
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # READ IMAGE
    image_bytes = await file.read()

    image = Image.open(io.BytesIO(image_bytes))

    # AI PREDICTION
    predictions = predict_image(image)

    # BEST RESULT
    best_prediction = predictions[0]["disease"]

    # GET DISEASE INFO
    report = tomato_disease_info.get(best_prediction, {})

    # RETURN JSON
    return {

        "top3_predictions": predictions,

        "severity":
        report.get("severity", "UNKNOWN"),

        "risk":
        report.get("risk", "UNKNOWN"),

        "treatments":
        report.get("treatments", []),

        "spread_probability":
        report.get("spread_probability", ""),

        "weather_warning":
        report.get("weather_warning", ""),

        "yield_impact":
        report.get("yield_impact", ""),

        "recovery_time":
        report.get("recovery_time", ""),

        "prevention":
        report.get("prevention", [])
    }