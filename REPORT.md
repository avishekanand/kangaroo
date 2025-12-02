# Math Practice App - Comprehensive Report

## 1. Executive Summary
The Math Practice App is a robust, full-stack web application designed to provide high-quality mathematics practice for students ranging from grade school to competition level. It aggregates problems from prestigious sources like Kangaroo Math, BRIGHT Benchmark, and various Olympiad datasets. The application features advanced user management, distinct practice modes, and a modern, responsive user interface.

## 2. Core Functionalities

### 2.1 Datasets & Content Aggregation
The application serves a diverse range of mathematical problems:
*   **Kangaroo Math (Grades 5-6)**:
    *   **Focus**: Visual logic and foundational math skills.
    *   **Features**: Fully integrated image support for visual problems.
    *   **Source**: `MathArena/kangaroo_2025_5-6_outputs`.
*   **BRIGHT Benchmark**:
    *   **Focus**: Advanced reasoning and retrieval-based problems.
    *   **Sub-categories**:
        *   **LeetCode**: Algorithmic and discrete math problems.
        *   **Economics**: Game theory and economic reasoning.
    *   **Difficulty**: Rated as "Hard" (Level 5).
*   **Olympiad Math**:
    *   **Focus**: High-level competition problems (IMO, AMC).
    *   **Sources**: `OlymMATH`, `NuminaMath-CoT` (Chain-of-Thought), `OlympiadBench`.
    *   **Features**: Detailed step-by-step solutions for learning.

### 2.2 Practice Modes
The application offers two distinct modes tailored to different learning styles:

#### **Practice Mode (Self-Paced)**
*   **Customization**: Users can select the number of questions (5, 10, 20) and difficulty level (Easy, Medium, Hard).
*   **Smart Filtering**: The backend automatically filters out questions the user has already attempted, ensuring fresh content until the dataset is exhausted.
*   **Feedback**: Immediate feedback on answers with access to full solutions.

#### **Challenge Mode (Exam Simulation)**
*   **Standardized Format**: A fixed set of **25 questions**.
*   **Time Limit**: A strict **50-minute countdown timer**.
*   **Auto-Submission**: The test automatically submits when the timer reaches zero.
*   **Scoring**: A summary screen displays the final score and accuracy percentage upon completion.

### 2.3 User Management
A complete user profile system tracks individual progress:
*   **Profiles**: Support for multiple users (e.g., "Ananya", "Admin", "Guest").
*   **Attempt History**: Every interaction is logged in the database (`attempts` table), recording:
    *   Question ID
    *   Selected Option
    *   Correctness (Boolean)
    *   Timestamp
*   **Profile Dashboard**:
    *   **Statistics**: Displays Total Attempts, Correct Answers, and Accuracy %.
    *   **Detailed History**: A chronological list of all past attempts.
    *   **Filtering**: Users can filter their history by **Date** or **Status** (Correct/Incorrect) to review specific sessions.

## 3. Technical Architecture

### 3.1 Frontend
*   **Framework**: React 18 with TypeScript.
*   **Build Tool**: Vite for fast development and HMR.
*   **Styling**: Tailwind CSS for a modern, responsive design.
*   **Key Components**:
    *   `Quiz.tsx`: The core engine handling question rendering, timer logic, and submission.
    *   `PracticeConfig.tsx`: Handles mode selection and session configuration.
    *   `ProfilePage.tsx`: Visualizes user data and history.
*   **Math Rendering**: Uses `react-markdown` with `rehype-katex` to render complex LaTeX formulas.

### 3.2 Backend
*   **Framework**: FastAPI (Python).
*   **Database**: SQLite with SQLAlchemy ORM.
*   **API Design**: RESTful endpoints for:
    *   `POST /sessions`: Creating new quiz sessions with filters.
    *   `POST /attempts`: Recording user answers.
    *   `GET /users/{id}/history`: Fetching user progress.
*   **Data Ingestion**: Custom scripts (`import_datasets.py`) to fetch, clean, and normalize data from Hugging Face datasets into the local SQLite database.

## 4. Testing & Verification
The application has undergone rigorous verification:

### 4.1 Automated Data Validation
*   **Schema Checks**: Verified that `difficulty` fields are correctly mapped to Integers (1-5) to ensure filtering works.
*   **Source Integrity**: Scripts (`inspect_sources.py`) verified that all dataset sources are correctly populated in the database.

### 4.2 Manual Verification Steps
*   **Session Creation**: Verified that sessions can be created for all datasets and modes.
*   **Timer Logic**: Confirmed that the Challenge Mode timer counts down correctly and triggers auto-submission.
*   **Persistence**: Verified that reloading the page during a quiz restores the session state (via `localStorage`).
*   **History Tracking**: Confirmed that answering a question immediately updates the user's profile history.

## 5. Future Improvements
*   **Leaderboards**: Global rankings based on Challenge Mode scores.
*   **Adaptive Difficulty**: Dynamic difficulty adjustment based on user performance.
*   **PDF Export**: Ability to export generated quizzes as PDF files for offline practice.
