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
    difficulty = Column(String, nullable=True) # Changed to String
    
    options = Column(JSON, nullable=True) # For MCQs
    correct_option_label = Column(String, nullable=True) # For MCQs
    
    meta_data = Column(JSON, nullable=True) # Original record
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # pdf relationship removed
