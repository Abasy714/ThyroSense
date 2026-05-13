from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from database import get_db
from models import User, PatientProfile, Prediction, ClinicalNote
from schemas import PatientOut
import json

router = APIRouter(prefix="/patients", tags=["patients"])


def _serialize_note(n) -> dict:
    return {
        "id": n.id,
        "doctor_name": n.doctor.full_name if n.doctor else "Unknown",
        "note": n.note,
        "created_at": n.created_at.isoformat(),
    }


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
            "notes": [_serialize_note(n) for n in sorted(p.notes, key=lambda n: n.created_at, reverse=True)],
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
        .options(
            joinedload(PatientProfile.user),
            joinedload(PatientProfile.predictions).joinedload(Prediction.notes).joinedload(ClinicalNote.doctor),
        )
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
        .options(
            joinedload(PatientProfile.user),
            joinedload(PatientProfile.predictions).joinedload(Prediction.notes).joinedload(ClinicalNote.doctor),
        )
        .filter(PatientProfile.user_id == user_id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    return _build_patient_out(profile)


@router.post("/predictions/{prediction_id}/notes")
def add_note(prediction_id: int, data: dict, db: Session = Depends(get_db)):
    doctor_id = data.get("doctor_id")
    note_text = (data.get("note") or "").strip()

    if not note_text:
        raise HTTPException(status_code=400, detail="Note cannot be empty")

    doctor = db.query(User).filter(User.id == doctor_id, User.role == "doctor").first()
    if not doctor:
        raise HTTPException(status_code=403, detail="Doctor access only")

    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    note = ClinicalNote(prediction_id=prediction_id, doctor_id=doctor_id, note=note_text)
    db.add(note)
    db.commit()
    db.refresh(note)

    return {
        "id": note.id,
        "prediction_id": note.prediction_id,
        "doctor_name": doctor.full_name,
        "note": note.note,
        "created_at": note.created_at.isoformat(),
    }


@router.get("/predictions/{prediction_id}/notes")
def get_notes(prediction_id: int, db: Session = Depends(get_db)):
    notes = (
        db.query(ClinicalNote)
        .filter(ClinicalNote.prediction_id == prediction_id)
        .options(joinedload(ClinicalNote.doctor))
        .order_by(ClinicalNote.created_at.desc())
        .all()
    )
    return [_serialize_note(n) for n in notes]


@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role != "doctor":
        raise HTTPException(status_code=403, detail="Doctor access only")

    profile = (
        db.query(PatientProfile)
        .options(
            joinedload(PatientProfile.user),
            joinedload(PatientProfile.predictions).joinedload(Prediction.notes).joinedload(ClinicalNote.doctor),
        )
        .filter(PatientProfile.id == patient_id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")

    return _build_patient_out(profile)
