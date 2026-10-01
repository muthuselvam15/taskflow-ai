import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function Header({ tasksCount = 0, completedCount = 0 }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800/80 gap-3">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          {getGreeting()}, Alex
        </h1>
        <p className="text-xs text-slate-500 mt-1">Here’s what needs your attention today.</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-700 bg-white/70 border border-slate-800 px-3 py-2 rounded-lg">
          <CalendarIcon className="w-3.5 h-3.5 text-[#B94A31]" />
          <span>{currentDate}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-700 bg-white/70 border border-slate-800 px-3 py-2 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-[#B94A31]" />
          <span>{completedCount} / {tasksCount} Tasks Done</span>
        </div>
      </div>
    </header>
  );
}
