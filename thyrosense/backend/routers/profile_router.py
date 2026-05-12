from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import User, DoctorProfile

router = APIRouter(prefix="/profile", tags=["profile"])


class ProfileUpdateRequest(BaseModel):
    user_id: int
    full_name: Optional[str] = None
    specialty: Optional[str] = None
    hospital: Optional[str] = None


@router.put("")
def update_profile(req: ProfileUpdateRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user or user.role != "doctor":
        raise HTTPException(status_code=403, detail="Doctor access only")

    if req.full_name:
        user.full_name = req.full_name

    profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == req.user_id).first()
    if profile:
        if req.specialty is not None:
            profile.specialty = req.specialty
        if req.hospital is not None:
            profile.institution = req.hospital

    db.commit()
    return {"ok": True, "name": user.full_name}
