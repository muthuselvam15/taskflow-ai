import React from 'react';
import AnalyticsWidget from '../components/AnalyticsWidget';

export default function AnalyticsPage({ tasks }) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Productivity Analytics</h1>
        <p className="text-xs text-slate-400">Track task completion rates, focus time, and efficiency.</p>
      </div>

      <AnalyticsWidget tasks={tasks} />
    </div>
  );
}
