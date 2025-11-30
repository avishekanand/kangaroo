# Integrated Datasets

This document describes the datasets integrated into the Math Practice App and their original schemas.

## 1. OlymMATH
- **Source**: [RUC-AIBOX/OlymMATH](https://huggingface.co/datasets/RUC-AIBOX/OlymMATH)
- **Description**: A comprehensive dataset for Olympiad mathematics.
- **Original Schema**:
  - `problem`: (String) The question text.
  - `answer`: (String) The final answer.
  - `subject`: (String) Topic (e.g., Algebra, Combinatorics).
  - `unique_id`: (String) Unique identifier.

## 2. NuminaMath-CoT
- **Source**: [AI-MO/NuminaMath-CoT](https://huggingface.co/datasets/AI-MO/NuminaMath-CoT)
- **Description**: Chain-of-Thought reasoning dataset for math problems.
- **Original Schema**:
  - `messages`: (List) Conversation history.
    - `role`: "user" (Question) or "assistant" (CoT + Answer).
    - `content`: Text content.
  - `source`: (String) Origin of the problem.

## 3. OlympiadBench
- **Source**: [math-ai/olympiadbench](https://huggingface.co/datasets/math-ai/olympiadbench)
- **Description**: Benchmark for Olympiad-level math problems.
- **Original Schema**:
  - `question`: (String) The question text.
  - `solution`: (List[String]) Step-by-step solution.
  - `final_answer`: (List[String]) Final answer(s).
  - `difficulty`: (String) Difficulty level (e.g., "Competition").
  - `subfield`: (String) Topic.
  - `id`: (String) Unique identifier.
  - `modality`: (String) "Text-only" or "Multimodal".

### BRIGHT (LeetCode)
- **Source**: `xlangai/BRIGHT` (config: `examples`, split: `leetcode`)
- **Description**: Algorithmic and coding challenges.
- **Features**: Retrieval-based dataset.
- **Schema**:
  - `query`: Problem text.
  - `reasoning`: Solution hint/explanation.
  - `gold_answer`: Usually "N/A".

### BRIGHT (Economics)
- **Source**: `xlangai/BRIGHT` (config: `examples`, split: `economics`)
- **Description**: Complex economic reasoning problems.
- **Features**: Retrieval-based dataset.
- **Schema**:
  - `query`: Problem text.
  - `reasoning`: Solution hint/explanation.
  - `gold_answer`: Usually "N/A".

## 4. Kangaroo 2025 (3-4)
- **Source**: [MathArena/kangaroo_2025_3-4_outputs](https://huggingface.co/datasets/MathArena/kangaroo_2025_3-4_outputs)
- **Description**: Math Kangaroo 2025 questions for grades 3-4.
- **Original Schema**:
  - `problem`: (String) Question text.
  - `solution`: (String) Full solution.
  - `answer`: (String) Correct option letter (e.g., "A").
  - `final_answer`: (String) Answer text.
  - `options`: (List) [A, B, C, D, E] options.

## 5. Kangaroo 2025 (5-6)
- **Source**: [MathArena/kangaroo_2025_5-6_outputs](https://huggingface.co/datasets/MathArena/kangaroo_2025_5-6_outputs)
- **Description**: Math Kangaroo 2025 questions for grades 5-6.
- **Original Schema**: Same as Kangaroo 2025 (3-4).

## Unified Schema (App Database)
All datasets are mapped to the following unified schema in the `questions` table:
- `source`: (String) Dataset name (e.g., "OlymMATH").
- `external_id`: (String) Original ID from the dataset.
- `problem`: (String) The question text.
- `solution`: (String) Full explanation/solution.
- `answer`: (String) The final answer.
- `topic`: (String) Subject/Topic.
- `difficulty`: (String) Difficulty level.
- `meta_data`: (JSON) Original raw record.


## More potential sources

https://www.mathe-kaenguru.de/chronik/aufgaben/index.html

https://www.hkmkc.org/download

