const API_BASE = '/api';

export async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const data = await res.json();
    return data.tasks || [];
  } catch (err) {
    console.warn('API Error fetching tasks, checking local cache:', err);
    const cached = localStorage.getItem('taskflow_tasks');
    return cached ? JSON.parse(cached) : [];
  }
}

export async function analyzeInput(inputText) {
  const res = await fetch(`${API_BASE}/tasks/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input_text: inputText })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to analyze tasks');
  }
  return await res.json();
}

export async function fetchNextRecommendation() {
  try {
    const res = await fetch(`${API_BASE}/tasks/next`);
    if (!res.ok) throw new Error('Failed to fetch recommendation');
    const data = await res.json();
    return data.recommendation;
  } catch (err) {
    console.warn('API Error fetching recommendation:', err);
    return null;
  }
}

export async function updateTask(taskId, updates) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update task');
  const data = await res.json();
  return data.task;
}

export async function toggleSubtask(subtaskId, completed) {
  const res = await fetch(`${API_BASE}/subtasks/${subtaskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) throw new Error('Failed to toggle subtask');
  const data = await res.json();
  return data.task;
}

export async function deleteTask(taskId) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return await res.json();
}

export async function createManualTask(taskData) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) throw new Error('Failed to create task');
  const data = await res.json();
  return data.task;
}

export async function seedDemoData() {
  const res = await fetch(`${API_BASE}/tasks/demo`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to seed demo data');
  const data = await res.json();
  return data.tasks || [];
}

export async function clearAllTasks() {
  const res = await fetch(`${API_BASE}/tasks/all`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to clear tasks');
  return await res.json();
}
