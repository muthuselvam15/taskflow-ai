import React from 'react';
import RecommendationCard from '../components/RecommendationCard';
import TaskCard from '../components/TaskCard';
import RemindersWidget from '../components/RemindersWidget';
import AnalyticsWidget from '../components/AnalyticsWidget';
import { Plus, RefreshCw, Sparkles, ArrowUpRight } from 'lucide-react';

export default function DashboardPage({
  tasks,
  recommendation,
  onUpdateStatus,
  onToggleSubtask,
  onDeleteTask,
  onStartTask,
  onSeedDemo,
  onOpenManualModal,
  onOpenAssistant
}) {
  const todayTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      <section className="home-hero relative overflow-hidden rounded-2xl p-5 sm:p-7">
        <div className="relative z-10 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A64B32]">{todayLabel}</p>
          <h2 className="mt-2 text-2xl sm:text-[28px] leading-tight font-semibold text-[#27271F]">A clearer day starts here.</h2>
          <p className="mt-2 text-xs sm:text-sm text-[#666257]">{todayTasks.length} active {todayTasks.length === 1 ? 'task' : 'tasks'} · {completedTasks} completed</p>
          <button
            onClick={onOpenAssistant}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D95D39] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#BD4D30] transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Plan with AI
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="home-hero-mark" aria-hidden="true"><span>TF</span></div>
      </section>

      <RecommendationCard
        recommendation={recommendation}
        onStartTask={onStartTask}
      />

      {/* Main Grid: Today's Focus & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Today's Focus List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Today’s focus</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EADFD0] text-[#665A49]">
                {todayTasks.length} open
              </span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenManualModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/70 hover:bg-white text-slate-800 text-[11px] font-semibold transition-colors border border-slate-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
              <button
                onClick={onSeedDemo}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E9D4C9] hover:bg-[#E5C4B5] text-[#9B422B] text-[11px] font-semibold transition-colors border border-[#E5C4B5]"
                title="Seed standard 4 hackathon demo tasks"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Seed Demo Data</span>
              </button>
            </div>
          </div>

          {todayTasks.length === 0 ? (
            <div className="bg-white/70 border border-slate-800 rounded-xl p-7 text-center space-y-3">
              <Sparkles className="w-6 h-6 text-[#B94A31] mx-auto" />
              <h3 className="text-xs font-semibold text-slate-800">Nothing on your list yet</h3>
              <button onClick={onOpenAssistant} className="text-[11px] font-semibold text-[#A64B32] hover:underline">Create a task with AI</button>
            </div>
          ) : (
            <div className="space-y-4">
              {todayTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onUpdateStatus={onUpdateStatus}
                  onToggleSubtask={onToggleSubtask}
                  onDeleteTask={onDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: In-App Reminders & Productivity Analytics */}
        <div className="space-y-6">
          <RemindersWidget tasks={tasks} onStartTask={onStartTask} />
          <AnalyticsWidget tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
