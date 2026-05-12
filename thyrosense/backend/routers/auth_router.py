from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, DoctorProfile, PatientProfile
from schemas import RegisterRequest, LoginRequest
from auth import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_dict(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "name": user.full_name,
        "role": user.role,
    }


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=req.email,
        full_name=req.full_name,
        hashed_password=hash_password(req.password),
        role=req.role,
    )
    db.add(user)
    db.flush()

    if req.role == "doctor":
        db.add(DoctorProfile(user_id=user.id))
    else:
        db.add(PatientProfile(
            user_id=user.id,
            dob=req.dob,
            sex=req.sex,
            phone=req.phone,
        ))

    db.commit()
    db.refresh(user)
    return {"user": _user_dict(user)}


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.email == req.email,
        User.role == req.role
    ).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user": _user_dict(user)}
