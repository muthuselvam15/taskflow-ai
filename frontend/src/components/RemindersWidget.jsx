import React, { useState } from 'react';
import { Bell, Clock, Play, Check } from 'lucide-react';

export default function RemindersWidget({ tasks, onStartTask }) {
  const [snoozed, setSnoozed] = useState({});

  const upcomingReminders = tasks.filter(t => t.status !== 'COMPLETED' && t.reminder);

  const handleSnooze = (taskId) => {
    setSnoozed(prev => ({ ...prev, [taskId]: true }));
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <span>Smart In-App Reminders</span>
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {upcomingReminders.length} Active
        </span>
      </div>

      {upcomingReminders.length === 0 ? (
        <p className="text-xs text-slate-500 py-3 text-center">No upcoming reminders right now.</p>
      ) : (
        <div className="space-y-3">
          {upcomingReminders.slice(0, 3).map((task) => {
            const isSnoozed = snoozed[task.id];
            return (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="overflow-hidden">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">{task.title}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>Reminder: {task.reminder}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isSnoozed ? (
                    <span className="text-[10px] text-slate-400 italic px-2 py-1 bg-slate-900 rounded">
                      Snoozed +15m
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => onStartTask(task)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Start</span>
                      </button>
                      <button
                        onClick={() => handleSnooze(task.id)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                      >
                        Snooze
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
