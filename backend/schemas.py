
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QuestionBase(BaseModel):
    source: str
    external_id: str
    problem: Optional[str] = None
    image_path: Optional[str] = None
    solution: Optional[str] = None
    answer: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[int] = None
    options: Optional[List[str]] = None
    correct_option_label: Optional[str] = None
    is_active: bool = True

    class Config:
        orm_mode = True

class QuestionCreate(QuestionBase):
    meta_data: Optional[dict] = None

class QuestionUpdate(BaseModel):
    topic: Optional[str] = None
    difficulty: Optional[str] = None
    is_active: Optional[bool] = None

class Question(QuestionBase):
    id: int
    meta_data: Optional[dict] = None

class SessionCreate(BaseModel):
    limit: int = 10
    difficulty_min: Optional[int] = None
    difficulty_max: Optional[int] = None
    topics: Optional[List[str]] = None
    user_id: Optional[int] = None
    mode: Optional[str] = "practice" # "practice" or "challenge"
    source: Optional[str] = None

class HintRequest(BaseModel):
    question_text: str
    model: Optional[str] = "gemma3:latest"

class UserBase(BaseModel):
    username: str
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class AttemptBase(BaseModel):
    question_id: int
    selected_option: str
    is_correct: bool
    time_taken: Optional[int] = None

class AttemptCreate(AttemptBase):
    user_id: int

class Attempt(AttemptBase):
    id: int
    user_id: int
    time_taken: Optional[int] = None
    timestamp: datetime
    question: Optional[Question] = None

    class Config:
        orm_mode = True

