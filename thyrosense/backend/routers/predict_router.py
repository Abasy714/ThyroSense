from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, PatientProfile, Prediction
from schemas import PredictRequest, PredictResponse
from model.predict import run_prediction
import json

router = APIRouter(prefix="/predict", tags=["predict"])

RISK_MAP = {
    "healthy": "low",
    "hypothyroid": "medium",
    "hyperthyroid": "high",
    "binding_protein_disorder": "medium",
}


@router.post("", response_model=PredictResponse)
def predict(req: PredictRequest, user_id: int = 0, db: Session = Depends(get_db)):
    data = req.model_dump()
    result = run_prediction(data)

    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user and user.role == "patient":
            profile = db.query(PatientProfile).filter(
                PatientProfile.user_id == user_id
            ).first()
            if profile:
                db.add(Prediction(
                    patient_profile_id=profile.id,
                    predicted_class=result["predicted_class"],
                    confidence=result["confidence"],
                    cluster_id=result["cluster_id"],
                    top_features_json=json.dumps(result["top_features"]),
                    form_data_json=json.dumps(data),
                    clinical_interpretation=result["clinical_interpretation"],
                ))
                profile.risk_level = RISK_MAP.get(result["predicted_class"], "low")
                db.commit()

    return result


@router.get("/model-results")
def model_results():
    return {"results": get_gridsearch_results()}
