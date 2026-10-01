import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ManualTaskModal from './components/ManualTaskModal';

import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import RemindersPage from './pages/RemindersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import AssistantPage from './pages/AssistantPage';

import {
  fetchTasks,
  analyzeInput,
  fetchNextRecommendation,
  updateTask,
  toggleSubtask,
  deleteTask,
  createManualTask,
  seedDemoData,
  clearAllTasks
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
      localStorage.setItem('taskflow_tasks', JSON.stringify(fetchedTasks));

      const rec = await fetchNextRecommendation();
      setRecommendation(rec);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAnalyze = async (inputText) => {
    setLoadingAI(true);
    setFallbackMessage(null);
    try {
      const res = await analyzeInput(inputText);
      if (res.fallback_used) {
        setFallbackMessage(res.message || 'Gemini API not configured. Used smart deterministic engine.');
      }
      await loadData();
    } catch (err) {
      alert('Error analyzing tasks: ' + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      await loadData();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleToggleSubtask = async (subtaskId, completed) => {
    try {
      await toggleSubtask(subtaskId, completed);
      await loadData();
    } catch (err) {
      console.error('Error toggling subtask:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskId);
      await loadData();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleStartTask = async (task) => {
    if (!task) return;
    try {
      await updateTask(task.id, { status: 'IN_PROGRESS' });
      await loadData();
    } catch (err) {
      console.error('Error starting task:', err);
    }
  };

  const handleCreateManualTask = async (taskData) => {
    try {
      await createManualTask(taskData);
      await loadData();
    } catch (err) {
      alert('Failed to create task: ' + err.message);
    }
  };

  const handleSeedDemo = async () => {
    try {
      await seedDemoData();
      await loadData();
    } catch (err) {
      alert('Failed to seed demo data: ' + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL tasks from the database?')) return;
    try {
      await clearAllTasks();
      await loadData();
    } catch (err) {
      alert('Failed to clear tasks: ' + err.message);
    }
  };

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="warm-app flex flex-col lg:flex-row min-h-screen bg-[#F4EFE5] text-slate-900">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full overflow-y-auto">
        <Header tasksCount={tasks.length} completedCount={completedCount} />

        {activeTab === 'dashboard' && (
          <DashboardPage
            tasks={tasks}
            recommendation={recommendation}
            loadingAI={loadingAI}
            fallbackMessage={fallbackMessage}
            onAnalyze={handleAnalyze}
            onUpdateStatus={handleUpdateStatus}
            onToggleSubtask={handleToggleSubtask}
            onDeleteTask={handleDeleteTask}
            onStartTask={handleStartTask}
            onSeedDemo={handleSeedDemo}
            onOpenManualModal={() => setManualModalOpen(true)}
            onOpenAssistant={() => setActiveTab('assistant')}
          />
        )}

        {activeTab === 'assistant' && (
          <AssistantPage
            loadingAI={loadingAI}
            fallbackMessage={fallbackMessage}
            onAnalyze={handleAnalyze}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksPage
            tasks={tasks}
            onUpdateStatus={handleUpdateStatus}
            onToggleSubtask={handleToggleSubtask}
            onDeleteTask={handleDeleteTask}
            onSeedDemo={handleSeedDemo}
            onClearAll={handleClearAll}
            onOpenManualModal={() => setManualModalOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarPage tasks={tasks} />
        )}

        {activeTab === 'reminders' && (
          <RemindersPage tasks={tasks} onStartTask={handleStartTask} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage tasks={tasks} />
        )}

        {activeTab === 'settings' && (
          <SettingsPage onSeedDemo={handleSeedDemo} onClearAll={handleClearAll} />
        )}
      </main>

      {/* Manual Task Modal */}
      <ManualTaskModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onCreateTask={handleCreateManualTask}
      />
    </div>
  );
}
