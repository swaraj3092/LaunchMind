from pydantic import BaseModel
from typing import List, Dict, Any

class IdeaInput(BaseModel):
    idea: str
    role: str
    timeline: str
    team_size: str
    is_roast_mode: bool = False

class Answer(BaseModel):
    question: str
    answer: str

class ClarifyingAnswer(BaseModel):
    idea: str
    role: str
    timeline: str
    team_size: str
    answers: List[Answer]

class AdjustInput(BaseModel):
    idea: str
    role: str
    timeline: str
    team_size: str
    validated_item: str
    current_plan: Dict[str, Any]
