# Math Olympiad Practice Platform

A comprehensive platform for practicing advanced mathematics problems from various Olympiad benchmarks.

## Features

- **Multi-Benchmark Support**: Practice problems from top datasets:
  - **OlymMATH**: Olympiad mathematics problems.
  - **NuminaMath-CoT**: Chain-of-Thought reasoning challenges.
  - **OlympiadBench**: Advanced competition benchmarks.
  - **Kangaroo 2025**: Grades 3-4 and 5-6 problems with image support.
- **Interactive Quiz UI**:
  - **LaTeX Rendering**: Beautifully rendered math equations in questions, options, and solutions.
  - **Step-by-Step Solutions**: Detailed explanations displayed in a rich, readable format.
  - **Instant Feedback**: Immediate validation of answers.
- **Modern Tech Stack**: Built with FastAPI (Backend) and React/TypeScript (Frontend).

## Project Structure

- **backend/**: FastAPI application, SQLite database, and data import scripts.
- **frontend/**: React application with Tailwind CSS and Vite.

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Import datasets (Required for first run):
   This script downloads data from Hugging Face and populates the local SQLite database.
   ```bash
   python import_datasets.py
   ```

5. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Data Sources

This project uses the following datasets from Hugging Face:
- `RUC-AIBOX/OlymMATH`
- `AI-MO/NuminaMath-CoT`
- `math-ai/olympiadbench`
- `MathArena/kangaroo_2025_3-4_outputs`
- `MathArena/kangaroo_2025_5-6_outputs`

## License

[MIT License](LICENSE)
