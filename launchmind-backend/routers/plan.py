from fastapi import APIRouter, HTTPException
from models.schemas import ClarifyingAnswer, AdjustInput
from services.prompt_templates import PLAN_PROMPT, ADJUST_PROMPT
from services.gemini_service import generate_json_response
from services.search_service import search_competitors
import json

router = APIRouter()

@router.post("/plan")
async def create_plan(input_data: ClarifyingAnswer):
    answers_text = "\n".join([f"Q: {ans.question}\nA: {ans.answer}" for ans in input_data.answers])
    
    # Run live search
    search_results = search_competitors(input_data.idea)
    
    prompt = PLAN_PROMPT.format(
        role=input_data.role,
        timeline=input_data.timeline,
        team_size=input_data.team_size,
        idea=input_data.idea,
        answers=answers_text,
        search_results=search_results
    )
    try:
        result = generate_json_response(prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/adjust")
async def adjust_plan(input_data: AdjustInput):
    prompt = ADJUST_PROMPT.format(
        role=input_data.role,
        timeline=input_data.timeline,
        team_size=input_data.team_size,
        idea=input_data.idea,
        validated_item=input_data.validated_item,
        current_plan=json.dumps(input_data.current_plan, indent=2)
    )
    try:
        result = generate_json_response(prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
