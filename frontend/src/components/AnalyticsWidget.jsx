import React from 'react';
import { BarChart3, CheckCircle, Clock, Zap, TrendingUp } from 'lucide-react';

export default function AnalyticsWidget({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Calculate estimated total focus time
  const totalEstMin = tasks.reduce((sum, t) => sum + (t.estimated_minutes || 30), 0);
  const completedEstMin = tasks
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + (t.estimated_minutes || 30), 0);

  const formatMin = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  // Mock weekly productivity distribution for the single clean chart
  const weeklyData = [
    { day: 'Mon', completed: 3, target: 4 },
    { day: 'Tue', completed: 5, target: 5 },
    { day: 'Wed', completed: 4, target: 6 },
    { day: 'Thu', completed: completed || 2, target: 5 },
    { day: 'Fri', completed: 1, target: 4 },
    { day: 'Sat', completed: 0, target: 3 },
    { day: 'Sun', completed: 0, target: 2 },
  ];

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>Productivity Metrics</span>
        </h3>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>{pct}% Score</span>
        </span>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tasks Done</span>
          </div>
          <div className="text-lg font-bold text-white tracking-tight">
            {completed} <span className="text-xs font-normal text-slate-500">/ {total}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Focus Time</span>
          </div>
          <div className="text-lg font-bold text-white tracking-tight">
            {formatMin(completedEstMin)}
          </div>
        </div>
      </div>

      {/* Single Clean CSS Bar Chart */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Weekly Focus Volume</span>
          <span>Target: 5 tasks/day</span>
        </div>

        <div className="flex items-end justify-between gap-2 h-24 pt-4 border-t border-slate-800/80">
          {weeklyData.map((d, idx) => {
            const barHeightPct = Math.min(100, Math.max(15, (d.completed / 6) * 100));
            const isToday = d.day === 'Thu';
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-slate-950 rounded-t-lg overflow-hidden h-full flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isToday ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-slate-700'
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>
                <span className={`text-[10px] font-medium ${isToday ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
