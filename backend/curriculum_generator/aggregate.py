import json
import os
import sqlite3
from collections import defaultdict

INPUT_FILE = "data/processed_curriculum.json"
JSON_OUTPUT = "data/concept_bank.json"
DB_OUTPUT = "data/curriculum.db"

def aggregate_data():
    if not os.path.exists(INPUT_FILE):
        print(f"Input file {INPUT_FILE} not found.")
        return

    with open(INPUT_FILE, "r") as f:
        data = json.load(f)
        
    print(f"Loaded {len(data)} processed items.")
    
    # 1. Build Concept Bank (JSON)
    concept_bank = defaultdict(list)
    
    for item in data:
        concepts = item.get("concepts", [])
        sub_problems = item.get("sub_problems", [])
        
        for concept in concepts:
            # Add all sub-problems to this concept
            # In a real app, we might filter sub-problems by specific concept tag if available
            # But here we associate all sub-problems of the parent problem with its concepts
            for sp in sub_problems:
                entry = {
                    "question": sp.get("question"),
                    "answer": sp.get("answer"),
                    "parent_id": item["id"],
                    "parent_concept": concept, # The concept that led us here
                    "key_insight": item.get("key_insight", "")
                }
                concept_bank[concept].append(entry)
                
    # Save JSON
    with open(JSON_OUTPUT, "w") as f:
        json.dump(concept_bank, f, indent=2)
    print(f"Saved concept bank to {JSON_OUTPUT} with {len(concept_bank)} concepts.")
    
    # 2. Save to SQLite
    conn = sqlite3.connect(DB_OUTPUT)
    cursor = conn.cursor()
    
    # Create Tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS concepts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sub_problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT,
        answer TEXT,
        concept_id INTEGER,
        parent_problem_id INTEGER,
        FOREIGN KEY(concept_id) REFERENCES concepts(id)
    )
    ''')
    
    # Insert Data
    for concept_name, problems in concept_bank.items():
        # Insert Concept
        cursor.execute('INSERT OR IGNORE INTO concepts (name) VALUES (?)', (concept_name,))
        cursor.execute('SELECT id FROM concepts WHERE name = ?', (concept_name,))
        concept_id = cursor.fetchone()[0]
        
        # Insert Sub-problems
        for p in problems:
            cursor.execute('''
            INSERT INTO sub_problems (question, answer, concept_id, parent_problem_id)
            VALUES (?, ?, ?, ?)
            ''', (p["question"], p["answer"], concept_id, p["parent_id"]))
            
    conn.commit()
    conn.close()
    print(f"Saved to SQLite database {DB_OUTPUT}")

    # 3. Generate Text Summary
    SUMMARY_FILE = "data/curriculum_summary.txt"
    with open(SUMMARY_FILE, "w") as f:
        f.write("=== Curriculum Summary ===\n\n")
        f.write(f"Total Concepts: {len(concept_bank)}\n")
        f.write(f"Total Problems Processed: {len(data)}\n\n")
        
        # Sort concepts by number of sub-problems (descending)
        sorted_concepts = sorted(concept_bank.items(), key=lambda x: len(x[1]), reverse=True)
        
        for concept, problems in sorted_concepts:
            f.write(f"--- Concept: {concept} ({len(problems)} sub-problems) ---\n")
            for i, p in enumerate(problems, 1):
                f.write(f"  {i}. {p['question']}\n")
                f.write(f"     Answer: {p['answer']}\n")
                if p.get('key_insight'):
                    f.write(f"     Insight: {p['key_insight']}\n")
            f.write("\n")
            
    print(f"Saved text summary to {SUMMARY_FILE}")

if __name__ == "__main__":
    aggregate_data()
