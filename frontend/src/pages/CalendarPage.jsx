import React from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function CalendarPage({ tasks }) {
  // Sort tasks by deadline
  const tasksWithDeadline = tasks
    .filter(t => t.deadline)
    .sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Deadline Overview</h1>
        <p className="text-xs text-slate-400">Chronological schedule of your upcoming project and assignment deadlines.</p>
      </div>

      {tasksWithDeadline.length === 0 ? (
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold">No tasks with set deadlines found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasksWithDeadline.map((t) => (
            <div
              key={t.id}
              className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex flex-col items-center justify-center text-indigo-400 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-100">{t.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Deadline: {t.deadline}</span>
                    <span>•</span>
                    <span>{t.estimated_minutes} mins effort</span>
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                  t.status === 'COMPLETED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : t.priority === 'HIGH'
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {t.status === 'COMPLETED' ? 'COMPLETED' : `${t.priority} PRIORITY`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
