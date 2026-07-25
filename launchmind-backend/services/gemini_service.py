import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})

def generate_json_response(prompt: str) -> dict:
    try:
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        raise Exception(f"Failed to generate content: {str(e)}")
