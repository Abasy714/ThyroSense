from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

app = FastAPI(title="ThyroSense API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PatientInput(BaseModel):
    data: dict[str, Any]


class LoginRequest(BaseModel):
    email: str
    password: str
    role: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str
    license_no: str | None = None
    dob: str | None = None
    phone: str | None = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str


class FeatureImportance(BaseModel):
    feature: str
    shap_value: float


class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    cluster_id: int
    top_features: list[FeatureImportance]
    clinical_interpretation: str


@app.get("/")
def health_check():
    return {"status": "ok", "app": "ThyroSense"}


@app.post("/predict", response_model=PredictionResponse)
def predict(patient: PatientInput):
    # TODO: replace mock with real pipeline once model is exported from notebook
    return PredictionResponse(
        predicted_class="healthy",
        confidence=0.91,
        cluster_id=2,
        top_features=[
            FeatureImportance(feature="TSH", shap_value=0.42),
            FeatureImportance(feature="FTI", shap_value=0.31),
            FeatureImportance(feature="on_thyroxine", shap_value=0.18),
            FeatureImportance(feature="T3", shap_value=0.12),
            FeatureImportance(feature="TT4", shap_value=0.09),
        ],
        clinical_interpretation=(
            "No thyroid disorder detected. Hormone levels are within normal range."
        ),
    )
