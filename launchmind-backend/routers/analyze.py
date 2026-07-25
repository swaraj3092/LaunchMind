from fastapi import APIRouter, HTTPException
from models.schemas import IdeaInput
from services.prompt_templates import INTERROGATE_PROMPT, ROAST_PROMPT
from services.gemini_service import generate_json_response

router = APIRouter()

@router.post("/analyze")
async def analyze_idea(input_data: IdeaInput):
    prompt_template = ROAST_PROMPT if input_data.is_roast_mode else INTERROGATE_PROMPT
    prompt = prompt_template.format(
        role=input_data.role,
        timeline=input_data.timeline,
        team_size=input_data.team_size,
        idea=input_data.idea
    )
    try:
        result = generate_json_response(prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
