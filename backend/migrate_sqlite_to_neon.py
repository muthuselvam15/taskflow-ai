import sqlite3
from pathlib import Path

from dotenv import load_dotenv

from database import get_db_connection, init_db


DB_PATH = Path(__file__).with_name("taskflow.db")
TASK_COLUMNS = (
    "id", "title", "description", "priority", "status", "deadline",
    "estimated_minutes", "actual_minutes", "reminder", "created_at", "updated_at",
)


def migrate_sqlite_to_neon():
    if not DB_PATH.exists():
        raise FileNotFoundError(f"Local SQLite database not found: {DB_PATH}")

    load_dotenv(Path(__file__).with_name(".env"))
    init_db()

    sqlite_conn = sqlite3.connect(DB_PATH)
    sqlite_conn.row_factory = sqlite3.Row
    try:
        tasks = sqlite_conn.execute("SELECT * FROM tasks").fetchall()
        subtasks = sqlite_conn.execute("SELECT * FROM subtasks").fetchall()
    finally:
        sqlite_conn.close()

    conn = get_db_connection()
    copied_tasks = 0
    copied_subtasks = 0
    try:
        with conn.cursor() as cursor:
            task_columns = ", ".join(TASK_COLUMNS)
            task_placeholders = ", ".join(["%s"] * len(TASK_COLUMNS))
            for task in tasks:
                cursor.execute(
                    f"INSERT INTO tasks ({task_columns}) VALUES ({task_placeholders}) ON CONFLICT (id) DO NOTHING",
                    tuple(task[column] for column in TASK_COLUMNS),
                )
                copied_tasks += cursor.rowcount

            for subtask in subtasks:
                cursor.execute(
                    "INSERT INTO subtasks (id, task_id, title, completed) "
                    "VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO NOTHING",
                    (subtask["id"], subtask["task_id"], subtask["title"], bool(subtask["completed"])),
                )
                copied_subtasks += cursor.rowcount

            for table in ("tasks", "subtasks"):
                cursor.execute(
                    f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), "
                    f"GREATEST(COALESCE(MAX(id), 1), 1), COALESCE(MAX(id), 0) > 0) FROM {table}"
                )

        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    print(f"Copied {copied_tasks} tasks and {copied_subtasks} subtasks to Neon.")


if __name__ == "__main__":
    migrate_sqlite_to_neon()