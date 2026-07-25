from pydantic import BaseModel
from typing import List, Dict, Any, Optional

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

class ConversationTurn(BaseModel):
    speaker: str  # "vc" or "founder"
    text: str

class PitchInput(BaseModel):
    idea: str
    role: str
    timeline: str
    team_size: str
    persona_name: str
    persona_archetype: str
    persona_focus: str
    founder_answer: str
    conversation_history: List[ConversationTurn] = []
