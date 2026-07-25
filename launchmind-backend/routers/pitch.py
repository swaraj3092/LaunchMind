from fastapi import APIRouter, HTTPException
from models.schemas import PitchInput
from services.prompt_templates import PITCH_ROOM_PROMPT
from services.gemini_service import generate_json_response

router = APIRouter()

@router.post("/pitch")
async def pitch_room_response(input_data: PitchInput):
    # Format conversation history for prompt
    history_text = ""
    if input_data.conversation_history:
        turns = []
        for turn in input_data.conversation_history:
            speaker = input_data.persona_name if turn.speaker == "vc" else "Founder"
            turns.append(f"{speaker}: {turn.text}")
        history_text = "\n".join(turns)
    else:
        history_text = "(This is the opening of the pitch — start with a brief, sharp opening question.)"

    prompt = PITCH_ROOM_PROMPT.format(
        persona_name=input_data.persona_name,
        persona_archetype=input_data.persona_archetype,
        persona_focus=input_data.persona_focus,
        idea=input_data.idea,
        role=input_data.role,
        timeline=input_data.timeline,
        team_size=input_data.team_size,
        conversation_history=history_text,
        founder_answer=input_data.founder_answer or "Hello, I'm ready to pitch."
    )
    try:
        result = generate_json_response(prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
