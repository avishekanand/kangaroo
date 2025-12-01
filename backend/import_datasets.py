import os
import random
import re
from datasets import load_dataset
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import json

# Create tables
print("Creating tables...")
models.Base.metadata.create_all(bind=engine)
print(f"Question columns: {models.Question.__table__.columns.keys()}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def clear_data(source=None):
    db = SessionLocal()
    try:
        if source:
            print(f"Clearing questions from {source}...")
            db.query(models.Question).filter(models.Question.source == source).delete()
        else:
            print("Clearing all questions...")
            db.query(models.Question).delete()
        db.commit()
    except Exception as e:
        print(f"Error clearing data: {e}")
        db.rollback()
    finally:
        db.close()

def generate_options(answer_str):
    """
    Generate MC options. 
    If numeric, generate distractors.
    If not, return None (or handle as open-ended in UI).
    Current UI expects options, so we'll try our best.
    """
    options = []
    correct_label = "A"
    
    try:
        # Clean answer string
        ans_clean = re.sub(r'[^\d\.\-]', '', answer_str)
        if not ans_clean:
            raise ValueError("Not a number")
            
        ans_val = float(ans_clean)
        
        distractors = set()
        attempts = 0
        while len(distractors) < 4 and attempts < 20:
            attempts += 1
            # Random variation within +/- 50%
            d = ans_val * (1 + (random.random() - 0.5))
            # Round to 2 decimals
            d = round(d, 2)
            if d != ans_val:
                distractors.add(str(d))
        
        # Fill remaining with random integers if needed
        while len(distractors) < 4:
            distractors.add(str(random.randint(1, 100)))

        options_list = [str(ans_val)] + list(distractors)
        random.shuffle(options_list)
        
        labels = ['A', 'B', 'C', 'D', 'E']
        for idx, opt in enumerate(options_list):
            if opt == str(ans_val):
                correct_label = labels[idx]
        
        return options_list, correct_label
        
    except ValueError:
        # Non-numeric answer
        # For now, just put the answer in A and placeholders
        # Ideally UI handles open-ended, but let's stick to this for compatibility
        return [answer_str, "N/A", "N/A", "N/A", "N/A"], "A"

def import_olymmath(limit=20):
    print("--- Importing OlymMATH ---")
    db = SessionLocal()
    try:
        dataset = load_dataset("RUC-AIBOX/OlymMATH", "en-easy", split="test", streaming=True)
        
        count = 0
        for item in dataset:
            if count >= limit:
                break
                
            problem = item.get('problem')
            answer = item.get('answer')
            topic = item.get('subject')
            uid = item.get('unique_id')
            
            if not problem or not answer:
                continue
                
            options, correct_label = generate_options(answer)
            
            q = models.Question(
                source="OlymMATH",
                external_id=uid,
                problem=problem,
                answer=answer,
                topic=topic,
                difficulty=2, # Easy -> 2
                options=options,
                correct_option_label=correct_label,
                meta_data=item
            )
            db.add(q)
            count += 1
            
        db.commit()
        print(f"Imported {count} OlymMATH questions.")
    except Exception as e:
        print(f"Error importing OlymMATH: {e}")
        db.rollback()
    finally:
        db.close()

def import_numinamath(limit=20):
    print("--- Importing NuminaMath-CoT ---")
    db = SessionLocal()
    try:
        dataset = load_dataset("AI-MO/NuminaMath-CoT", split="train", streaming=True)
        
        count = 0
        for item in dataset:
            if count >= limit:
                break
            
            messages = item.get('messages', [])
            if len(messages) < 2:
                continue
                
            problem = messages[0]['content']
            solution = messages[1]['content']
            
            # Extract boxed answer
            # Pattern: \boxed{answer}
            match = re.search(r'\\boxed\{(.*?)\}', solution)
            answer = match.group(1) if match else "See Solution"
            
            options, correct_label = generate_options(answer)
            
            q = models.Question(
                source="NuminaMath-CoT",
                external_id=f"numina-{count}", # No ID in schema?
                problem=problem,
                solution=solution,
                answer=answer,
                topic="Math",
                difficulty=4, # Competition -> 4
                options=options,
                correct_option_label=correct_label,
                meta_data=item
            )
            db.add(q)
            count += 1
            
        db.commit()
        print(f"Imported {count} NuminaMath questions.")
    except Exception as e:
        print(f"Error importing NuminaMath: {e}")
        db.rollback()
    finally:
        db.close()

def import_olympiadbench(limit=20):
    print("--- Importing OlympiadBench ---")
    db = SessionLocal()
    try:
        dataset = load_dataset("math-ai/olympiadbench", split="test", streaming=True)
        
        count = 0
        for item in dataset:
            if count >= limit:
                break
                
            if item.get('modality') != 'Text-only':
                continue
                
            problem = item.get('question')
            solution_list = item.get('solution', [])
            solution = "\n".join(solution_list) if isinstance(solution_list, list) else str(solution_list)
            
            ans_list = item.get('final_answer', [])
            answer = ans_list[0] if isinstance(ans_list, list) and ans_list else str(ans_list)
            
            options, correct_label = generate_options(answer)
            
            q = models.Question(
                source="OlympiadBench",
                external_id=item.get('id'),
                problem=problem,
                solution=solution,
                answer=answer,
                topic=item.get('subfield'),
                difficulty=4, # Default to 4 for now
                options=options,
                correct_option_label=correct_label,
                meta_data=item
            )
            db.add(q)
            count += 1
            
        db.commit()
        print(f"Imported {count} OlympiadBench questions.")
    except Exception as e:
        print(f"Error importing OlympiadBench: {e}")
        db.rollback()
    finally:
        db.close()

def import_kangaroo(dataset_name, difficulty_label, limit=20):
    print(f"--- Importing {difficulty_label} ---")
    db = SessionLocal()
    
    # Create image directory
    img_dir = "static/questions/kangaroo"
    os.makedirs(img_dir, exist_ok=True)
    
    try:
        dataset = load_dataset(dataset_name, split="train", streaming=True)
        
        count = 0
        for item in dataset:
            if count >= limit:
                break
            
            problem = item.get('problem')
            # In Kangaroo dataset, 'answer' contains the full solution/explanation
            # and 'gold_answer' contains the correct option label (A, B, C, D, E)
            solution = item.get('answer') 
            answer = item.get('gold_answer')
            
            # Handle image
            image = item.get('image')
            image_path = None
            if image:
                img_filename = f"kangaroo_{difficulty_label.replace(' ', '_')}_{count}.png"
                img_full_path = os.path.join(img_dir, img_filename)
                image.save(img_full_path)
                image_path = f"/{img_dir}/{img_filename}"
            
            # If problem is None, use a placeholder or check user_message
            if not problem:
                problem = "Solve the problem shown in the image."
            
            # Options
            options = item.get('options')
            if not options:
                options = ["A", "B", "C", "D", "E"] 
            
            q = models.Question(
                source=difficulty_label, # Use label as source e.g. "Kangaroo 2025 (3-4)"
                external_id=f"kangaroo-{difficulty_label}-{count}",
                problem=problem,
                image_path=image_path,
                solution=solution,
                answer=answer,
                topic="Math",
                difficulty=3, # Kangaroo 5-6 -> 3 (Medium)
                options=options,
                correct_option_label=answer,
                meta_data={"original_problem": str(item.get('problem'))}
            )
            db.add(q)
            count += 1
            
        db.commit()
        print(f"Imported {count} questions from {difficulty_label}.")
    except Exception as e:
        print(f"Error importing {difficulty_label}: {e}")
        db.rollback()
    finally:
        db.close()

def import_bright(split, source_name, limit=20):
    print(f"--- Importing {source_name} ---")
    db = SessionLocal()
    try:
        # Use 'examples' config and specified split
        dataset = load_dataset("xlangai/BRIGHT", "examples", split=split, streaming=True)
        
        count = 0
        for item in dataset:
            if count >= limit:
                break
            
            # BRIGHT structure:
            # query: Contains the problem text and options
            # gold_answer: Usually N/A in this dataset
            problem = item.get('query')
            solution = item.get('reasoning')
            answer = item.get('gold_answer') or "N/A"
            
            # Extract options if possible, or just leave them in the problem text
            # The problem text often contains "(A) ... (B) ..."
            # We'll leave them in the problem for now and provide generic options
            options = ["A", "B", "C", "D", "E"]
            
            q = models.Question(
                source=source_name,
                external_id=item.get('id'),
                problem=problem,
                solution=solution,
                answer=answer,
                topic="General" if split == "economics" else "Coding/Math",
                difficulty=5, # Hard -> 5
                options=options,
                correct_option_label="?", # Answer not provided in dataset
                meta_data=item
            )
            db.add(q)
            count += 1
            
        db.commit()
        print(f"Imported {count} questions from {source_name}.")
    except Exception as e:
        print(f"Error importing {source_name}: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_data() # Clear all for fresh start
    import_olymmath()
    import_numinamath()
    import_olympiadbench()
    # import_kangaroo("MathArena/kangaroo_2025_3-4_outputs", "Kangaroo 2025 (3-4)") # Removed from UI
    import_kangaroo("MathArena/kangaroo_2025_5-6_outputs", "Kangaroo 2025 (5-6)")
    
    # Import BRIGHT splits
    import_bright("leetcode", "BRIGHT (LeetCode)")
    import_bright("economics", "BRIGHT (Economics)")
