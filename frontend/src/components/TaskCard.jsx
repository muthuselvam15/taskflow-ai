import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, Circle, ChevronDown, ChevronUp, Trash2, Play, ListChecks } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TaskCard({ task, onUpdateStatus, onToggleSubtask, onDeleteTask, onViewDetails }) {
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    HIGH: 'bg-red-500/10 text-red-400 border-red-500/30',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const progressPct = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;
  const isCompleted = task.status === 'COMPLETED';

  const handleCompleteToggle = (e) => {
    e.stopPropagation();
    const newStatus = isCompleted ? 'PENDING' : 'COMPLETED';
    if (newStatus === 'COMPLETED') {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }
    onUpdateStatus(task.id, newStatus);
  };

  const handleStart = (e) => {
    e.stopPropagation();
    onUpdateStatus(task.id, 'IN_PROGRESS');
  };

  return (
    <div
      className={`bg-[#0F172A] border rounded-2xl p-5 hover-glow transition-all duration-200 ${
        isCompleted ? 'border-slate-800/60 opacity-75' : 'border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Checkbox & Details */}
        <div className="flex items-start gap-3.5 flex-1">
          <button
            onClick={handleCompleteToggle}
            className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors shrink-0"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            ) : (
              <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
            )}
          </button>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3
                className={`font-semibold text-base tracking-tight ${
                  isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                }`}
              >
                {task.title}
              </h3>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  priorityColors[task.priority] || priorityColors.MEDIUM
                }`}
              >
                {task.priority}
              </span>

              {task.status === 'IN_PROGRESS' && (
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded">
                  In Progress
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
            )}

            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              {task.deadline && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{task.deadline}</span>
                </div>
              )}
              {task.estimated_minutes && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{task.estimated_minutes} min</span>
                </div>
              )}
              {subtasks.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-slate-500" />
                  <span>{completedSubtasks}/{subtasks.length} Subtasks</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {!isCompleted && task.status !== 'IN_PROGRESS' && (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </button>
          )}

          <button
            onClick={() => onDeleteTask(task.id)}
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtask Progress Bar */}
      {subtasks.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 font-medium text-slate-400 hover:text-slate-200"
            >
              <span>AI Subtask Breakdown ({completedSubtasks}/{subtasks.length})</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="font-semibold text-slate-400">{progressPct}%</span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Expanded Subtask List */}
          {expanded && (
            <div className="mt-3 space-y-2 pl-1">
              {subtasks.map((st) => (
                <label
                  key={st.id}
                  className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none py-1"
                >
                  <input
                    type="checkbox"
                    checked={!!st.completed}
                    onChange={() => onToggleSubtask(st.id, !st.completed)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  <span className={st.completed ? 'line-through text-slate-500' : ''}>{st.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
