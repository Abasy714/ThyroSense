from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal
import models
from routers import auth_router, patient_router, predict_router, profile_router
from seed import seed_database

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ThyroSense API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

app.include_router(auth_router.router)
app.include_router(patient_router.router)
app.include_router(predict_router.router)
app.include_router(profile_router.router)

@app.get("/")
def health():
    return {"status": "ok", "app": "ThyroSense", "version": "1.0.0"}