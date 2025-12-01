# Math Practice App - Feature Documentation

## 1. Datasets & Content
The application aggregates high-quality math problems from multiple prestigious sources:

### Kangaroo Math
- **Target Audience**: Grades 5-6.
- **Content**: Fun, visual, and logic-based problems.
- **Features**: Full image support for visual problems.

### BRIGHT Benchmark
- **Target Audience**: Advanced/University level.
- **Sub-datasets**:
    - **LeetCode**: Algorithmic and coding-style math problems.
    - **Economics**: Complex economic reasoning and game theory.
- **Difficulty**: Hard (Level 5).

### Olympiad Math
- **Target Audience**: Competition level (IMO, AMC, etc.).
- **Sources**:
    - **OlymMATH**: High-quality competition problems.
    - **NuminaMath-CoT**: Problems with detailed Chain-of-Thought solutions.
    - **OlympiadBench**: Diverse benchmark for advanced mathematics.

---

## 2. Practice Modes
Users can choose between two distinct modes for their study sessions:

### 🛡️ Practice Mode
Designed for self-paced learning and exploration.
- **Customizable Length**: Choose 5, 10, or 20 questions.
- **Difficulty Selection**: Filter by Easy, Medium, or Hard.
- **Smart Filtering**: Questions you have already attempted are automatically filtered out to ensure you always see new content (until exhausted).
- **No Time Limit**: Take as long as you need.

### ⚡ Challenge Mode
Designed to simulate exam conditions.
- **Fixed Format**: 25 Questions.
- **Time Limit**: 50 Minutes (countdown timer included).
- **Mixed Difficulty**: A balanced mix of questions from the selected source.
- **Auto-Submit**: The test automatically ends when the timer reaches zero.

---

## 3. User Management & Progress
- **User Profiles**: Switch between different user profiles (e.g., "Ananya", "Admin", "Guest").
- **Attempt Tracking**: Every answer is recorded in the database.
- **Profile Page**:
    - **Dashboard**: View total attempts, correct answers, and overall accuracy.
    - **History**: Detailed list of past attempts with date and correctness.
    - **Filters**: Filter history by Date or Status (Correct/Incorrect).

---

## 4. Quiz Interface Features
- **Rich Text & Math**: Full LaTeX support for rendering complex mathematical formulas ($x^2 + y^2 = z^2$).
- **Visuals**: Support for image-based questions (especially for Kangaroo).
- **Interactive Feedback**:
    - Immediate feedback on submission.
    - **Step-by-Step Solutions**: Detailed explanations are revealed after answering (if available).
- **Navigation**: Skip questions and return to them later (within the session).

---

## 5. Technical Highlights
- **Backend**: FastAPI with SQLite database.
- **Frontend**: React + TypeScript + Tailwind CSS.
- **Data Integrity**: Robust schema validation ensuring difficulty levels and sources are correctly handled.
