import React, { useState, useEffect } from 'react';
import {
  ZODIAC_SIGNS,
  ZodiacId,
  ZodiacSign,
  getZodiacSign,
  getCompatibility,
  ELEMENTAL_DYNAMICS,
  ZODIAC_SIGNS as signsList
} from '../data/zodiacData';
import {
  Sparkles,
  Heart,
  Briefcase,
  Moon,
  Flame,
  Globe,
  Compass,
  Check,
  RefreshCw,
  Users,
  Grid,
  Zap,
  Info,
  ChevronRight,
  Sun,
  Star
} from 'lucide-react';

interface HoroscopeViewProps {
  userZodiacSign?: string;
  onUpdateZodiacSign?: (signId: string) => void;
  onNavigateToCard?: (cardName: string) => void;
}

export const HoroscopeView: React.FC<HoroscopeViewProps> = ({
  userZodiacSign = 'aries',
  onUpdateZodiacSign,
  onNavigateToCard
}) => {
  // Active Sub-Tab: 'daily' | 'compatibility' | 'transits'
  const [activeTab, setActiveTab] = useState<'daily' | 'compatibility' | 'transits'>('daily');

  // Selected Daily Sign State
  const [selectedSignId, setSelectedSignId] = useState<ZodiacId>(
    (userZodiacSign as ZodiacId) || 'aries'
  );

  // Gemini Live Daily Reading State
  const [isGeneratingDaily, setIsGeneratingDaily] = useState(false);
  const [liveDailyReading, setLiveDailyReading] = useState<{
    overallReading?: string;
    energyScore?: number;
    loveInsight?: string;
    careerInsight?: string;
    spiritInsight?: string;
    luckyColor?: string;
    luckyNumbers?: number[];
    tarotArchetypeFocus?: string;
    cosmicAdvice?: string;
  } | null>(null);
  const [dailyError, setDailyError] = useState<string | null>(null);

  // Synastry State
  const [sign1Id, setSign1Id] = useState<ZodiacId>((userZodiacSign as ZodiacId) || 'aries');
  const [sign2Id, setSign2Id] = useState<ZodiacId>('leo');
  const [isGeneratingSynastry, setIsGeneratingSynastry] = useState(false);
  const [liveSynastry, setLiveSynastry] = useState<{
    synastryScore?: number;
    headline?: string;
    romanticChemistry?: string;
    intellectualConnection?: string;
    frictionAndWorkarounds?: string;
    astroTarotSynthesis?: string;
    growthKey?: string;
  } | null>(null);

  // Sync selected sign with prop if changed
  useEffect(() => {
    if (userZodiacSign && ZODIAC_SIGNS.some((s) => s.id === userZodiacSign)) {
      setSelectedSignId(userZodiacSign as ZodiacId);
    }
  }, [userZodiacSign]);

  // Reset live reading when sign changes so user sees crisp data
  const handleSelectSign = (signId: ZodiacId) => {
    setSelectedSignId(signId);
    setLiveDailyReading(null);
    setDailyError(null);
  };

  const currentSign = getZodiacSign(selectedSignId);

  // Save Sign as My Personal Sign
  const handleSetAsMySign = () => {
    if (onUpdateZodiacSign) {
      onUpdateZodiacSign(selectedSignId);
    }
  };

  // Fetch AI Daily Horoscope
  const handleFetchLiveDaily = async () => {
    setIsGeneratingDaily(true);
    setDailyError(null);
    try {
      const res = await fetch('/api/horoscope/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sign: currentSign.name })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch live daily horoscope.');
      }

      const data = await res.json();
      if (data.reading) {
        setLiveDailyReading(data.reading);
      }
    } catch (err: any) {
      console.error('Error fetching live daily:', err);
      setDailyError('Unable to connect to live transit synthesis. Showing timeless astrology insights.');
    } finally {
      setIsGeneratingDaily(false);
    }
  };

  // Fetch AI Synastry
  const handleFetchLiveSynastry = async () => {
    setIsGeneratingSynastry(true);
    try {
      const s1 = getZodiacSign(sign1Id);
      const s2 = getZodiacSign(sign2Id);
      const res = await fetch('/api/horoscope/synastry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sign1: s1.name, sign2: s2.name })
      });

      if (!res.ok) {
        throw new Error('Failed to generate synastry.');
      }

      const data = await res.json();
      if (data.synastry) {
        setLiveSynastry(data.synastry);
      }
    } catch (err) {
      console.error('Error fetching synastry:', err);
    } finally {
      setIsGeneratingSynastry(false);
    }
  };

  const compatibility = getCompatibility(sign1Id, sign2Id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-fade-in pb-20">
      {/* Header Banner */}
      <div className="text-center space-y-3 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Celestial Guidance & Synastry</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide font-bold">
          Zodiac & Horoscope Depth
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto font-light leading-relaxed">
          Unveil daily planetary transits, elemental compatibility matrices, and the sacred synergy between Astrology and Tarot archetypes.
        </p>
      </div>

      {/* Main Sub-Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-[#121214] border border-[#C5A059]/20 rounded-2xl max-w-lg mx-auto shadow-inner">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
            activeTab === 'daily'
              ? 'bg-gold-gradient text-black shadow-lg font-extrabold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Daily Horoscopes</span>
        </button>

        <button
          onClick={() => setActiveTab('compatibility')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
            activeTab === 'compatibility'
              ? 'bg-gold-gradient text-black shadow-lg font-extrabold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Synastry Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('transits')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
            activeTab === 'transits'
              ? 'bg-gold-gradient text-black shadow-lg font-extrabold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Cosmic Transits</span>
        </button>
      </div>

      {/* TAB 1: DAILY HOROSCOPE */}
      {activeTab === 'daily' && (
        <div className="space-y-8">
          {/* Horizontal Zodiac Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span className="font-mono uppercase tracking-widest text-[#C5A059]">
                Select Your Zodiac Sign:
              </span>
              {userZodiacSign === selectedSignId ? (
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                  <Check className="w-3.5 h-3.5" /> Your Saved Sign
                </span>
              ) : (
                <button
                  onClick={handleSetAsMySign}
                  className="text-xs text-[#C5A059] hover:underline font-mono flex items-center gap-1 cursor-pointer"
                >
                  Set as My Default Sign
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-[#C5A059]/30">
              {ZODIAC_SIGNS.map((s) => {
                const isSelected = s.id === selectedSignId;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSign(s.id)}
                    className={`shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all min-w-[76px] cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#C5A059]/30 via-[#1a1820] to-[#121214] border-[#C5A059] text-white shadow-lg shadow-[#C5A059]/10 scale-105'
                        : 'bg-tarot-card-bg/80 border-[#C5A059]/20 text-gray-400 hover:text-white hover:border-[#C5A059]/40'
                    }`}
                  >
                    <span className="text-2xl mb-1">{s.symbol}</span>
                    <span className="text-xs font-serif font-bold">{s.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono scale-90">{s.elementSymbol} {s.element}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sign Hero Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#18181c] via-tarot-surface to-[#0e0e10] border border-[#C5A059]/30 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Title Block */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C5A059]/15 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C5A059]/20 to-black border border-[#C5A059]/50 flex items-center justify-center text-4xl text-[#C5A059] shadow-xl">
                  {currentSign.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl md:text-3xl font-serif text-white font-bold">
                      {currentSign.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-[11px] font-mono">
                      {currentSign.elementSymbol} {currentSign.element} • {currentSign.modality}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    {currentSign.dates} • Ruled by {currentSign.rulingPlanet}
                  </p>
                </div>
              </div>

              {/* Synthesize Live Gemini Reading Button */}
              <button
                onClick={handleFetchLiveDaily}
                disabled={isGeneratingDaily}
                className="px-4 py-3 rounded-2xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg min-h-[44px] cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingDaily ? 'animate-spin' : ''}`} />
                <span>{isGeneratingDaily ? 'Reading Celestial Transits...' : 'Synthesize AI Daily Horoscope'}</span>
              </button>
            </div>

            {/* Daily Overall Insight */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-[#C5A059]" />
                  Today's Astrological Vibe
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs font-mono text-[#C5A059]">
                  <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Energy Score: {liveDailyReading?.energyScore || currentSign.defaultDaily.energyScore}%</span>
                </div>
              </div>

              <p className="text-base text-gray-200 font-serif leading-relaxed italic p-4 rounded-2xl bg-black/40 border border-white/5">
                "{liveDailyReading?.overallReading || currentSign.defaultDaily.overall}"
              </p>

              {dailyError && (
                <p className="text-xs text-amber-300 font-mono bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
                  {dailyError}
                </p>
              )}
            </div>

            {/* Daily Category Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Love & Relationships */}
              <div className="p-4 rounded-2xl bg-black/30 border border-[#C5A059]/20 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase">
                  <Heart className="w-4 h-4" />
                  <span>Love & Relationships</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {liveDailyReading?.loveInsight || currentSign.defaultDaily.love}
                </p>
              </div>

              {/* Career & Ambition */}
              <div className="p-4 rounded-2xl bg-black/30 border border-[#C5A059]/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
                  <Briefcase className="w-4 h-4" />
                  <span>Career & Creation</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {liveDailyReading?.careerInsight || currentSign.defaultDaily.career}
                </p>
              </div>

              {/* Spirit & Mindful Focus */}
              <div className="p-4 rounded-2xl bg-black/30 border border-[#C5A059]/20 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-mono font-bold uppercase">
                  <Moon className="w-4 h-4" />
                  <span>Spirit & Reflection</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {liveDailyReading?.spiritInsight || currentSign.defaultDaily.spirit}
                </p>
              </div>
            </div>

            {/* Lucky Aspects & Tarot Connection */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lucky Elements */}
              <div className="p-4 rounded-2xl bg-[#121215] border border-white/5 space-y-2 text-xs">
                <span className="font-mono text-[#C5A059] uppercase tracking-wider block">
                  Cosmic Luck Metrics
                </span>
                <div className="grid grid-cols-2 gap-2 text-gray-300">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Power Color:</span>
                    <span className="font-medium text-white">
                      {liveDailyReading?.luckyColor || currentSign.defaultDaily.luckyColor}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Power Hour:</span>
                    <span className="font-medium text-white">{currentSign.defaultDaily.powerHour}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block text-[10px]">Lucky Numbers:</span>
                    <span className="font-mono text-[#C5A059]">
                      {(liveDailyReading?.luckyNumbers || currentSign.defaultDaily.luckyNumbers).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarot Archetype Focus */}
              <div className="p-4 rounded-2xl bg-[#121215] border border-white/5 space-y-2 text-xs">
                <span className="font-mono text-[#C5A059] uppercase tracking-wider block">
                  Connected Tarot Archetype
                </span>
                <p className="text-gray-200 font-serif">
                  {liveDailyReading?.tarotArchetypeFocus || currentSign.defaultDaily.tarotFocus}
                </p>
                <div className="pt-1">
                  <span className="text-[11px] text-[#C5A059] underline cursor-pointer hover:text-white" onClick={() => onNavigateToCard?.(currentSign.tarotArchetype)}>
                    Explore {currentSign.tarotArchetype} Card Meaning →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPATIBILITY & SYNASTRY MATRIX */}
      {activeTab === 'compatibility' && (
        <div className="space-y-8">
          {/* Dual Sign Selector & Synastry Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#18181c] via-tarot-surface to-[#0e0e10] border border-[#C5A059]/30 shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-serif text-white font-bold">
                Synastry & Elemental Compatibility
              </h2>
              <p className="text-xs text-gray-400 font-light">
                Select two zodiac signs to analyze their elemental dynamics, communication synergy, and archetypal union.
              </p>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Partner 1 */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#C5A059]/20 space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-[#C5A059] block">
                  First Sign (You / Partner A)
                </label>
                <select
                  value={sign1Id}
                  onChange={(e) => setSign1Id(e.target.value as ZodiacId)}
                  className="w-full bg-[#16161a] border border-[#C5A059]/40 rounded-xl px-3.5 py-2.5 text-sm text-white font-serif focus:outline-none focus:border-[#C5A059] min-h-[44px]"
                >
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.symbol} {s.name} ({s.element})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-400 font-mono flex items-center justify-between pt-1">
                  <span>{compatibility.s1.dates}</span>
                  <span>Ruled by {compatibility.s1.rulingPlanet}</span>
                </div>
              </div>

              {/* Partner 2 */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#C5A059]/20 space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-[#C5A059] block">
                  Second Sign (Partner B / Friend)
                </label>
                <select
                  value={sign2Id}
                  onChange={(e) => setSign2Id(e.target.value as ZodiacId)}
                  className="w-full bg-[#16161a] border border-[#C5A059]/40 rounded-xl px-3.5 py-2.5 text-sm text-white font-serif focus:outline-none focus:border-[#C5A059] min-h-[44px]"
                >
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.symbol} {s.name} ({s.element})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-400 font-mono flex items-center justify-between pt-1">
                  <span>{compatibility.s2.dates}</span>
                  <span>Ruled by {compatibility.s2.rulingPlanet}</span>
                </div>
              </div>
            </div>

            {/* Match Score Gauge Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-black/60 via-[#1e1c24] to-black/60 border border-[#C5A059]/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 rounded-full bg-gold-gradient p-1 flex items-center justify-center shrink-0 shadow-lg">
                  <div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold font-serif text-[#C5A059]">
                      {liveSynastry?.synastryScore || compatibility.score}%
                    </span>
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter">Match</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-serif text-white font-bold">
                      {compatibility.s1.name} & {compatibility.s2.name}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#C5A059]">
                    {liveSynastry?.headline || compatibility.label} • {compatibility.s1.element} + {compatibility.s2.element}
                  </p>
                  <p className="text-xs text-gray-300 font-light max-w-lg leading-relaxed">
                    {compatibility.summary}
                  </p>
                </div>
              </div>

              <button
                onClick={handleFetchLiveSynastry}
                disabled={isGeneratingSynastry}
                className="shrink-0 px-4 py-3 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-md min-h-[44px] cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingSynastry ? 'animate-spin' : ''}`} />
                <span>{isGeneratingSynastry ? 'Analyzing Synastry...' : 'Generate AI Deep-Dive'}</span>
              </button>
            </div>

            {/* Live Gemini Synastry Result or Default Metrics */}
            {liveSynastry ? (
              <div className="space-y-4 p-5 rounded-2xl bg-black/40 border border-[#C5A059]/30 animate-fade-in">
                <h3 className="text-sm font-serif font-bold text-[#C5A059] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Deep Astrological & Tarot Synastry
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/5 space-y-1">
                    <span className="font-mono text-rose-300 uppercase block font-bold">Romantic Chemistry</span>
                    <p className="text-gray-200 leading-relaxed">{liveSynastry.romanticChemistry}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 space-y-1">
                    <span className="font-mono text-sky-300 uppercase block font-bold">Intellectual Sync</span>
                    <p className="text-gray-200 leading-relaxed">{liveSynastry.intellectualConnection}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 space-y-1">
                    <span className="font-mono text-amber-300 uppercase block font-bold">Growth & Tension Workaround</span>
                    <p className="text-gray-200 leading-relaxed">{liveSynastry.frictionAndWorkarounds}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 space-y-1">
                    <span className="font-mono text-purple-300 uppercase block font-bold">Tarot Archetype Union</span>
                    <p className="text-gray-200 leading-relaxed">{liveSynastry.astroTarotSynthesis}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs text-[#C5A059] font-serif italic text-center">
                  Key Takeaway: "{liveSynastry.growthKey}"
                </div>
              </div>
            ) : (
              /* Breakdown meters */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-rose-300">Romance & Passion</span>
                    <span className="text-white font-bold">{compatibility.romanceScore}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-rose-400 h-full rounded-full transition-all"
                      style={{ width: `${compatibility.romanceScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-sky-300">Communication</span>
                    <span className="text-white font-bold">{compatibility.communicationScore}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sky-400 h-full rounded-full transition-all"
                      style={{ width: `${compatibility.communicationScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-300">Growth & Resilience</span>
                    <span className="text-white font-bold">{compatibility.growthScore}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${compatibility.growthScore}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive 12x12 Compatibility Grid */}
          <div className="p-6 rounded-3xl bg-[#121215] border border-[#C5A059]/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif text-white font-bold flex items-center gap-2">
                  <Grid className="w-4 h-4 text-[#C5A059]" /> Full 12-Sign Compatibility Heatmap
                </h3>
                <p className="text-xs text-gray-400 font-light">
                  Click any intersection cell to load that pair directly into the Synastry Analyzer above.
                </p>
              </div>
            </div>

            {/* Responsive Table Grid */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#C5A059]/30 pt-2">
              <table className="w-full text-center border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-2 text-xs font-mono text-[#C5A059] border-b border-white/10"></th>
                    {ZODIAC_SIGNS.map((s) => (
                      <th key={s.id} className="p-2 text-xs font-serif text-gray-300 border-b border-white/10 font-bold">
                        {s.symbol}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ZODIAC_SIGNS.map((rowSign) => (
                    <tr key={rowSign.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-2 text-xs font-serif text-[#C5A059] font-bold text-left whitespace-nowrap">
                        {rowSign.symbol} {rowSign.name}
                      </td>
                      {ZODIAC_SIGNS.map((colSign) => {
                        const cellComp = getCompatibility(rowSign.id, colSign.id);
                        const isMatch = rowSign.id === sign1Id && colSign.id === sign2Id;

                        // Heatmap color logic
                        let bgClass = 'bg-emerald-950/40 text-emerald-300';
                        if (cellComp.score >= 90) {
                          bgClass = 'bg-amber-500/20 text-amber-300 font-bold';
                        } else if (cellComp.score >= 80) {
                          bgClass = 'bg-emerald-500/15 text-emerald-300';
                        } else {
                          bgClass = 'bg-sky-500/15 text-sky-300';
                        }

                        return (
                          <td
                            key={colSign.id}
                            onClick={() => {
                              setSign1Id(rowSign.id);
                              setSign2Id(colSign.id);
                              setLiveSynastry(null);
                            }}
                            className={`p-2 text-xs font-mono cursor-pointer transition-all hover:scale-110 rounded-lg ${bgClass} ${
                              isMatch ? 'ring-2 ring-[#C5A059] scale-105 z-10' : ''
                            }`}
                            title={`${rowSign.name} + ${colSign.name}: ${cellComp.score}% (${cellComp.label})`}
                          >
                            {cellComp.score}%
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COSMIC TRANSITS & ASTRO-TAROT */}
      {activeTab === 'transits' && (
        <div className="space-y-8">
          {/* Planetary Transits Banner */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#18181c] via-tarot-surface to-[#0e0e10] border border-[#C5A059]/30 shadow-2xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059]">
                Current Astrological Climate
              </span>
              <h2 className="text-2xl font-serif text-white font-bold">
                Sun in Leo • Moon in Pisces • Planetary Synergy
              </h2>
              <p className="text-xs text-gray-300 font-light leading-relaxed max-w-2xl">
                Astrology maps the macrocosmic tides, while Tarot offers the mirror for personal consciousness. Below is how the 12 Zodiac Signs correlate to the Major Arcana cards in Tarot Depth.
              </p>
            </div>

            {/* Astro Tarot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
              {ZODIAC_SIGNS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onNavigateToCard?.(s.tarotArchetype)}
                  className="p-4 rounded-2xl bg-black/40 border border-[#C5A059]/20 hover:border-[#C5A059] transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{s.symbol}</span>
                    <span className="text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded-md">
                      {s.element}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white group-hover:text-[#C5A059] transition-colors">
                      {s.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-serif">
                      Card: <span className="text-gray-200 font-medium">{s.tarotArchetype}</span>
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">
                    {s.description}
                  </p>
                  <div className="text-[10px] text-[#C5A059] font-mono pt-1 group-hover:underline flex items-center gap-1">
                    <span>Inspect Archetype</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
