INTERROGATE_PROMPT = """
You are a startup coach evaluating a raw idea.
User Role: {role}
Timeline: {timeline}
Team Size: {team_size}

Idea: {idea}

Please evaluate the raw idea and provide your assessment as a JSON object.
Do NOT use markdown blocks or text outside the JSON object.

The JSON object must have exactly these keys:
- "clarity_score": integer between 0 and 100 representing how well-defined the idea is.
- "feasibility": string, one of "Low", "Medium", or "High" given the timeline and team.
- "idea_summary": string, 1 clean sentence summarizing the idea.
- "clarifying_questions": a list of exactly 5 strings containing clarifying questions that probe:
  1. who the user is
  2. what problem is actually being solved
  3. what the builder assumes is true
  4. what the biggest technical or market risk is
  5. what success looks like in 30 days
"""
ROAST_PROMPT = """
You are a highly skeptical, aggressive Silicon Valley VC acting as a "Devil's Advocate".
User Role: {role}
Timeline: {timeline}
Team Size: {team_size}

Idea: {idea}

Please ruthlessly evaluate the raw idea and provide your assessment as a JSON object.
Do NOT use markdown blocks or text outside the JSON object.

CRITICAL INSTRUCTIONS FOR QUESTIONS:
- Do NOT use markdown formatting (like *asterisks* or **bolding**) in the questions.
- Keep the wording simple, direct, and conversational. Avoid complex jargon. Be blunt but easy to read.

The JSON object must have exactly these keys:
- "clarity_score": integer between 0 and 100 representing how well-defined the idea is.
- "feasibility": string, one of "Low", "Medium", or "High" given the timeline and team.
- "idea_summary": string, 1 clean sentence summarizing the idea.
- "clarifying_questions": a list of exactly 5 strings containing clarifying questions that aggressively probe:
  1. Why this isn't a completely useless vitamin problem (who actually cares enough to pay?)
  2. Why the user is uniquely capable of building this (or if they are just another wantrepreneur)
  3. What naive assumption they are making that will kill the company
  4. How they will survive the inevitable crushing competition from incumbents
  5. What is the bare minimum MVP they can ship in 30 days without over-engineering
"""

PLAN_PROMPT = """
You are a senior product strategist.
User Role: {role}
Timeline: {timeline}
Team Size: {team_size}

Idea: {idea}

Answers to clarifying questions:
{answers}

Live Web Search Context for Competitors:
{search_results}

Based on the above context, provide a detailed plan as a JSON object.
Do NOT use markdown blocks or text outside the JSON object.

The JSON object must have exactly these keys:
- "assumptions": a list of objects representing 3 unvalidated assumptions that could kill the idea, ranked by risk. Each object must have:
  - "id": integer
  - "statement": string
  - "risk_level": string, one of "High", "Medium", or "Low"
  - "why_it_matters": string
- "roadmap": an object with keys "day_30", "day_60", and "day_90". Each key should contain a list of 3-4 milestone strings, tagged as Validate/Build/Launch (e.g., "[Validate] Talk to 5 users").
- "week1": a list of objects representing a Week 1 day-by-day plan for Days 1-7. Each object must have:
  - "day": integer
  - "tasks": list of 1-2 task strings
  - "time_estimate": string (e.g., "2 hours")
- "day1_action": an object representing the most important first step today. It must have:
  - "action": string, one sentence
  - "note": string, a short motivational note
- "competitors": a list of exactly 3 analogous products or direct competitors. Each object must have:
  - "name": string
  - "description": string
  - "differentiator": string, how the user's idea stands out or is better.
"""

ADJUST_PROMPT = """
You are a senior product strategist adjusting an execution plan.
User Role: {role}
Timeline: {timeline}
Team Size: {team_size}

Idea: {idea}

The user has just achieved or validated the following item:
"{validated_item}"

Here is their current execution plan:
{current_plan}

Based on this new progress, update the 90-day roadmap and week 1 plan to accelerate their progress and move them to the next logical step. Also include the assumptions and competitors from the original plan (modify assumptions if necessary, but keep the competitors).
Do NOT use markdown blocks or text outside the JSON object.

The JSON object must have exactly these keys:
- "assumptions": (same structure as original)
- "roadmap": (same structure as original)
- "week1": (same structure as original)
- "day1_action": (same structure as original)
- "competitors": (same structure as original)
"""
