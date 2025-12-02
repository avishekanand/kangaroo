import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

def get_hint_from_ollama(question_text: str, model: str = "gemma3:latest") -> str:
    """
    Calls local Ollama instance to generate a hint for the math problem.
    """
    prompt = f"""You are a helpful math tutor. 
    The student is stuck on the following problem:
    "{question_text}"
    
    Please provide a helpful hint to guide them towards the solution. 
    DO NOT reveal the final answer. 
    Keep the hint concise and encouraging.
    """
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "Sorry, I couldn't generate a hint at this time.")
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to Ollama. Is it running on port 11434?"
    except Exception as e:
        return f"Error generating hint: {str(e)}"
