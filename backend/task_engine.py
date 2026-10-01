from datetime import datetime
from typing import List, Dict, Any, Optional

PRIORITY_WEIGHTS = {
    "HIGH": 3,
    "MEDIUM": 2,
    "LOW": 1
}

STATUS_WEIGHTS = {
    "IN_PROGRESS": 3,
    "PENDING": 2,
    "COMPLETED": 0
}

def parse_deadline(deadline_str: str) -> Optional[datetime]:
    if not deadline_str:
        return None
    for fmt in ("%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M", "%Y-%m-%d"):
        try:
            return datetime.strptime(deadline_str, fmt)
        except ValueError:
            continue
    return None

def compute_smart_priority(task: Dict[str, Any]) -> str:
    """
    Deterministic priority refinement rule.
    """
    current_prio = task.get("priority", "MEDIUM").upper()
    deadline_str = task.get("deadline")
    
    if not deadline_str:
        return current_prio
        
    deadline_dt = parse_deadline(deadline_str)
    if not deadline_dt:
        return current_prio
        
    now = datetime.now()
    hours_left = (deadline_dt - now).total_seconds() / 3600.0
    
    if hours_left <= 36:
        return "HIGH"
    elif hours_left <= 96 and current_prio == "LOW":
        return "MEDIUM"
    return current_prio

def get_next_recommended_task(tasks: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Core differentiator algorithm: "WHAT SHOULD I DO NOW?"
    Finds the single best task for the user to work on next and provides an explainable reason.
    """
    pending_tasks = [t for t in tasks if t.get("status") != "COMPLETED"]
    
    if not pending_tasks:
        return {
            "task": None,
            "reason": "All tasks are completed! Great job on staying productive."
        }
        
    now = datetime.now()
    
    def score_task(task: Dict[str, Any]):
        prio = compute_smart_priority(task)
        prio_weight = PRIORITY_WEIGHTS.get(prio, 2)
        status_weight = STATUS_WEIGHTS.get(task.get("status", "PENDING"), 2)
        
        deadline_dt = parse_deadline(task.get("deadline", ""))
        if deadline_dt:
            hours_until_deadline = max(0.1, (deadline_dt - now).total_seconds() / 3600.0)
            # Closer deadline = higher score boost
            deadline_score = 1000.0 / (hours_until_deadline + 1.0)
        else:
            deadline_score = 0.0
            
        est_min = task.get("estimated_minutes", 30)
        # Moderate duration preference (30-90 mins)
        duration_score = 10.0 if 15 <= est_min <= 90 else 5.0
        
        total_score = (status_weight * 500) + (prio_weight * 200) + deadline_score + duration_score
        return total_score
        
    # Sort pending tasks by score descending
    sorted_tasks = sorted(pending_tasks, key=score_task, reverse=True)
    top_task = sorted_tasks[0]
    
    # Generate explainable human-readable rationale
    top_prio = compute_smart_priority(top_task)
    top_status = top_task.get("status")
    deadline_dt = parse_deadline(top_task.get("deadline", ""))
    
    reasons = []
    
    if top_status == "IN_PROGRESS":
        reasons.append("You have already started this task—finish it to build momentum.")
    elif top_prio == "HIGH":
        reasons.append("This is one of your highest-priority urgent tasks.")
        
    if deadline_dt:
        days_left = (deadline_dt - now).days
        hours_left = int((deadline_dt - now).total_seconds() // 3600)
        if hours_left <= 24:
            reasons.append("The deadline is approaching within 24 hours!")
        elif days_left == 1:
            reasons.append("Due tomorrow—getting started now avoids last-minute stress.")
        elif days_left > 1:
            reasons.append(f"Closest deadline among high priority items (due in {days_left} days).")
    else:
        reasons.append("Has top priority ranking in your current backlog.")
        
    est_m = top_task.get("estimated_minutes", 45)
    reasons.append(f"Estimated effort is {est_m} minutes, fitting into a focused work block.")
    
    explanation = " ".join(reasons)
    
    return {
        "task": top_task,
        "reason": explanation,
        "priority": top_prio,
        "deadline": top_task.get("deadline"),
        "estimated_minutes": top_task.get("estimated_minutes", 30)
    }
