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
    <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800/80 gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-black flex items-center gap-2">
          {getGreeting()}, Alex
        </h1>
        <p className="text-xs text-black mt-1">Here’s what needs your attention today.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-2 text-xs font-medium text-black bg-white/70 border border-slate-800 px-3 py-2 rounded-lg">
          <CalendarIcon className="w-4 h-4 text-black" />
          <span>{currentDate}</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-black bg-white/70 border border-slate-800 px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4 text-black" />
          <span>{completedCount} / {tasksCount} done</span>
        </div>
      </div>
    </header>
  );
}
