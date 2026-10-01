const demoTasks = [
    {
        id: 101,
        title: 'Polish TaskFlow landing flow',
        description: 'Review the first-run experience and make the primary AI action feel effortless.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        deadline: '2026-10-02 18:00',
        estimated_minutes: 45,
        actual_minutes: 18,
        reminder: '2026-10-02 16:00',
        subtasks: [
            { id: 1001, task_id: 101, title: 'Review the empty state', completed: true },
            { id: 1002, task_id: 101, title: 'Test the assistant handoff', completed: false },
            { id: 1003, task_id: 101, title: 'Check mobile spacing', completed: false }
        ]
    },
    {
        id: 102,
        title: 'Prepare Java exam revision plan',
        description: 'Create a focused revision block for OOP, collections, and multithreading.',
        priority: 'HIGH',
        status: 'PENDING',
        deadline: '2026-10-03 10:00',
        estimated_minutes: 90,
        actual_minutes: 0,
        reminder: '2026-10-03 08:00',
        subtasks: [
            { id: 1004, task_id: 102, title: 'Review OOP principles', completed: false },
            { id: 1005, task_id: 102, title: 'Solve practice questions', completed: false },
            { id: 1006, task_id: 102, title: 'Review a mock exam', completed: false }
        ]
    },
    {
        id: 103,
        title: 'Document the API architecture',
        description: 'Write the architecture overview and document the core task endpoints.',
        priority: 'MEDIUM',
        status: 'PENDING',
        deadline: '2026-10-05 17:00',
        estimated_minutes: 60,
        actual_minutes: 0,
        reminder: '2026-10-05 15:00',
        subtasks: [
            { id: 1007, task_id: 103, title: 'Draft architecture overview', completed: false },
            { id: 1008, task_id: 103, title: 'Document task endpoints', completed: false }
        ]
    },
    {
        id: 104,
        title: 'Update GitHub README',
        description: 'Add setup instructions, screenshots, and a concise demo walkthrough.',
        priority: 'LOW',
        status: 'COMPLETED',
        deadline: '2026-10-01 20:00',
        estimated_minutes: 30,
        actual_minutes: 28,
        reminder: null,
        subtasks: [
            { id: 1009, task_id: 104, title: 'Add setup instructions', completed: true },
            { id: 1010, task_id: 104, title: 'Add demo screenshots', completed: true }
        ]
    }
];

export function getDemoTasks() {
    return JSON.parse(JSON.stringify(demoTasks));
}

export function getLocalTasks() {
    const stored = localStorage.getItem('taskflow_tasks');
    return stored ? JSON.parse(stored) : getDemoTasks();
}

export function saveLocalTasks(tasks) {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    return tasks;
}

export function getLocalRecommendation(tasks) {
    const task = tasks.find((item) => item.status === 'IN_PROGRESS') || tasks.find((item) => item.status !== 'COMPLETED');
    if (!task) return null;

    return {
        task,
        reason: task.status === 'IN_PROGRESS'
            ? 'You already have momentum here. Keep the active work moving before opening a new thread.'
            : 'This is the next focused block in your current queue.',
        priority: task.priority,
        deadline: task.deadline,
        estimated_minutes: task.estimated_minutes
    };
}
