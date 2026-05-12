import random
from datetime import date, timedelta
from sqlalchemy.orm import Session
from models import User, DoctorProfile, PatientProfile, Prediction
from auth import hash_password
import json

PATIENTS = [
    ("Alice Johnson", "F", "healthy"),
    ("Bob Martinez", "M", "healthy"),
    ("Carol White", "F", "healthy"),
    ("David Brown", "M", "healthy"),
    ("Emma Davis", "F", "healthy"),
    ("Frank Wilson", "M", "hypothyroid"),
    ("Grace Lee", "F", "hypothyroid"),
    ("Henry Taylor", "M", "hypothyroid"),
    ("Isabella Anderson", "F", "hyperthyroid"),
    ("James Thomas", "M", "hyperthyroid"),
    ("Karen Jackson", "F", "binding_protein_disorder"),
    ("Liam Harris", "M", "binding_protein_disorder"),
]

RISK_MAP = {
    "healthy": "low",
    "hypothyroid": "medium",
    "hyperthyroid": "high",
    "binding_protein_disorder": "medium",
}

INTERP = {
    "healthy": "Thyroid function within normal range. No intervention required.",
    "hypothyroid": "TSH elevated above reference range. Consistent with hypothyroidism.",
    "hyperthyroid": "TSH suppressed with elevated free hormone levels. Consistent with hyperthyroidism.",
    "binding_protein_disorder": "Abnormal TT4/FTI ratio suggests binding protein abnormality.",
}

TOP_FEATURES = {
    "healthy": [
        {"feature": "TSH", "shap_value": 0.12},
        {"feature": "FTI", "shap_value": 0.09},
        {"feature": "TT4", "shap_value": 0.07},
    ],
    "hypothyroid": [
        {"feature": "TSH", "shap_value": 0.45},
        {"feature": "FTI", "shap_value": -0.22},
        {"feature": "T3", "shap_value": -0.18},
    ],
    "hyperthyroid": [
        {"feature": "TSH", "shap_value": -0.41},
        {"feature": "FTI", "shap_value": 0.38},
        {"feature": "TT4", "shap_value": 0.29},
    ],
    "binding_protein_disorder": [
        {"feature": "TT4", "shap_value": 0.35},
        {"feature": "FTI", "shap_value": -0.31},
        {"feature": "T4U", "shap_value": 0.27},
    ],
}


def _random_dob(min_age=25, max_age=75):
    days = random.randint(min_age * 365, max_age * 365)
    return (date.today() - timedelta(days=days)).isoformat()


def _make_form_data(cls, sex):
    if cls == "hypothyroid":
        tsh = round(random.uniform(5.5, 18.0), 2)
        fti = round(random.uniform(40, 75), 2)
    elif cls == "hyperthyroid":
        tsh = round(random.uniform(0.01, 0.29), 3)
        fti = round(random.uniform(120, 200), 2)
    elif cls == "binding_protein_disorder":
        tsh = round(random.uniform(0.5, 4.0), 2)
        fti = round(random.uniform(60, 90), 2)
    else:
        tsh = round(random.uniform(0.4, 4.5), 2)
        fti = round(random.uniform(80, 110), 2)

    return {
        "age": random.randint(25, 75),
        "sex": 0 if sex == "F" else 1,
        "TSH": tsh,
        "T3": round(random.uniform(1.2, 3.1), 2),
        "TT4": round(random.uniform(60, 160), 2),
        "T4U": round(random.uniform(0.7, 1.3), 2),
        "FTI": fti,
        "on_thyroxine": 0,
        "on_antithyroid_medication": 0,
        "sick": 0,
        "pregnant": 0,
        "thyroid_surgery": 0,
        "I131_treatment": 0,
        "query_hypothyroid": 0,
        "query_hyperthyroid": 0,
        "lithium": 0,
        "goitre": 0,
        "tumor": 0,
        "hypopituitary": 0,
        "psych": 0,
        "TSH_measured": 1,
        "T3_measured": 1,
        "TT4_measured": 1,
        "T4U_measured": 1,
        "FTI_measured": 1,
    }


def seed_database(db: Session):
    if db.query(User).filter(User.role == "patient").first():
        return

    doctor_user = User(
        email="dr.carter@thyrosense.com",
        full_name="Eleanor Carter",
        hashed_password=hash_password("doctor123"),
        role="doctor",
    )
    db.add(doctor_user)
    db.flush()
    db.add(DoctorProfile(user_id=doctor_user.id, specialty="Endocrinology", institution="ThyroSense Medical Center"))

    for i, (name, sex, cls) in enumerate(PATIENTS):
        user = User(
            email=f"patient{i+1:02d}@thyrosense.com",
            full_name=name,
            hashed_password=hash_password("patient123"),
            role="patient",
        )
        db.add(user)
        db.flush()

        profile = PatientProfile(
            user_id=user.id,
            dob=_random_dob(),
            sex=sex,
            phone=f"+1-555-{random.randint(1000, 9999):04d}",
            risk_level=RISK_MAP[cls],
            status="Active",
        )
        db.add(profile)
        db.flush()

        num_preds = random.randint(1, 3)
        for _ in range(num_preds):
            form = _make_form_data(cls, sex)
            db.add(Prediction(
                patient_profile_id=profile.id,
                predicted_class=cls,
                confidence=round(random.uniform(0.72, 0.98), 4),
                cluster_id=random.randint(0, 3),
                top_features_json=json.dumps(TOP_FEATURES[cls]),
                form_data_json=json.dumps(form),
                clinical_interpretation=INTERP[cls],
            ))

    db.commit()
