import React from 'react';
import { Sparkles } from 'lucide-react';
import QuickAIInput from '../components/QuickAIInput';

export default function AssistantPage({ loadingAI, fallbackMessage, onAnalyze }) {
    return (
        <div className="max-w-4xl space-y-5">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A64B32]">TaskFlow AI</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">AI Assistant</h2>
            </div>

            <section className="rounded-xl border border-[#D4DFD0] bg-[#F7F8F2] p-4 sm:p-6">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-[#355344]">
                    <Sparkles className="h-4 w-4 text-[#52765A]" />
                    Turn your thoughts into a plan
                </div>
                <QuickAIInput
                    onAnalyze={onAnalyze}
                    loading={loadingAI}
                    fallbackMessage={fallbackMessage}
                />
            </section>
        </div>
    );
}