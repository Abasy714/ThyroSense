from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str
    dob: Optional[str] = None
    sex: Optional[str] = None
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: str


class TokenResponse(BaseModel):
    token: str
    user: dict


class FeatureImportance(BaseModel):
    feature: str
    shap_value: float


class PredictRequest(BaseModel):
    age: float
    sex: int
    TSH: float
    T3: float
    TT4: float
    T4U: float
    FTI: float
    on_thyroxine: int
    query_on_thyroxine: int = 0
    on_antithyroid_medication: int = 0
    sick: int = 0
    pregnant: int = 0
    thyroid_surgery: int = 0
    I131_treatment: int = 0
    query_hypothyroid: int = 0
    query_hyperthyroid: int = 0
    lithium: int = 0
    goitre: int = 0
    tumor: int = 0
    hypopituitary: int = 0
    psych: int = 0
    TSH_measured: int = 1
    T3_measured: int = 1
    TT4_measured: int = 1
    T4U_measured: int = 1
    FTI_measured: int = 1


class PredictResponse(BaseModel):
    predicted_class: str
    confidence: float
    cluster_id: int
    top_features: List[FeatureImportance]
    clinical_interpretation: str


class NoteOut(BaseModel):
    id: int
    doctor_name: str
    note: str
    created_at: str

    class Config:
        from_attributes = True


class PredictionOut(BaseModel):
    id: int
    predicted_class: str
    confidence: float
    cluster_id: int
    top_features: List[FeatureImportance]
    clinical_interpretation: str
    form_data: dict
    created_at: datetime
    notes: List[NoteOut] = []

    class Config:
        from_attributes = True


class PatientOut(BaseModel):
    id: int
    full_name: str
    email: str
    dob: Optional[str]
    sex: Optional[str]
    phone: Optional[str]
    risk_level: str
    status: str
    predictions: List[PredictionOut] = []

    class Config:
        from_attributes = True
