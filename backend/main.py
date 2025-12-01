from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import questions
import os

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Math Practice App")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
os.makedirs("static/questions", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
# app.include_router(pdfs.router, tags=["pdfs"])
app.include_router(questions.router, tags=["questions"])

# --- User Management & Seeding ---
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from database import get_db
import schemas

@app.on_event("startup")
def seed_users():
    db = next(get_db())
    try:
        users = ["Ananya", "Admin", "Guest"]
        for username in users:
            user = db.query(models.User).filter(models.User.username == username).first()
            if not user:
                new_user = models.User(username=username)
                db.add(new_user)
        db.commit()
        print("Users seeded successfully.")
    except Exception as e:
        print(f"Error seeding users: {e}")
    finally:
        db.close()

@app.get("/users", response_model=list[schemas.User])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.post("/attempts", response_model=schemas.Attempt)
def create_attempt(attempt: schemas.AttemptCreate, db: Session = Depends(get_db)):
    db_attempt = models.Attempt(**attempt.dict())
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    return db_attempt

@app.get("/users/{user_id}/history", response_model=list[schemas.Attempt])
def get_user_history(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Attempt).filter(models.Attempt.user_id == user_id).all()

@app.get("/")
def read_root():
    return {"message": "Math Practice API is running"}
