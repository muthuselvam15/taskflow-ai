import os
import json
from ai_service import analyze_tasks_with_ai
from task_engine import get_next_recommended_task

test_sentence = "I have a DBMS assignment tomorrow, prepare for my Java exam on Friday, and submit my project next Monday."

print("--- Testing Natural Language Extraction ---")
res = analyze_tasks_with_ai(test_sentence)
print("Success:", res.get("success"))
print("Fallback Used:", res.get("fallback_used"))
print("Message:", res.get("message"))
print("Tasks Extracted Count:", len(res.get("tasks", [])))

tasks = res.get("tasks", [])
for idx, t in enumerate(tasks, 1):
    print(f"\nTask {idx}: {t.get('title')}")
    print(f"  Priority: {t.get('priority')}")
    print(f"  Deadline: {t.get('deadline')}")
    print(f"  Est Minutes: {t.get('estimated_minutes')}")
    print(f"  Subtasks ({len(t.get('subtasks', []))}): {t.get('subtasks')}")

print("\n--- Testing Next Task Recommendation ---")
rec = get_next_recommended_task(tasks)
if rec and rec.get("task"):
    print("Recommended Task:", rec["task"].get("title"))
    print("Priority:", rec.get("priority"))
    print("Reason:", rec.get("reason"))
else:
    print("No recommendation returned.")
