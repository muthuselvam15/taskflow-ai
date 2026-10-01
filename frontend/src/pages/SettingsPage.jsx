import React from 'react';
import { ShieldCheck, Database, RefreshCw, Sparkles, Check } from 'lucide-react';

export default function SettingsPage({ onSeedDemo, onClearAll }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-400">Application configuration, security overview, and demo controls.</p>
      </div>

      <section className="pricing-panel rounded-2xl p-5 space-y-4" aria-labelledby="plans-heading">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">PLANS & ACCESS</p>
            <h2 id="plans-heading" className="mt-1 text-lg font-semibold text-slate-900">Choose your pace</h2>
          </div>
          <Sparkles className="w-5 h-5 text-[#D95D39]" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="plan-option rounded-xl p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm text-slate-900">Free</h3>
              <span className="plan-badge">Current</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">$0<span className="text-xs font-medium text-slate-500">/month</span></p>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#1687A0]" /> 10 AI plans each month</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#1687A0]" /> Core task tracking</li>
            </ul>
          </div>

          <div className="plan-option plan-option-premium rounded-xl p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm text-slate-900">Premium</h3>
              <span className="plan-badge plan-badge-premium">Recommended</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">$12<span className="text-xs font-medium text-slate-500">/month</span></p>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#D95D39]" /> Unlimited AI planning</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#D95D39]" /> Advanced insights and reminders</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security & API Key Notice */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="font-semibold text-sm text-slate-100">API Key & Security Architecture</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          For maximum security compliance, <code className="text-indigo-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">GEMINI_API_KEY</code> is stored strictly in the backend <code className="text-indigo-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">.env</code> file and is never exposed to the frontend browser context.
        </p>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
          Backend API: http://localhost:8000/api<br />
          Database Engine: SQLite (taskflow.db)
        </div>
      </div>

      {/* Demo Data Management */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Database className="w-5 h-5" />
          <h3 className="font-semibold text-sm text-slate-100">Demo Data Controls</h3>
        </div>
        <p className="text-xs text-slate-300">
          Quickly reset or seed the standard 4-task hackathon demo set for judge presentations.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onSeedDemo}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Seed 4 Demo Tasks</span>
          </button>

          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
          >
            <span>Clear All Database Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
