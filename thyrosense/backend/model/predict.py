import numpy as np
import pandas as pd
import joblib
from pathlib import Path

MODEL_DIR = Path(__file__).parent

model         = joblib.load(MODEL_DIR / "best_ml_model.pkl")
scaler_stage7 = joblib.load(MODEL_DIR / "scaler.pkl")      # fitted on PCA output (train split)
label_encoder = joblib.load(MODEL_DIR / "label_encoder.pkl")
pca           = joblib.load(MODEL_DIR / "pca_95.pkl")       # fitted on stage5-scaled data

# Stage 5 scaler — fitted on full df numerical cols
# We must reconstruct this from the training medians/stds
# since it was not saved separately
# Solution: re-create a scaler using the known training statistics
# OR: add a one-time fix to the notebook to save scaler_stage5.pkl

# Raw feature order — 26 clinical features
RAW_FEATURE_COLS = [
    "age", "sex", "on_thyroxine", "query_on_thyroxine",
    "on_antithyroid_medication", "sick", "pregnant", "thyroid_surgery",
    "I131_treatment", "query_hypothyroid", "query_hyperthyroid",
    "lithium", "goitre", "tumor", "hypopituitary", "psych",
    "TSH_measured", "TSH", "T3_measured", "T3",
    "TT4_measured", "TT4", "T4U_measured", "T4U",
    "FTI_measured", "FTI"
]

NUMERICAL_COLS = ["age", "TSH", "T3", "TT4", "T4U", "FTI"]

HORMONE_MEDIANS = {
    "TSH": 1.4, "T3": 1.9, "TT4": 104.0, "T4U": 0.96, "FTI": 109.0
}

CLINICAL_INTERPRETATIONS = {
    "healthy": "Thyroid hormone levels and clinical indicators are within normal ranges. No thyroid disorder is detected. Routine annual monitoring is recommended.",
    "hypothyroid": "Elevated TSH combined with reduced thyroid hormone levels suggests reduced thyroid gland activity. Primary hypothyroidism is indicated. Clinical correlation and possible thyroxine replacement therapy should be considered.",
    "hyperthyroid": "Suppressed TSH with elevated T3 and T4 levels indicates overactive thyroid function. Hyperthyroidism is indicated. Further evaluation for Graves disease or toxic nodular goitre is recommended.",
    "binding_protein_disorder": "Abnormal binding protein levels detected. TBG abnormality may be affecting total thyroid hormone measurements. Free hormone levels and clinical context should guide further management.",
}

CLUSTER_MAP = {
    "healthy": 0,
    "binding_protein_disorder": 1,
    "hypothyroid": 2,
    "hyperthyroid": 3
}

CLINICAL_FEATURE_NAMES = {
    f"PC{i+1}": name for i, name in enumerate([
        "Hormone Panel (TSH/T4)", "T3 / Triiodothyronine",
        "Measurement Completeness", "Clinical Flags",
        "Age & Demographics", "Antithyroid Medication",
        "Secondary Indicators", "Binding Protein Signal",
        "Goitre / Tumor Flags", "Treatment History", "Residual Variance"
    ])
}

# Load Stage 5 scaler — must be saved from notebook
# If missing: run the one-time fix below in Kaggle and re-download
try:
    scaler_stage5 = joblib.load(MODEL_DIR / "scaler_stage5.pkl")
    HAS_STAGE5_SCALER = True
except FileNotFoundError:
    HAS_STAGE5_SCALER = False
    print("WARNING: scaler_stage5.pkl not found — predictions will be inaccurate")

def run_prediction(data: dict) -> dict:
    # step 1: build raw feature row
    row = {}
    for col in RAW_FEATURE_COLS:
        val = data.get(col)
        if val is None and col in HORMONE_MEDIANS:
            val = HORMONE_MEDIANS[col]
        elif val is None:
            val = 0
        row[col] = float(val)

    raw_df = pd.DataFrame([row], columns=RAW_FEATURE_COLS)

    # step 2: apply Stage 5 scaler (fitted on full df numerical cols)
    if HAS_STAGE5_SCALER:
        raw_df[NUMERICAL_COLS] = scaler_stage5.transform(raw_df[NUMERICAL_COLS])

    # step 3: PCA transform (26 → 11 components)
    pca_array = pca.transform(raw_df.values)

    # step 4: apply Stage 7 scaler (fitted on PCA train split)
    pca_scaled = scaler_stage7.transform(pca_array)

    # step 5: predict
    pred_encoded    = model.predict(pca_scaled)[0]
    pred_proba      = model.predict_proba(pca_scaled)[0]
    predicted_class = label_encoder.inverse_transform([pred_encoded])[0]
    confidence      = float(np.max(pred_proba))

    # step 6: feature importance
    importances = model.feature_importances_
    top_indices = np.argsort(importances)[::-1][:5]
    top_features = [
        {
            "feature": CLINICAL_FEATURE_NAMES.get(f"PC{i+1}", f"PC{i+1}"),
            "shap_value": round(float(importances[i]), 4)
        }
        for i in top_indices
    ]

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence, 4),
        "cluster_id": CLUSTER_MAP.get(predicted_class, 0),
        "top_features": top_features,
        "clinical_interpretation": CLINICAL_INTERPRETATIONS.get(predicted_class, ""),
    }