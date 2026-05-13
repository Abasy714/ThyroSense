from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, DoctorProfile, PatientProfile

router = APIRouter(prefix="/profile", tags=["profile"])


@router.put("")
def update_profile(data: dict, db: Session = Depends(get_db)):
    user_id = data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id required")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if "full_name" in data and data["full_name"]:
        user.full_name = data["full_name"]

    if user.role == "doctor":
        profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == user_id).first()
        if profile:
            if "specialty" in data and data["specialty"] is not None:
                profile.specialty = data["specialty"]
            if "hospital" in data and data["hospital"] is not None:
                profile.institution = data["hospital"]

    elif user.role == "patient":
        profile = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()
        if profile:
            if "phone" in data:
                profile.phone = data["phone"]
            if "dob" in data:
                profile.dob = data["dob"]
            if "age" in data and data["age"] is not None:
                try:
                    profile.age = int(data["age"])
                except (ValueError, TypeError):
                    pass
            if "sex" in data and data["sex"] in ("M", "F"):
                profile.sex = data["sex"]

    db.commit()
    return {"ok": True, "name": user.full_name}
