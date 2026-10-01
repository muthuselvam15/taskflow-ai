import React from 'react';
import { Clock, Calendar, Play, ChevronRight } from 'lucide-react';

export default function RecommendationCard({ recommendation, onStartTask, onViewDetails }) {
  if (!recommendation || !recommendation.task) {
    return null;
  }

  const { task, reason, priority, estimated_minutes, deadline } = recommendation;

  const priorityColors = {
    HIGH: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    MEDIUM: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    LOW: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  };

  const pColor = priorityColors[priority] || priorityColors.MEDIUM;

  return (
    <section className="border-y border-slate-800 border-l-2 border-l-[#D95D39] py-4 pl-4">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A64B32]">Suggested next</p>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base font-semibold text-slate-900">{task.title}</h2>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${pColor.bg} ${pColor.text} ${pColor.border}`}>
              {priority} priority
            </span>
          </div>
          {task.description && (
            <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
            {deadline && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Due {deadline}
              </span>
            )}
            {estimated_minutes && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {estimated_minutes} min
              </span>
            )}
            {task.status === 'IN_PROGRESS' && (
              <span className="text-[#52765A]">In progress</span>
            )}
          </div>
          {reason && <p className="text-[11px] text-slate-500">{reason}</p>}
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onStartTask(task)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#D95D39] hover:bg-[#BD4D30] text-white text-xs font-semibold transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Start task</span>
          </button>

          {onViewDetails && (
            <button
              onClick={() => onViewDetails(task)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
            >
              <span>Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
