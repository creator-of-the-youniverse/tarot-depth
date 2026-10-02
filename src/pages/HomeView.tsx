import React from 'react';
import { Sparkles, BookOpen, LineChart, Compass, ArrowRight, Sun, Calendar, Clock, Heart, Shield, Layers, Feather } from 'lucide-react';
import { TarotReading, UserProfile } from '../types';
import { getCardOfTheDay } from '../lib/cardOfTheDay';
import { DailyAffirmationWidget } from '../components/DailyAffirmationWidget';
import { ShareOptions } from '../lib/share';

interface HomeViewProps {
  userProfile: UserProfile | null;
  recentReadings: TarotReading[];
  onSelectSpread: () => void;
  onQuickDailyDraw: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenReadingDetail: (reading: TarotReading) => void;
  onOpenShare?: (options: ShareOptions) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userProfile,
  recentReadings,
  onSelectSpread,
  onQuickDailyDraw,
  onNavigateTab,
  onOpenReadingDetail,
  onOpenShare
}) => {
  const userName = userProfile?.displayName || 'Seeker';
  const todayCard = getCardOfTheDay();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* HERO BANNER WITH PROMINENT APP TITLE */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#161618] via-[#0E0E10] to-[#0A0A0B] border border-[#C5A059]/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Main App Title Banner */}
          <div className="space-y-3 border-b border-[#C5A059]/20 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs text-[#D4B97E] font-mono uppercase tracking-[0.25em]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Sacred Arcana & Symbolic Journal
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#9A7B38] tracking-[0.18em] uppercase drop-shadow-md leading-none">
              TAROT DEPTH
            </h1>
            
            <p className="font-serif italic text-base sm:text-lg text-[#D4B97E]/90 tracking-wide font-light">
              A Quiet Sanctuary for Self-Reflection, Archetypal Wisdom & Introspective Journaling
            </p>
          </div>

          {/* Personal Greeting */}
          <div className="max-w-2xl space-y-4 pt-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#E5E5E5] leading-tight tracking-wide">
              Welcome, <span className="text-[#C5A059]">{userName}</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Step back from the outer noise. Draw cards for quiet reflection, symbolic insight, custom spread geometries, and deep private journaling.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onNavigateTab('card_of_the_day')}
                className="px-5 py-3 rounded-xl bg-gold-gradient text-black font-bold text-xs sm:text-sm tracking-wider uppercase hover:brightness-110 transition-all shadow-xl glow-gold flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Sun className="w-4 h-4 text-black" />
                Explore Card of the Day
              </button>

              <button
                onClick={() => onNavigateTab('horoscope')}
                className="px-5 py-3 rounded-xl bg-[#1c1b22] border border-[#C5A059]/50 text-[#F3E5AB] font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[#25232d] transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Compass className="w-4 h-4 text-[#C5A059]" />
                Zodiac & Synastry
              </button>

              <button
                onClick={onSelectSpread}
                className="px-5 py-3 rounded-xl bg-[#0E0E10] border border-[#C5A059]/30 text-[#D4B97E] font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                Explore All Spreads
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DAILY AFFIRMATION WIDGET */}
      <DailyAffirmationWidget onOpenShare={onOpenShare} />

      {/* CARD OF THE DAY SPOTLIGHT CARD */}
      <section
        onClick={() => onNavigateTab('card_of_the_day')}
        className="group cursor-pointer p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#161618] via-[#0E0E10] to-[#121214] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all shadow-xl hover:shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[10px] font-mono text-[#D4B97E] uppercase tracking-widest">
              <Sun className="w-3.5 h-3.5 text-[#C5A059]" />
              Today's Featured Arcana • {todayCard.formattedDate}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#E5E5E5] tracking-wide">
              {todayCard.card.name}{' '}
              <span className="text-sm font-mono font-normal text-[#C5A059]">
                ({todayCard.orientation})
              </span>
            </h2>

            <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 font-light">
              "{todayCard.orientation === 'upright' ? todayCard.card.uprightMeaning : todayCard.card.reversedMeaning}"
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#C5A059] font-mono font-semibold group-hover:underline">
              <span>Read Full Symbolism, Traditional Lore & Meditation Prompt</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0E0E10]/90 p-4 rounded-2xl border border-[#C5A059]/20 shrink-0">
            <div className="w-12 h-16 rounded-lg bg-[#161618] border border-[#C5A059]/40 flex flex-col items-center justify-center text-[#C5A059]">
              <Feather className="w-6 h-6" />
            </div>
            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">
                {todayCard.card.arcana} Arcana
              </span>
              <span className="text-xs font-semibold text-[#D4B97E] block">
                {todayCard.card.element} Element
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block">
                Daily Focus Active
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={onSelectSpread}
          className="group cursor-pointer p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/20 hover:border-[#C5A059] transition-all hover:-translate-y-1 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Compass className="w-6 h-6 text-[#C5A059]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#D4B97E] mb-1">
            New Deep Reading
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Select classic spreads or design custom spreads with tailored positions.
          </p>
          <span className="text-xs text-[#C5A059] font-semibold flex items-center gap-1 group-hover:underline">
            Explore Spreads <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('journal')}
          className="group cursor-pointer p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/20 hover:border-[#C5A059] transition-all hover:-translate-y-1 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-[#C5A059]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#D4B97E] mb-1">
            Private Journal
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Review past readings, revisit AI reflections, and add ongoing personal notes.
          </p>
          <span className="text-xs text-[#C5A059] font-semibold flex items-center gap-1 group-hover:underline">
            View Reading History ({recentReadings.length}) <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('patterns')}
          className="group cursor-pointer p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/20 hover:border-[#C5A059] transition-all hover:-translate-y-1 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <LineChart className="w-6 h-6 text-[#C5A059]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#D4B97E] mb-1">
            Pattern Insights
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Discover recurring cards, top mood trajectories, and AI theme synthesis.
          </p>
          <span className="text-xs text-[#C5A059] font-semibold flex items-center gap-1 group-hover:underline">
            Analyze Patterns <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </section>

      {/* RECENT READINGS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-luxury text-2xl font-bold text-[#f3e5ab]">
              Recent Journal Entries
            </h2>
            <p className="text-xs text-gray-400">
              Your recent self-reflection sessions
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('journal')}
            className="text-xs text-[#d4af37] hover:underline flex items-center gap-1"
          >
            See All Journal Entries ({recentReadings.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentReadings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#12141d] border border-dashed border-gold-subtle text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[#d4af37]/50 mx-auto" />
            <p className="text-sm text-gray-300 font-medium">Your journal is currently empty.</p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Begin your first reading to save symbolic interpretations and personal reflections.
            </p>
            <button
              onClick={onSelectSpread}
              className="mt-2 px-5 py-2 rounded-lg bg-gold-gradient text-black font-semibold text-xs tracking-wider uppercase"
            >
              Begin First Reading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReadings.slice(0, 3).map((reading) => (
              <div
                key={reading.id}
                onClick={() => onOpenReadingDetail(reading)}
                className="group cursor-pointer p-5 rounded-2xl bg-[#12141d] border border-gold-subtle hover:border-[#d4af37] transition-all space-y-3 flex flex-col justify-between hover:scale-[1.02] shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span className="text-[#d4af37] uppercase">{reading.spreadTitle}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(reading.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-serif-luxury font-bold text-white group-hover:text-[#f3e5ab] transition-colors line-clamp-2 text-base">
                    "{reading.question || 'General Self Reflection'}"
                  </h4>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {reading.cards?.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#0b0c10] border border-gold-subtle text-[#f3e5ab]"
                      >
                        {c.name}
                      </span>
                    ))}
                    {reading.cards?.length > 3 && (
                      <span className="text-[10px] text-gray-500">
                        +{reading.cards.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-gold-subtle flex items-center justify-between text-xs text-gray-400">
                  <span className="line-clamp-1 italic text-[11px]">
                    {reading.mood ? `Mood: ${reading.mood}` : 'Reflective'}
                  </span>
                  <span className="text-[#d4af37] font-semibold text-[11px]">Read Entry →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DAILY SYMBOLIC REFLECTION QUOTE */}
      <section className="p-8 rounded-2xl bg-[#12141d]/80 border border-gold-subtle text-center max-w-3xl mx-auto space-y-3">
        <Sparkles className="w-6 h-6 text-[#d4af37] mx-auto animate-pulse" />
        <p className="font-serif-luxury text-lg italic text-[#f3e5ab] leading-relaxed">
          "Tarot does not hold the power to dictate your destiny. It holds up a mirror to the quiet wisdom already resting inside your soul."
        </p>
        <span className="text-xs uppercase tracking-widest text-[#d4af37]/70 font-mono block">
          Tarot Depth Wisdom Anchor
        </span>
      </section>
    </div>
  );
};
