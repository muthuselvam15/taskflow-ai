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
    <aside className="sidebar-shell w-full lg:w-[248px] flex flex-col lg:justify-between shrink-0 lg:min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="sidebar-brand px-4 py-4 lg:px-6 lg:py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="brand-mark w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 flex items-center gap-1.5 tracking-tight">
                TaskFlow <span className="brand-pill">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">PERSONAL COMMAND CENTER</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Primary navigation" className="px-2 py-3 lg:px-4 lg:py-5 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          <p className="nav-label hidden lg:block">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`nav-item shrink-0 lg:w-full flex flex-col lg:flex-row items-center gap-1 lg:gap-3 px-3 py-2.5 lg:px-3 lg:py-3 rounded-xl font-medium text-[10px] lg:text-xs transition-colors ${isActive
                  ? 'nav-item-active'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#B94A31]' : 'text-slate-500'}`} strokeWidth={isActive ? 2.4 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="hidden lg:block p-4">
        <div className="profile-card flex items-center gap-3 p-3 rounded-xl">
          <div className="avatar w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs">
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
