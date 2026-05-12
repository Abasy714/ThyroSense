from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from database import get_db
from models import User, PatientProfile
from schemas import PatientOut
import json

router = APIRouter(prefix="/patients", tags=["patients"])


def _build_patient_out(profile: PatientProfile) -> dict:
    preds = []
    for p in sorted(profile.predictions, key=lambda x: x.created_at or 0, reverse=True):
        preds.append({
            "id": p.id,
            "predicted_class": p.predicted_class,
            "confidence": p.confidence,
            "cluster_id": p.cluster_id,
            "top_features": json.loads(p.top_features_json) if p.top_features_json else [],
            "clinical_interpretation": p.clinical_interpretation or "",
            "form_data": json.loads(p.form_data_json) if p.form_data_json else {},
            "created_at": p.created_at,
        })
    return {
        "id": profile.id,
        "full_name": profile.user.full_name,
        "email": profile.user.email,
        "dob": profile.dob,
        "sex": profile.sex,
        "phone": profile.phone,
        "risk_level": profile.risk_level,
        "status": profile.status,
        "predictions": preds,
    }


@router.get("", response_model=List[PatientOut])
def list_patients(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role != "doctor":
        raise HTTPException(status_code=403, detail="Doctor access only")

    profiles = (
        db.query(PatientProfile)
        .options(joinedload(PatientProfile.user), joinedload(PatientProfile.predictions))
        .all()
    )
    return [_build_patient_out(p) for p in profiles]


@router.get("/me", response_model=PatientOut)
def get_my_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role != "patient":
        raise HTTPException(status_code=403, detail="Patient access only")

    profile = (
        db.query(PatientProfile)
        .options(joinedload(PatientProfile.user), joinedload(PatientProfile.predictions))
        .filter(PatientProfile.user_id == user_id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    return _build_patient_out(profile)


@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role != "doctor":
        raise HTTPException(status_code=403, detail="Doctor access only")

    profile = (
        db.query(PatientProfile)
        .options(joinedload(PatientProfile.user), joinedload(PatientProfile.predictions))
        .filter(PatientProfile.id == patient_id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")

    return _build_patient_out(profile)
