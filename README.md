# ThyroSense

ThyroSense is a clinical decision-support web application for thyroid disorder detection. It accepts patient lab values, runs them through a trained XGBoost classifier with SMOTE-balanced training data, and returns a predicted thyroid class, confidence score, cluster assignment, and SHAP-based feature importance explanations — all rendered in a clean React interface.

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Recharts, Axios   |
| Backend    | Python 3.11+, FastAPI, Uvicorn                  |
| ML         | XGBoost, scikit-learn, SHAP, imbalanced-learn   |
| Notebook   | Jupyter, pandas, numpy, matplotlib, seaborn     |

## Folder Structure

```
thyrosense/
├── backend/           FastAPI server + prediction pipeline
│   ├── main.py
│   ├── requirements.txt
│   ├── model/         Trained model artifacts (not committed)
│   └── pipeline/
│       └── predict.py
├── frontend/          React + Vite SPA
│   ├── src/
│   │   ├── pages/     InputForm, ResultScreen
│   │   └── components/ ShapChart, Dashboard
│   └── ...
└── notebook/          EDA + model training pipeline
    ├── data/          Raw dataset (not committed)
    └── thyrosense_pipeline.ipynb
```

## Setup

### Backend

```bash
cd thyrosense/backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API will be available at `http://localhost:8000`. Visit `/docs` for the Swagger UI.

### Frontend

```bash
cd thyrosense/frontend
npm install
npm run dev
```

App will be available at `http://localhost:5173`.

### Notebook

```bash
cd thyrosense/notebook
jupyter notebook thyrosense_pipeline.ipynb
```

Place the raw dataset CSV in `notebook/data/` before running.

## Running the Full App

1. Start the backend: `uvicorn main:app --reload` (from `backend/`)
2. Start the frontend: `npm run dev` (from `frontend/`)
3. Open `http://localhost:5173` in your browser
4. Fill in patient lab values and submit to receive a prediction
