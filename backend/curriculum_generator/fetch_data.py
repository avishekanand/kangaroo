import json
import os
from datasets import load_dataset

OUTPUT_DIR = "data"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "raw_questions.json")

def fetch_problems(limit=100):
    print(f"Fetching {limit} problems from AI-MO/NuminaMath-CoT...")
    
    # Load dataset (streaming to avoid downloading everything if possible, or just load split)
    # NuminaMath-CoT is large, so streaming is better, or just taking the first 100
    dataset = load_dataset("AI-MO/NuminaMath-CoT", split="train", streaming=True)
    
    problems = []
    count = 0
    
    for item in dataset:
        if count >= limit:
            break
            
        # Structure: {'problem': ..., 'solution': ...}
        problems.append({
            "id": count,
            "problem": item["problem"],
            "solution": item["solution"],
            "source": item.get("source", "NuminaMath")
        })
        count += 1
        
    print(f"Fetched {len(problems)} problems.")
    
    # Save to JSON
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(problems, f, indent=2)
        
    print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    fetch_problems()
