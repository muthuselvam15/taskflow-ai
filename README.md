# TaskFlow AI — "Plan smarter. Act faster."

> **Hackathon Topic:** Intelligent Task and Reminder Management  
> **Production-Quality Hackathon MVP Web Application**

TaskFlow AI is an intelligent task management system that eliminates manual data entry. Describe your tasks in natural language, and TaskFlow AI converts them into structured, prioritized tasks with AI-generated subtask breakdowns, smart reminders, and an explainable AI recommendation engine (**"WHAT SHOULD I DO NOW?"**).

---

## 🌟 Key Features & Core Differentiators

1. **Natural Language AI Task Extraction**:
   Enter multi-sentence prompts (e.g., *"I have a DBMS assignment tomorrow, prepare for my Java exam on Friday, and submit my project next Monday."*). The system extracts task titles, descriptions, priorities, deadlines, duration estimates, subtasks, and reminder times.

2. **✨ "WHAT SHOULD I DO NOW?" Recommendation Engine**:
   Evaluates all pending tasks against deadline proximity, priority rank, effort, and task status. Recommends the single top task you should focus on right now with an **explainable reason**.

3. **AI Task Breakdown**:
   Automatically decomposes complex tasks into actionable subtasks with interactive checkboxes and real-time progress bars.

4. **Resilient Fallback Parsing**:
   If the Gemini API key is not present or API limits are hit, TaskFlow AI uses a smart rule-based deterministic parser. **The application never crashes or gets stuck on loading screens.**

5. **Human-Designed SaaS UI**:
   Deep slate theme (`#0B0F19` / `#0F172A`), white typography, electric indigo primary accents, rounded cards, accessible contrast, low cognitive load.

---

## 🏗️ Architecture

```mermaid
flowchart TD
    User([User Input: Natural Language]) --> Frontend[React + Vite Frontend]
    Frontend -->|POST /api/tasks/analyze| Backend[FastAPI Backend]
    Backend -->|Secret API Key| Gemini[Gemini LLM API]
    Gemini -->|JSON Structured Tasks| Backend
    Backend -->|Smart Priority Rules| PriorityEngine[Task Priority Engine]
    PriorityEngine -->|Next Task Scoring| RecEngine[Next Task Recommendation Engine]
    RecEngine -->|Save Tasks| DB[(SQLite Database)]
    Backend -->|JSON Response| Frontend
    Frontend --> Dashboard["Dashboard UI (Today's Focus)"]
    Dashboard --> RecommendationCard["✨ WHAT SHOULD I DO NOW? Card"]
    Dashboard --> SubtaskChecklist["AI Subtask Checklist"]
    Dashboard --> Analytics["Productivity Metrics & Chart"]
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS v3, Lucide React icons, Canvas Confetti.
- **Backend**: Python FastAPI, Uvicorn, SQLite3, `google-genai` / `google.generativeai`, `pydantic`.
- **Storage**: SQLite (`taskflow.db`) as the single source of truth + LocalStorage UI cache.

---

## 🚀 Getting Started & Running Instructions

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

#### Environment Variables (`backend/.env`):
Create a `.env` file inside `backend/`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```
> Note: If `GEMINI_API_KEY` is omitted, TaskFlow AI automatically uses its smart deterministic fallback engine!

Start the backend server:
```bash
python -m uvicorn main:app --reload --port 8000
```

---

### 2. Frontend Setup (React + Vite)

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The app will start at `http://localhost:5173`.

---

## 🎯 Hackathon Demo Flow (10-Step Wow Moment)

1. Open `http://localhost:5173`.
2. Click **"Insert Hackathon Demo Sentence"** or type:
   > *"I have a DBMS assignment tomorrow, prepare for my Java exam on Friday, and submit my project next Monday."*
3. Click **`✨ Create Task with AI`**.
4. Observe 3 structured tasks automatically created with extracted titles, calculated priorities (HIGH/MEDIUM), deadlines, and durations.
5. Click on **DBMS Assignment** to expand its AI-generated subtasks checklist. Check off a subtask.
6. Direct attention to the prominent **✨ WHAT SHOULD I DO NOW?** card.
7. Observe that **DBMS Assignment** is recommended with its explainable rationale:
   > *"This task has the closest deadline (Tomorrow at 6:00 PM) among your HIGH priority pending tasks."*
8. Click **`[ START TASK ]`** on the recommendation card. Task updates to **IN_PROGRESS**.
9. Click the completion checkbox on **DBMS Assignment**. Watch celebratory confetti and productivity score update.
10. Refresh the page to verify data persistence in SQLite.

---

## 🛡️ Security
`GEMINI_API_KEY` is kept strictly within the backend `.env` file and is **never** exposed to the frontend browser context.
