import json
import os
import requests
import time
from tqdm import tqdm

INPUT_FILE = "data/raw_questions.json"
OUTPUT_FILE = "data/processed_curriculum.json"
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "gemma3:latest" # or "deepseek-r1"

def get_curriculum_from_ollama(problem_text):
    prompt = f"""
    You are an expert math curriculum designer. Analyze the following Olympiad-level math problem:
    
    "{problem_text}"

    Your task:
    1. Identify the key mathematical concepts (e.g., Geometry, Number Theory) and specific sub-topics.
    2. Create a curriculum of 3-5 simpler sub-problems that build up the necessary skills to solve the main problem.
    
    Output STRICTLY in valid JSON format with no markdown or extra text:
    {{
      "concepts": ["concept1", "concept2"],
      "sub_problems": [
        {{"question": "Sub-problem 1 text", "answer": "Short answer", "concept": "Specific concept"}},
        ...
      ]
    }}
    """
    
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json" # Force JSON mode if supported by model, otherwise prompt engineering handles it
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        return json.loads(data["response"])
    except Exception as e:
        print(f"Error processing problem: {e}")
        return None

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"Input file {INPUT_FILE} not found.")
        return

    with open(INPUT_FILE, "r") as f:
        problems = json.load(f)
        
    # Load existing progress
    processed = []
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r") as f:
            processed = json.load(f)
            
    processed_ids = {p["id"] for p in processed}
    
    print(f"Found {len(problems)} problems. Already processed {len(processed)}.")
    
    count = 0
    # limit = 5 # Set small limit for testing
    
    for problem in tqdm(problems):
        # if count >= limit:
        #     break
            
        if problem["id"] in processed_ids:
            continue
            
        print(f"Processing ID {problem['id']}...")
        result = get_curriculum_from_ollama(problem["problem"])
        
        if result:
            processed_item = {
                "id": problem["id"],
                "original_problem": problem["problem"],
                "original_solution": problem["solution"],
                "concepts": result.get("concepts", []),
                "sub_problems": result.get("sub_problems", [])
            }
            processed.append(processed_item)
            
            # Save incrementally
            with open(OUTPUT_FILE, "w") as f:
                json.dump(processed, f, indent=2)
            
            count += 1
        else:
            print(f"Skipping ID {problem['id']} due to error.")
            
        # Rate limiting to be nice to local hardware
        time.sleep(1)

if __name__ == "__main__":
    main()
