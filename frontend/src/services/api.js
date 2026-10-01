import { getDemoTasks, getLocalRecommendation, getLocalTasks, saveLocalTasks } from './demoData';

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
        if (cached) return JSON.parse(cached);
        const demoTasks = getDemoTasks();
        saveLocalTasks(demoTasks);
        return demoTasks;
    }
}

export async function analyzeInput(inputText) {
    try {
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
    } catch (err) {
        const task = {
            id: Date.now(),
            title: inputText.trim(),
            description: 'Captured in local demo mode. Connect the backend to run full AI parsing.',
            priority: 'MEDIUM',
            status: 'PENDING',
            deadline: null,
            estimated_minutes: 30,
            actual_minutes: 0,
            reminder: null,
            subtasks: []
        };
        saveLocalTasks([...getLocalTasks(), task]);
        return {
            success: true,
            fallback_used: true,
            message: 'Demo mode: task saved locally while the backend is offline.',
            tasks: [task]
        };
    }
}

export async function fetchNextRecommendation() {
    try {
        const res = await fetch(`${API_BASE}/tasks/next`);
        if (!res.ok) throw new Error('Failed to fetch recommendation');
        const data = await res.json();
        return data.recommendation;
    } catch (err) {
        console.warn('API Error fetching recommendation:', err);
        return getLocalRecommendation(getLocalTasks());
    }
}

export async function fetchAnalyticsOverview() {
    try {
        const res = await fetch(`${API_BASE}/analytics/overview`);
        if (!res.ok) throw new Error('Failed to fetch analytics overview');
        return await res.json();
    } catch (err) {
        return null;
    }
}

export async function updateTask(taskId, updates) {
    try {
        const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Failed to update task');
        const data = await res.json();
        return data.task;
    } catch (err) {
        const tasks = getLocalTasks().map((task) => task.id === taskId ? { ...task, ...updates } : task);
        saveLocalTasks(tasks);
        return tasks.find((task) => task.id === taskId);
    }
}

export async function toggleSubtask(subtaskId, completed) {
    try {
        const res = await fetch(`${API_BASE}/subtasks/${subtaskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        if (!res.ok) throw new Error('Failed to toggle subtask');
        const data = await res.json();
        return data.task;
    } catch (err) {
        const tasks = getLocalTasks().map((task) => {
            const subtasks = (task.subtasks || []).map((subtask) => subtask.id === subtaskId ? { ...subtask, completed } : subtask);
            const allComplete = subtasks.length > 0 && subtasks.every((subtask) => subtask.completed);
            return subtasks.some((subtask) => subtask.id === subtaskId)
                ? { ...task, subtasks, status: allComplete ? 'COMPLETED' : task.status }
                : task;
        });
        saveLocalTasks(tasks);
        return tasks.find((task) => (task.subtasks || []).some((subtask) => subtask.id === subtaskId));
    }
}

export async function deleteTask(taskId) {
    try {
        const res = await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete task');
        return await res.json();
    } catch (err) {
        saveLocalTasks(getLocalTasks().filter((task) => task.id !== taskId));
        return { success: true };
    }
}

export async function createManualTask(taskData) {
    try {
        const res = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        if (!res.ok) throw new Error('Failed to create task');
        const data = await res.json();
        return data.task;
    } catch (err) {
        const task = {
            id: Date.now(),
            ...taskData,
            status: 'PENDING',
            actual_minutes: 0,
            subtasks: (taskData.subtasks || []).map((title, index) => ({ id: Date.now() + index, title, completed: false }))
        };
        saveLocalTasks([...getLocalTasks(), task]);
        return task;
    }
}

export async function seedDemoData() {
    try {
        const res = await fetch(`${API_BASE}/tasks/demo`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to seed demo data');
        const data = await res.json();
        return data.tasks || [];
    } catch (err) {
        const demoTasks = getDemoTasks();
        saveLocalTasks(demoTasks);
        return demoTasks;
    }
}

export async function clearAllTasks() {
    try {
        const res = await fetch(`${API_BASE}/tasks/all`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to clear tasks');
        return await res.json();
    } catch (err) {
        saveLocalTasks([]);
        return { success: true };
    }
}
