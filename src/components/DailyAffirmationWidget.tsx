import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Copy, Check, Quote, Sun, Share2 } from 'lucide-react';
import { ShareOptions, shareContent } from '../lib/share';

interface DailyAffirmationData {
  date: string;
  affirmation: string;
  theme: string;
  cardConnection: string;
  reflectionFocus: string;
}

interface DailyAffirmationWidgetProps {
  onOpenShare?: (options: ShareOptions) => void;
}

export const DailyAffirmationWidget: React.FC<DailyAffirmationWidgetProps> = ({ onOpenShare }) => {
  const [data, setData] = useState<DailyAffirmationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchAffirmation = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Check localStorage for cached daily affirmation if not explicitly refreshing
      const todayStr = new Date().toISOString().split('T')[0];
      const cached = localStorage.getItem(`tarot_depth_affirmation_${todayStr}`);
      if (cached && !isRefresh) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const res = await fetch('/api/daily-affirmation');
      if (!res.ok) {
        throw new Error('Failed to fetch affirmation');
      }
      const json: DailyAffirmationData = await res.json();
      setData(json);
      localStorage.setItem(`tarot_depth_affirmation_${todayStr}`, JSON.stringify(json));
    } catch (err) {
      console.warn('Affirmation fetch notice (using fallback):', err);
      // Fallback affirmation
      setData({
        date: new Date().toISOString().split('T')[0],
        affirmation: 'I walk in the golden clarity of my own inner truth, honoring every phase of my spiritual evolution.',
        theme: 'Golden Sovereign Light',
        cardConnection: 'Inspired by The Sun & The Star',
        reflectionFocus: 'Take three deep breaths today and notice where you hold unshakeable inner peace.'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAffirmation();
  }, []);

  const handleCopy = () => {
    if (!data) return;
    const textToCopy = `"${data.affirmation}" — ${data.theme} (${data.cardConnection})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (!data) return;
    const shareOpts: ShareOptions = {
      title: `Daily Arcana Affirmation: ${data.theme}`,
      text: `${data.affirmation}\n\n${data.cardConnection}\nToday's Focus: ${data.reflectionFocus}`,
      category: 'affirmation'
    };

    if (onOpenShare) {
      onOpenShare(shareOpts);
    } else {
      shareContent(shareOpts);
    }
  };

  return (
    <section className="relative rounded-3xl bg-gradient-to-br from-[#181612] via-[#0E0E10] to-[#12100C] border border-[#C5A059]/40 p-6 sm:p-8 shadow-2xl overflow-hidden group">
      {/* Subtle gold glow accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C5A059]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-gradient p-[1px] shadow-lg shrink-0">
              <div className="w-full h-full rounded-[15px] bg-[#0A0A0B] flex items-center justify-center text-[#C5A059]">
                <Sparkles className="w-5 h-5 text-[#C5A059] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#D4B97E] uppercase tracking-[0.2em]">
                  Daily Arcana Affirmation
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                <span className="text-[10px] text-gray-400 font-mono">
                  {data?.date || new Date().toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#E5E5E5] tracking-wide">
                {loading ? 'Consulting the Arcana...' : data?.theme}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAffirmation(true)}
              disabled={refreshing || loading}
              className="p-2 rounded-xl bg-[#161618] border border-[#C5A059]/30 text-gray-300 hover:text-[#D4B97E] hover:border-[#C5A059] transition-all disabled:opacity-50 cursor-pointer"
              title="Generate new daily affirmation"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#C5A059]' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              disabled={loading || !data}
              className="px-3 py-1.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md glow-gold cursor-pointer"
              title="Share affirmation"
            >
              <Share2 className="w-3.5 h-3.5 text-black" />
              <span>Share</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={loading || !data}
              className="px-3 py-1.5 rounded-xl bg-[#161618] border border-[#C5A059]/30 text-xs font-mono text-[#D4B97E] hover:border-[#C5A059] transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copy affirmation to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-8 text-center space-y-3 animate-pulse">
            <Quote className="w-8 h-8 text-[#C5A059]/40 mx-auto" />
            <div className="h-4 bg-[#C5A059]/20 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-[#C5A059]/10 rounded w-1/2 mx-auto" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* The Affirmation Quote */}
            <div className="relative pl-6 border-l-2 border-[#C5A059] space-y-2">
              <p className="font-serif text-xl sm:text-2xl italic text-[#F3E5AB] leading-relaxed tracking-wide">
                "{data?.affirmation}"
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Sun className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-xs font-mono text-[#D4B97E] tracking-wider uppercase">
                  {data?.cardConnection}
                </span>
              </div>
            </div>

            {/* Daily Mindfulness Focus */}
            <div className="p-4 rounded-2xl bg-[#0A0A0B]/80 border border-[#C5A059]/20 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-[#C5A059]/10 text-[#C5A059] shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-mono text-[10px] text-[#C5A059] uppercase tracking-wider block font-bold">
                  Today's Grounding Focus
                </span>
                <p className="text-gray-300 font-light leading-relaxed">
                  {data?.reflectionFocus}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

