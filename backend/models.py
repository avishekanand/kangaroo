from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    # Unified Schema
    source = Column(String, index=True) # e.g. "OlymMATH"
    external_id = Column(String, index=True) # Original ID
    
    problem = Column(String, nullable=True) # The question text (nullable for image-only)
    image_path = Column(String, nullable=True) # Path to question image
    solution = Column(String, nullable=True) # Step-by-step solution/CoT
    answer = Column(String, nullable=True) # Final answer
    
    topic = Column(String, nullable=True)
    difficulty = Column(Integer, nullable=True) # Changed to Integer
    
    options = Column(JSON, nullable=True) # For MCQs
    correct_option_label = Column(String, nullable=True) # For MCQs
    
    meta_data = Column(JSON, nullable=True) # Original record
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # pdf relationship removed

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    attempts = relationship("Attempt", back_populates="user")

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_option = Column(String)
    is_correct = Column(Boolean)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="attempts")
    question = relationship("Question")
