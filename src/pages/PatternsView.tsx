import React, { useState } from 'react';
import { TarotReading } from '../types';
import { computePatternAnalytics } from '../lib/firebase';
import { LineChart, Sparkles, Layers, Flame, Loader2, RefreshCw, BarChart2 } from 'lucide-react';

interface PatternsViewProps {
  readings: TarotReading[];
}

export const PatternsView: React.FC<PatternsViewProps> = ({ readings }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const analytics = computePatternAnalytics(readings);

  const handleSynthesizeSummary = async () => {
    if (readings.length === 0) return;
    try {
      setIsSynthesizing(true);
      setErrorMsg(null);

      const res = await fetch('/api/patterns/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readings })
      });

      if (!res.ok) {
        throw new Error('Failed to generate pattern summary');
      }

      const data = await res.json();
      setAiSummary(data.patternSummary);
    } catch (err: any) {
      console.error('Pattern summary synthesis error:', err);
      setErrorMsg(err.message || 'Error synthesizing patterns');
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs text-[#f3e5ab] font-mono uppercase tracking-widest">
          <LineChart className="w-3.5 h-3.5 text-[#d4af37]" />
          Pattern Tracking & Analytics
        </div>
        <h1 className="font-serif-luxury text-3xl font-bold text-[#f3e5ab]">
          Recurring Themes & Symbolic Frequency
        </h1>
        <p className="text-xs text-gray-400 font-light">
          Tracking card appearances, spread distributions, and emotional trajectories across your readings over time.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#12141d] border border-gold-subtle space-y-2 text-center">
          <span className="text-xs font-mono uppercase text-[#d4af37]">Total Readings</span>
          <p className="font-serif-luxury text-4xl font-bold text-[#f3e5ab]">
            {analytics.totalReadings}
          </p>
          <span className="text-[11px] text-gray-500 block">Journaled in Tarot Depth</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#12141d] border border-gold-subtle space-y-2 text-center">
          <span className="text-xs font-mono uppercase text-[#d4af37]">Unique Cards Drawn</span>
          <p className="font-serif-luxury text-4xl font-bold text-[#f3e5ab]">
            {analytics.mostFrequentCards.length}
          </p>
          <span className="text-[11px] text-gray-500 block">Distinct archetypes</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#12141d] border border-gold-subtle space-y-2 text-center">
          <span className="text-xs font-mono uppercase text-[#d4af37]">Spreads Explored</span>
          <p className="font-serif-luxury text-4xl font-bold text-[#f3e5ab]">
            {Object.keys(analytics.spreadCounts).length}
          </p>
          <span className="text-[11px] text-gray-500 block">Different spread formats</span>
        </div>
      </div>

      {/* AI Narrative Synthesis Box */}
      <section className="bg-[#12141d] p-6 sm:p-8 rounded-3xl border border-gold-glow space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-[#f3e5ab]">
                Gemini Pattern Synthesis
              </h2>
              <span className="text-[10px] font-mono uppercase text-[#d4af37]/80">
                AI Narrative Analysis Across Journal History
              </span>
            </div>
          </div>

          <button
            onClick={handleSynthesizeSummary}
            disabled={isSynthesizing || readings.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-lg glow-gold disabled:opacity-50"
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                {aiSummary ? 'Re-Synthesize Narrative' : 'Synthesize Pattern Summary'}
              </>
            )}
          </button>
        </div>

        {readings.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">
            Record a few readings in your journal first to unlock AI pattern synthesis across sessions.
          </p>
        ) : aiSummary ? (
          <div className="p-6 rounded-2xl bg-[#0b0c10] border border-gold-subtle text-gray-200 text-sm leading-relaxed whitespace-pre-line font-light">
            {aiSummary}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#0b0c10]/60 border border-gold-subtle/50 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-[#d4af37]/40 mx-auto" />
            <p className="text-xs text-gray-400">
              Click "Synthesize Pattern Summary" above to let Gemini analyze overarching themes across your past {readings.length} readings.
            </p>
          </div>
        )}
      </section>

      {/* Frequent Cards Breakdown */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Frequent Cards */}
        <div className="p-6 rounded-2xl bg-[#12141d] border border-gold-subtle space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-[#f3e5ab] flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#d4af37]" />
            Most Frequent Cards
          </h3>

          {analytics.mostFrequentCards.length === 0 ? (
            <p className="text-xs text-gray-500">No card frequency data available yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.mostFrequentCards.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#0b0c10] border border-gold-subtle/60">
                  <span className="text-xs font-semibold text-[#f3e5ab] font-serif-luxury">
                    {i + 1}. {c.name}
                  </span>
                  <span className="text-xs font-mono text-[#d4af37] px-2.5 py-0.5 rounded bg-[#d4af37]/10">
                    {c.count} {c.count === 1 ? 'draw' : 'draws'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Spread Frequency Breakdown */}
        <div className="p-6 rounded-2xl bg-[#12141d] border border-gold-subtle space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-[#f3e5ab] flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#d4af37]" />
            Spread Format Frequency
          </h3>

          {Object.keys(analytics.spreadCounts).length === 0 ? (
            <p className="text-xs text-gray-500">No spread frequency data available yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(analytics.spreadCounts).map(([spreadTitle, count], i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#0b0c10] border border-gold-subtle/60">
                  <span className="text-xs text-gray-300">
                    {spreadTitle}
                  </span>
                  <span className="text-xs font-mono text-[#d4af37] px-2.5 py-0.5 rounded bg-[#d4af37]/10">
                    {count} {count === 1 ? 'session' : 'sessions'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
