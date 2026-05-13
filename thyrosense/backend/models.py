from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import json
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'patient' or 'doctor'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)
    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)


class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    specialty = Column(String, default="Endocrinology")
    institution = Column(String, default="General Hospital")

    user = relationship("User", back_populates="doctor_profile")


class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    dob = Column(String)
    sex = Column(String)
    phone = Column(String)
    age = Column(Integer, nullable=True)
    risk_level = Column(String, default="low")
    status = Column(String, default="Active")

    user = relationship("User", back_populates="patient_profile")
    predictions = relationship("Prediction", back_populates="patient_profile")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    patient_profile_id = Column(Integer, ForeignKey("patient_profiles.id"))
    predicted_class = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    cluster_id = Column(Integer)
    top_features_json = Column(Text)
    form_data_json = Column(Text)
    clinical_interpretation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient_profile = relationship("PatientProfile", back_populates="predictions")
    notes = relationship("ClinicalNote", back_populates="prediction")

    @property
    def top_features(self):
        return json.loads(self.top_features_json) if self.top_features_json else []

    @property
    def form_data(self):
        return json.loads(self.form_data_json) if self.form_data_json else {}


class ClinicalNote(Base):
    __tablename__ = "clinical_notes"

    id            = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"))
    doctor_id     = Column(Integer, ForeignKey("users.id"))
    note          = Column(Text, nullable=False)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    prediction = relationship("Prediction", back_populates="notes")
    doctor     = relationship("User")
