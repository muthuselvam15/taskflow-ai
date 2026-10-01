import React from 'react';
import { LayoutDashboard, CheckSquare, Calendar, Bell, BarChart3, Settings, Sparkles, WandSparkles } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Assistant', icon: WandSparkles },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-60 bg-[#F0E9DC] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col lg:justify-between shrink-0 lg:min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="px-4 py-3 lg:px-5 lg:py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D95D39] flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                TaskFlow <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EAD3C8] text-[#9B422B]">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">Make today count</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-2 py-2 lg:p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`shrink-0 lg:w-full flex flex-col lg:flex-row items-center gap-1 lg:gap-3 px-3 py-2 lg:px-3 lg:py-2.5 rounded-lg font-medium text-[10px] lg:text-xs transition-colors ${isActive
                    ? 'bg-[#E9D4C9] text-[#9B422B] border border-[#E5C4B5]'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B94A31]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="hidden lg:block p-3 border-t border-slate-800/80">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/60 border border-slate-800/60">
          <div className="w-8 h-8 rounded-full bg-[#D8B79D] flex items-center justify-center font-bold text-xs text-[#513D30]">
            US
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-900 truncate">Alex Developer</h4>
            <p className="text-[10px] text-slate-400 truncate">Pro Hackathon Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
