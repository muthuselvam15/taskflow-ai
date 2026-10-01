import os
import sqlite3
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from database import init_db, get_db_connection
from ai_service import analyze_tasks_with_ai
from task_engine import compute_smart_priority, get_next_recommended_task

app = FastAPI(title="TaskFlow AI API", version="1.0.0")

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_check():
    init_db()

# Pydantic Schemas
class AnalyzeRequest(BaseModel):
    input_text: str

class SubtaskCreate(BaseModel):
    title: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: Optional[str] = "MEDIUM"
    deadline: Optional[str] = None
    estimated_minutes: Optional[int] = 30
    reminder: Optional[str] = None
    subtasks: Optional[List[str]] = []

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[str] = None
    estimated_minutes: Optional[int] = None
    actual_minutes: Optional[int] = None
    reminder: Optional[str] = None

class SubtaskToggle(BaseModel):
    completed: bool

# Helper DB functions
def fetch_full_task(conn, task_id: int) -> Optional[Dict[str, Any]]:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    if not row:
        return None
    task = dict(row)
    
    # Fetch subtasks
    cursor.execute("SELECT * FROM subtasks WHERE task_id = ?", (task_id,))
    sub_rows = cursor.fetchall()
    task["subtasks"] = [dict(s) for s in sub_rows]
    return task

def fetch_all_tasks(conn) -> List[Dict[str, Any]]:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks ORDER BY id DESC")
    task_rows = cursor.fetchall()
    
    tasks = []
    for r in task_rows:
        t = dict(r)
        cursor.execute("SELECT * FROM subtasks WHERE task_id = ?", (t["id"],))
        t["subtasks"] = [dict(s) for s in cursor.fetchall()]
        tasks.append(t)
    return tasks

# Routes
@app.get("/")
def read_root():
    return {"status": "ok", "app": "TaskFlow AI API", "tagline": "Plan smarter. Act faster."}

@app.post("/api/tasks/analyze")
def analyze_and_create_tasks(payload: AnalyzeRequest):
    input_text = payload.input_text.strip()
    if not input_text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")
        
    result = analyze_tasks_with_ai(input_text)
    extracted_tasks = result.get("tasks", [])
    
    conn = get_db_connection()
    cursor = conn.cursor()
    created_tasks = []
    
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    for t in extracted_tasks:
        title = t.get("title", "New Task")
        desc = t.get("description", "")
        prio = t.get("priority", "MEDIUM").upper()
        deadline = t.get("deadline")
        est_min = t.get("estimated_minutes", 30)
        reminder = t.get("reminder")
        subtasks_list = t.get("subtasks", [])
        
        cursor.execute("""
            INSERT INTO tasks (title, description, priority, status, deadline, estimated_minutes, actual_minutes, reminder, created_at, updated_at)
            VALUES (?, ?, ?, 'PENDING', ?, ?, 0, ?, ?, ?)
        """, (title, desc, prio, deadline, est_min, reminder, now_str, now_str))
        
        task_id = cursor.lastrowid
        
        for sub_title in subtasks_list:
            if isinstance(sub_title, str) and sub_title.strip():
                cursor.execute("""
                    INSERT INTO subtasks (task_id, title, completed)
                    VALUES (?, ?, 0)
                """, (task_id, sub_title.strip()))
                
        full_t = fetch_full_task(conn, task_id)
        if full_t:
            created_tasks.append(full_t)
            
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "fallback_used": result.get("fallback_used", False),
        "message": result.get("message", "Tasks created successfully."),
        "tasks": created_tasks
    }

@app.get("/api/tasks")
def get_tasks():
    conn = get_db_connection()
    tasks = fetch_all_tasks(conn)
    conn.close()
    return {"success": True, "tasks": tasks}

@app.post("/api/tasks")
def create_task_manual(payload: TaskCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute("""
        INSERT INTO tasks (title, description, priority, status, deadline, estimated_minutes, actual_minutes, reminder, created_at, updated_at)
        VALUES (?, ?, ?, 'PENDING', ?, ?, 0, ?, ?, ?)
    """, (payload.title, payload.description or "", payload.priority or "MEDIUM", payload.deadline, payload.estimated_minutes or 30, payload.reminder, now_str, now_str))
    
    task_id = cursor.lastrowid
    
    if payload.subtasks:
        for st in payload.subtasks:
            if isinstance(st, str) and st.strip():
                cursor.execute("INSERT INTO subtasks (task_id, title, completed) VALUES (?, ?, 0)", (task_id, st.strip()))
                
    conn.commit()
    task = fetch_full_task(conn, task_id)
    conn.close()
    return {"success": True, "task": task}

@app.get("/api/tasks/next")
def get_next_task():
    conn = get_db_connection()
    tasks = fetch_all_tasks(conn)
    conn.close()
    
    recommendation = get_next_recommended_task(tasks)
    return {"success": True, "recommendation": recommendation}

@app.patch("/api/tasks/{task_id}")
def update_task(task_id: int, payload: TaskUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
        
    updates = []
    params = []
    
    for field in ["title", "description", "priority", "status", "deadline", "estimated_minutes", "actual_minutes", "reminder"]:
        val = getattr(payload, field, None)
        if val is not None:
            updates.append(f"{field} = ?")
            params.append(val)
            
    if updates:
        updates.append("updated_at = ?")
        params.append(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        params.append(task_id)
        
        query = f"UPDATE tasks SET {', '.join(updates)} WHERE id = ?"
        cursor.execute(query, tuple(params))
        conn.commit()
        
    task = fetch_full_task(conn, task_id)
    conn.close()
    return {"success": True, "task": task}

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM subtasks WHERE task_id = ?", (task_id,))
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Task deleted successfully"}

@app.patch("/api/subtasks/{subtask_id}")
def toggle_subtask(subtask_id: int, payload: SubtaskToggle):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("UPDATE subtasks SET completed = ? WHERE id = ?", (1 if payload.completed else 0, subtask_id))
    cursor.execute("SELECT task_id FROM subtasks WHERE id = ?", (subtask_id,))
    row = cursor.fetchone()
    
    task = None
    if row:
        task_id = row["task_id"]
        # Check if all subtasks completed
        cursor.execute("SELECT COUNT(*) as total, SUM(completed) as done FROM subtasks WHERE task_id = ?", (task_id,))
        stats = cursor.fetchone()
        if stats and stats["total"] > 0 and stats["total"] == stats["done"]:
            cursor.execute("UPDATE tasks SET status = 'COMPLETED' WHERE id = ?", (task_id,))
        conn.commit()
        task = fetch_full_task(conn, task_id)
        
    conn.close()
    return {"success": True, "task": task}

@app.post("/api/tasks/demo")
def seed_demo_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM subtasks")
    cursor.execute("DELETE FROM tasks")
    
    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")
    
    demo_tasks = [
        {
            "title": "DBMS Assignment",
            "description": "Complete normalization questions and SQL queries for Database Management System course",
            "priority": "HIGH",
            "status": "PENDING",
            "deadline": (now + timedelta(days=1)).replace(hour=18, minute=0).strftime("%Y-%m-%d %H:%M"),
            "estimated_minutes": 45,
            "reminder": (now + timedelta(days=1)).replace(hour=16, minute=0).strftime("%Y-%m-%d %H:%M"),
            "subtasks": [
                "Review assignment specifications",
                "Draw ER Diagrams",
                "Write SQL queries for questions 1-5",
                "Verify query output on test database",
                "Submit assignment PDF portal"
            ]
        },
        {
            "title": "Java Exam Preparation",
            "description": "Prepare for upcoming Java OOP concepts, multithreading and exception handling exam",
            "priority": "HIGH",
            "status": "PENDING",
            "deadline": (now + timedelta(days=2)).replace(hour=10, minute=0).strftime("%Y-%m-%d %H:%M"),
            "estimated_minutes": 90,
            "reminder": (now + timedelta(days=2)).replace(hour=8, minute=0).strftime("%Y-%m-%d %H:%M"),
            "subtasks": [
                "Review Object-Oriented Programming principles",
                "Solve practice multithreading questions",
                "Study Collections Framework & Streams",
                "Review mock exam question papers"
            ]
        },
        {
            "title": "Project Documentation",
            "description": "Write final project report, system architecture overview, and API specifications",
            "priority": "MEDIUM",
            "status": "PENDING",
            "deadline": (now + timedelta(days=4)).replace(hour=17, minute=0).strftime("%Y-%m-%d %H:%M"),
            "estimated_minutes": 60,
            "reminder": (now + timedelta(days=4)).replace(hour=15, minute=0).strftime("%Y-%m-%d %H:%M"),
            "subtasks": [
                "Write Architecture Overview",
                "Document REST API endpoints",
                "Create Mermaid flowcharts",
                "Review & export clean PDF"
            ]
        },
        {
            "title": "Update GitHub README",
            "description": "Add installation guide, screenshot showcase, and setup instructions to repo",
            "priority": "LOW",
            "status": "PENDING",
            "deadline": (now + timedelta(days=6)).replace(hour=20, minute=0).strftime("%Y-%m-%d %H:%M"),
            "estimated_minutes": 30,
            "reminder": (now + timedelta(days=6)).replace(hour=18, minute=0).strftime("%Y-%m-%d %H:%M"),
            "subtasks": [
                "Draft clear setup instructions",
                "Add badges & tech stack icons",
                "Include hackathon demo guide"
            ]
        }
    ]
    
    created = []
    for dt in demo_tasks:
        cursor.execute("""
            INSERT INTO tasks (title, description, priority, status, deadline, estimated_minutes, actual_minutes, reminder, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
        """, (dt["title"], dt["description"], dt["priority"], dt["status"], dt["deadline"], dt["estimated_minutes"], dt["reminder"], now_str, now_str))
        
        t_id = cursor.lastrowid
        for st in dt["subtasks"]:
            cursor.execute("INSERT INTO subtasks (task_id, title, completed) VALUES (?, ?, 0)", (t_id, st))
        full_t = fetch_full_task(conn, t_id)
        if full_t:
            created.append(full_t)
            
    conn.commit()
    conn.close()
    return {"success": True, "message": "Demo tasks seeded successfully", "tasks": created}

@app.delete("/api/tasks/all")
def clear_all_tasks():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM subtasks")
    cursor.execute("DELETE FROM tasks")
    conn.commit()
    conn.close()
    return {"success": True, "message": "All tasks cleared"}
