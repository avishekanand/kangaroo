from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import random

from database import get_db
import models
import schemas

router = APIRouter()

@router.get("/questions", response_model=List[schemas.Question])
def list_questions(
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(models.Question)
    if active_only:
        query = query.filter(models.Question.is_active == True)
    
    return query.offset(skip).limit(limit).all()

@router.patch("/questions/{question_id}", response_model=schemas.Question)
def update_question(
    question_id: int, 
    question_update: schemas.QuestionUpdate, 
    db: Session = Depends(get_db)
):
    db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    update_data = question_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_question, key, value)
    
    db.commit()
    db.refresh(db_question)
    return db_question

@router.post("/sessions", response_model=List[schemas.Question])
def create_session(
    session_config: schemas.SessionCreate,
    db: Session = Depends(get_db)
):
    query = db.query(models.Question).filter(models.Question.is_active == True)
    
    if session_config.topics:
        # Simple filter - in real app might need more complex topic matching
        # For now, let's assume exact match or just ignore if empty
        pass 
    
    if session_config.source:
        query = query.filter(models.Question.source == session_config.source)
        
    if session_config.difficulty_min:
        query = query.filter(models.Question.difficulty >= session_config.difficulty_min)
    if session_config.difficulty_max:
        query = query.filter(models.Question.difficulty <= session_config.difficulty_max)

    # Get all matching questions
    all_questions = query.all()

    # Filter by user attempts if user_id is provided
    if session_config.user_id:
        attempted_ids = db.query(models.Attempt.question_id).filter(models.Attempt.user_id == session_config.user_id).all()
        attempted_ids = {id[0] for id in attempted_ids}
        
        unattempted_questions = [q for q in all_questions if q.id not in attempted_ids]
        
        if len(unattempted_questions) >= session_config.limit:
            questions = random.sample(unattempted_questions, session_config.limit)
        else:
            # Not enough unattempted, take all unattempted and fill with attempted
            needed = session_config.limit - len(unattempted_questions)
            attempted_questions = [q for q in all_questions if q.id in attempted_ids]
            
            # If we still don't have enough total (unattempted + attempted), just take everything
            if len(attempted_questions) < needed:
                 questions = unattempted_questions + attempted_questions
            else:
                 questions = unattempted_questions + random.sample(attempted_questions, needed)
            
            random.shuffle(questions)
    else:
        # No user, just random sample
        if len(all_questions) > session_config.limit:
            questions = random.sample(all_questions, session_config.limit)
        else:
            questions = all_questions
            random.shuffle(questions)
        
    return questions

@router.get("/questions/olympiad", response_model=List[schemas.Question])
def get_olympiad_questions(
    limit: int = 20,
    source: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Question).filter(models.Question.is_active == True)
    
    if source:
        query = query.filter(models.Question.source == source)
        
    questions = query.all()
        
    if len(questions) > limit:
        questions = random.sample(questions, limit)
    else:
        random.shuffle(questions)
        
    return questions
