import React from 'react';
import { Calendar as CalendarIcon, Clock, Bell, Search } from 'lucide-react';

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
    <header className="page-header flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 gap-4">
      <div>
        <p className="eyebrow">THURSDAY, OCTOBER 1, 2026</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-black flex items-center gap-2 tracking-tight mt-1">
          {getGreeting()}, Alex
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here’s what needs your attention today.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button className="icon-button" title="Search tasks" aria-label="Search tasks">
          <Search className="w-4 h-4" />
        </button>
        <button className="icon-button" title="Notifications" aria-label="Notifications">
          <Bell className="w-4 h-4" />
        </button>
        <div className="status-chip flex items-center gap-2 text-xs font-medium text-black px-3 py-2.5 rounded-xl">
          <CalendarIcon className="w-4 h-4 text-[#B94A31]" />
          <span>{currentDate}</span>
        </div>

        <div className="status-chip flex items-center gap-2 text-xs font-medium text-black px-3 py-2.5 rounded-xl">
          <Clock className="w-4 h-4 text-[#52765A]" />
          <span>{completedCount} / {tasksCount} done</span>
        </div>
      </div>
    </header>
  );
}
