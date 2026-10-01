import React, { useState } from 'react';
import { Sparkles, Loader2, Info } from 'lucide-react';

export default function QuickAIInput({ onAnalyze, loading, fallbackMessage }) {
  const [input, setInput] = useState('');

  const samplePrompt = "I have a DBMS assignment tomorrow, prepare for my Java exam on Friday, and submit my project next Monday.";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onAnalyze(input);
  };

  const handleUseSample = () => {
    setInput(samplePrompt);
  };

  return (
    <div className="assistant-composer rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <label className="text-xs font-semibold text-[#355344] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#52765A]" />
          Describe what’s on your mind
        </label>
        <button
          type="button"
          onClick={handleUseSample}
          className="text-[11px] text-[#667467] hover:text-[#355344] transition-colors font-medium underline decoration-dashed underline-offset-4"
        >
          Insert Hackathon Demo Sentence
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Finish the project draft by Thursday, then review the presentation..."
          rows={4}
          className="w-full bg-[#F9F8F2] border border-[#D9DED1] rounded-lg p-3.5 text-sm text-[#292D27] placeholder-[#8A9084] focus:outline-none focus:border-[#6B8B6D] focus:ring-2 focus:ring-[#6B8B6D]/15 resize-y transition-all"
        />

        <div className="flex items-center justify-between mt-3">
          <p className="text-[10px] text-[#667467]">
            Separate thoughts with commas or write them as a sentence.
          </p>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#355344] hover:bg-[#294333] active:bg-[#21382B] disabled:opacity-50 text-white font-semibold text-[11px] transition-colors shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Understanding your task...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create tasks</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Fallback Notification if used */}
      {fallbackMessage && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{fallbackMessage}</span>
        </div>
      )}
    </div>
  );
}
