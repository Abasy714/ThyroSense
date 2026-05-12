from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

app = FastAPI(title="ThyroSense API", version="0.1.0")

# Allow requests from the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PatientInput(BaseModel):
    """Accepts arbitrary patient lab values as key-value pairs.
    Exact fields will be validated once the model schema is finalised."""
    data: dict[str, Any]


class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    cluster_id: int
    top_features: list
    clinical_interpretation: str


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/")
def health_check():
    """Liveness probe — confirms the API is running."""
    return {"status": "ok", "app": "ThyroSense"}


# ---------------------------------------------------------------------------
# Prediction endpoint
# ---------------------------------------------------------------------------

@app.post("/predict", response_model=PredictionResponse)
def predict(patient: PatientInput):
    """Accepts patient lab data and returns a thyroid disorder prediction.

    Currently returns a mock response. Wire up pipeline/predict.py once the
    model artefact has been exported from the notebook.
    """
    # TODO: replace mock with real pipeline call
    # from pipeline.predict import preprocess, predict as run_predict, get_shap_values, get_cluster
    # processed = preprocess(patient.data)
    # result = run_predict(processed)
    # ...

    return PredictionResponse(
        predicted_class="healthy",
        confidence=0.91,
        cluster_id=2,
        top_features=[],
        clinical_interpretation="No thyroid disorder detected.",
    )
