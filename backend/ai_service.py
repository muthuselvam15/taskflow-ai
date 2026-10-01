import os
import json
import re
from datetime import datetime, timedelta
from typing import List, Dict, Any

def get_current_context_time():
    # Base current date: Oct 1, 2026 (Thursday) or actual system current datetime
    return datetime.now()

def parse_with_deterministic_fallback(input_text: str) -> List[Dict[str, Any]]:
    """
    Robust rule-based parser that handles natural language sentences when LLM is unavailable.
    """
    now = get_current_context_time()
    
    # Split by common sentence delimiters or connectors
    delimiters = r'[,;.\n]|\band\b'
    parts = [p.strip() for p in re.split(delimiters, input_text, flags=re.IGNORECASE) if p.strip()]
    
    if not parts:
        parts = [input_text.strip()]
        
    extracted_tasks = []
    
    # Day mapping
    weekdays = {
        'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
        'friday': 4, 'saturday': 5, 'sunday': 6
    }
    
    for part in parts:
        lower_part = part.lower()
        if len(part) < 3:
            continue
            
        # Determine priority based on keywords
        priority = "MEDIUM"
        if any(w in lower_part for w in ["exam", "assignment", "urgent", "test", "final", "asap", "critical"]):
            priority = "HIGH"
        elif any(w in lower_part for w in ["read", "update", "optional", "readme", "cleanup", "fix"]):
            priority = "LOW"
            
        # Determine deadline
        deadline_dt = now + timedelta(days=2) # default
        
        if "today" in lower_part:
            deadline_dt = now.replace(hour=20, minute=0, second=0)
        elif "tomorrow" in lower_part:
            deadline_dt = (now + timedelta(days=1)).replace(hour=18, minute=0, second=0)
        else:
            found_day = False
            for day_name, day_num in weekdays.items():
                if day_name in lower_part:
                    days_ahead = (day_num - now.weekday()) % 7
                    if days_ahead == 0:
                        days_ahead = 7
                    deadline_dt = (now + timedelta(days=days_ahead)).replace(hour=17, minute=0, second=0)
                    found_day = True
                    break
            if not found_day and "next week" in lower_part:
                deadline_dt = (now + timedelta(days=7)).replace(hour=17, minute=0, second=0)
                
        # Estimate duration
        estimated_minutes = 45
        if any(w in lower_part for w in ["exam", "prep", "prepare", "study"]):
            estimated_minutes = 90
        elif any(w in lower_part for w in ["assignment", "project"]):
            estimated_minutes = 60
        elif any(w in lower_part for w in ["readme", "update", "quick", "doc"]):
            estimated_minutes = 30
            
        # Generate clean title
        title = part.strip()
        # Capitalize nicely
        title = title[0].upper() + title[1:] if len(title) > 0 else "New Task"
        
        # Subtasks generation based on context
        subtasks = []
        if any(w in lower_part for w in ["assignment", "dbms"]):
            subtasks = [
                "Read assignment guidelines & questions",
                "Draft database schema / SQL solution",
                "Test queries and output",
                "Review & submit assignment file"
            ]
        elif any(w in lower_part for w in ["exam", "prep", "java"]):
            subtasks = [
                "Review lecture notes & core concepts",
                "Practice sample problem sets",
                "Review tricky topics & cheat sheet",
                "Final mock test review"
            ]
        elif any(w in lower_part for w in ["project", "submit", "documentation"]):
            subtasks = [
                "Complete remaining features/code",
                "Write project report & documentation",
                "Perform system testing",
                "Final submission build"
            ]
        else:
            subtasks = [
                f"Initial research on {title[:20]}",
                "Execute primary work",
                "Final review and completion"
            ]
            
        reminder_dt = deadline_dt - timedelta(hours=2)
        
        extracted_tasks.append({
            "title": title,
            "description": f"Extracted task: {title}",
            "priority": priority,
            "deadline": deadline_dt.strftime("%Y-%m-%d %H:%M"),
            "estimated_minutes": estimated_minutes,
            "subtasks": subtasks,
            "reminder": reminder_dt.strftime("%Y-%m-%d %H:%M")
        })
        
    return extracted_tasks

def analyze_tasks_with_ai(user_input: str) -> Dict[str, Any]:
    """
    Main AI Task Analysis function.
    Tries Gemini API first, falls back gracefully to rule-based parser.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    
    if not api_key:
        tasks = parse_with_deterministic_fallback(user_input)
        return {
            "success": True,
            "fallback_used": True,
            "message": "GEMINI_API_KEY not configured. Using deterministic smart engine.",
            "tasks": tasks
        }
        
    now = get_current_context_time()
    now_str = now.strftime("%Y-%m-%d %H:%M (day of week: %A)")
    
    prompt = f"""
You are TaskFlow AI, an expert intelligent productivity system.
Current reference date and time: {now_str}.

Analyze the following user input and convert it into structured JSON task objects.

User Input: "{user_input}"

For each task mentioned or implied, extract or infer:
- "title": Concise, professional task title (e.g. "DBMS Assignment", "Java Exam Preparation", "Submit Final Project").
- "description": Clear 1-sentence description.
- "priority": "HIGH", "MEDIUM", or "LOW".
- "deadline": Calculated ISO format "YYYY-MM-DD HH:MM" based on current reference date ({now_str}).
- "estimated_minutes": Integer estimated duration in minutes (e.g. 45, 90, 60).
- "subtasks": Array of 3 to 5 actionable step-by-step subtask titles.
- "reminder": Calculated ISO format "YYYY-MM-DD HH:MM" (e.g. 2 hours before deadline).

Return ONLY valid raw JSON array of objects without markdown formatting or code fences:
[
  {{
    "title": "DBMS Assignment",
    "description": "Complete DBMS assignment questions and SQL queries",
    "priority": "HIGH",
    "deadline": "2026-10-02 18:00",
    "estimated_minutes": 45,
    "subtasks": ["Read questions", "Write SQL queries", "Verify output", "Submit assignment"],
    "reminder": "2026-10-02 16:00"
  }}
]
"""

    try:
        # Try using google-genai SDK or google.generativeai SDK
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            raw_text = response.text
        except Exception:
            import google.generativeai as genai_legacy
            genai_legacy.configure(api_key=api_key)
            model = genai_legacy.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            raw_text = response.text

        # Clean JSON from response
        clean_text = raw_text.strip()
        clean_text = re.sub(r'^```(json)?', '', clean_text, flags=re.IGNORECASE)
        clean_text = re.sub(r'```$', '', clean_text)
        clean_text = clean_text.strip()

        tasks_data = json.loads(clean_text)
        
        if isinstance(tasks_data, dict) and "tasks" in tasks_data:
            tasks_data = tasks_data["tasks"]

        return {
            "success": True,
            "fallback_used": False,
            "message": "AI successfully analyzed tasks.",
            "tasks": tasks_data
        }
    except Exception as e:
        print(f"Gemini API Exception: {e}. Falling back to deterministic engine.")
        tasks = parse_with_deterministic_fallback(user_input)
        return {
            "success": True,
            "fallback_used": True,
            "message": f"AI service error ({str(e)}). Used smart deterministic fallback.",
            "tasks": tasks
        }
