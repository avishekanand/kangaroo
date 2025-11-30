
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
    difficulty: Optional[str] = None
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

