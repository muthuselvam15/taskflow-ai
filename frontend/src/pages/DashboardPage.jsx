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
  onOpenAssistant,
  analyticsOverview
}) {
  const todayTasks = tasks.filter(t => t.status !== 'COMPLETED');

  return (
    <div className="dashboard-page space-y-7">
      <section className="home-hero relative overflow-hidden rounded-[24px] p-6 sm:p-9">
        <div className="relative z-10 max-w-xl">
          <p className="eyebrow hero-eyebrow">YOUR DAY, IN FOCUS</p>
          <h2 className="mt-3 text-3xl sm:text-[40px] leading-[1.05] font-semibold text-white">Make room for the work that matters.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 hero-copy">Turn a busy mind into a clear plan. TaskFlow AI keeps your next move close and your momentum visible.</p>
          <button
            onClick={onOpenAssistant}
            className="hero-cta mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Plan with AI
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="home-hero-mark" aria-hidden="true"><span>TF</span></div>
        <div className="hero-stat"><span className="hero-stat-label">FOCUS MODE</span><strong>ON</strong><span className="hero-stat-dot" /></div>
      </section>

      <RecommendationCard
        recommendation={recommendation}
        onStartTask={onStartTask}
      />

      {/* Main Grid: Today's Focus & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Focus List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">ACTIVE QUEUE</p>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mt-1">
                <span>Today’s focus</span>
                <span className="count-pill">
                  {todayTasks.length} open
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenManualModal}
                className="secondary-button flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
              <button
                onClick={onSeedDemo}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E9D4C9] hover:bg-[#E5C4B5] text-[#9B422B] text-[11px] font-semibold transition-colors border border-[#E5C4B5]"
                title="Seed standard 4 hackathon demo tasks"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Seed Demo Data</span>
              </button>
            </div>
          </div>

          {todayTasks.length === 0 ? (
            <div className="empty-panel border rounded-2xl p-9 text-center space-y-3">
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
          <AnalyticsWidget tasks={tasks} analysis={analyticsOverview} />
        </div>
      </div>
    </div>
  );
}
