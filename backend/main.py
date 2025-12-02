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

from fastapi import UploadFile, File
import shutil

@app.post("/users/{user_id}/avatar")
async def upload_avatar(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create avatars directory
    os.makedirs("static/avatars", exist_ok=True)
    
    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"avatar_{user_id}{file_extension}"
    file_path = f"static/avatars/{filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update user
    user.avatar_url = f"/static/avatars/{filename}"
    db.commit()
    db.refresh(user)
    
    return {"avatar_url": user.avatar_url}

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

# --- AI Hints ---
import llm_service

@app.post("/hint")
def get_hint(request: schemas.HintRequest):
    hint = llm_service.get_hint_from_ollama(request.question_text, request.model)
    return {"hint": hint}
