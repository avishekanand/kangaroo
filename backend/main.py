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

@app.get("/")
def read_root():
    return {"message": "Math Practice API is running"}
