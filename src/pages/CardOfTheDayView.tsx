import React, { useState } from 'react';
import { getCardOfTheDay, CardOfTheDayData } from '../lib/cardOfTheDay';
import { TarotCardView } from '../components/TarotCardView';
import { TarotReading, SpreadDefinition, UserProfile, CardOrientation } from '../types';
import { saveReading } from '../lib/firebase';
import { ShareOptions, shareContent } from '../lib/share';
import {
  Sparkles,
  Sun,
  BookOpen,
  Feather,
  Compass,
  Check,
  Copy,
  PenTool,
  RotateCw,
  Share2,
  Shield,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CardOfTheDayViewProps {
  userProfile: UserProfile | null;
  onStartReflectionReading: (spread: SpreadDefinition, cardOfToday: CardOfTheDayData) => void;
  onNavigateTab: (tab: string) => void;
  onOpenShare?: (options: ShareOptions) => void;
}

export const CardOfTheDayView: React.FC<CardOfTheDayViewProps> = ({
  userProfile,
  onStartReflectionReading,
  onNavigateTab,
  onOpenShare
}) => {
  const [todayData] = useState<CardOfTheDayData>(() => getCardOfTheDay());
  const [currentOrientation, setCurrentOrientation] = useState<CardOrientation>(todayData.orientation);
  const [isRevealed, setIsRevealed] = useState(true);
  const [activeTab, setActiveTab] = useState<'meanings' | 'symbolism' | 'lore' | 'reflection'>('meanings');
  const [userJournalInput, setUserJournalInput] = useState('');
  const [isSavingJournal, setIsSavingJournal] = useState(false);
  const [journalSavedSuccess, setJournalSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const { card, formattedDate, dailyPrompt, affirmation, esotericLore, elementalWisdom } = todayData;
  const orientation = currentOrientation;

  const toggleOrientation = () => {
    setCurrentOrientation((prev) => (prev === 'upright' ? 'reversed' : 'upright'));
  };

  const handleCopyWisdom = () => {
    const textToCopy = `Card of the Day (${formattedDate}): ${card.name} (${orientation.toUpperCase()})\n\nMeaning: ${
      orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning
    }\n\nAffirmation: ${affirmation}\n\nReflection Question: ${dailyPrompt}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleSaveDailyReflection = async () => {
    if (!userJournalInput.trim() || !userProfile?.uid) return;

    try {
      setIsSavingJournal(true);
      const singleSpreadTitle = `Card of the Day: ${formattedDate}`;

      const readingToSave: Omit<TarotReading, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        question: `Daily Reflection on ${card.name} (${formattedDate})`,
        spreadType: 'card_of_the_day_single',
        spreadTitle: singleSpreadTitle,
        cards: [
          {
            name: card.name,
            number: card.number,
            suit: card.suit || 'major',
            position: 'Card of the Day',
            positionDescription: dailyPrompt,
            orientation,
            meaning: orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning,
            keywords: orientation === 'upright' ? card.uprightKeywords : card.reversedKeywords,
            symbolism: card.symbolism
          }
        ],
        aiInterpretation: `**Card of the Day**: ${card.name} (${orientation.toUpperCase()})\n\n**Symbolism**: ${card.symbolism}\n\n**Traditional Meaning**: ${
          orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning
        }\n\n**Personal Note**: ${userJournalInput}`,
        reflectionQuestions: [dailyPrompt],
        journalingPrompt: dailyPrompt,
        mood: 'seeking_clarity',
        tags: ['Card of the Day', 'Daily Intention'],
        notes: userJournalInput
      };

      await saveReading(userProfile.uid, readingToSave);
      setJournalSavedSuccess(true);
      setUserJournalInput('');
      setTimeout(() => setJournalSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save daily reflection:', err);
    } finally {
      setIsSavingJournal(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      
      {/* Top Banner Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs text-[#D4B97E] font-mono uppercase tracking-[0.2em] shadow-sm">
          <Sun className="w-3.5 h-3.5 text-[#C5A059]" />
          Today's Arcana • {formattedDate}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#E5E5E5] tracking-wide">
          Card of the Day
        </h1>

        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Each day offers a singular archetype for self-reflection, symbolic meditation, and traditional tarot lore.
        </p>
      </div>

      {/* Main Card Stage & Hero Box */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#161618] via-[#0E0E10] to-[#0A0A0B] border border-[#C5A059]/30 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Stage Column */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
          <div className="relative p-4 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/30 shadow-2xl flex flex-col items-center">
            <TarotCardView
              card={card}
              positionName="Daily Focus"
              positionDescription={formattedDate}
              orientation={orientation}
              isFlipped={isRevealed}
              onFlip={() => setIsRevealed(!isRevealed)}
              onToggleOrientation={toggleOrientation}
              size="lg"
              deckStyle={userProfile?.defaultDeck || 'classic_gold'}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="px-3.5 py-1.5 rounded-xl bg-[#161618] border border-[#C5A059]/30 text-xs font-mono text-[#D4B97E] hover:border-[#C5A059] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              {isRevealed ? 'Hide Card Back' : 'Reveal Today’s Card'}
            </button>

            <button
              onClick={() => {
                const meaningText = orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning;
                const shareOpts: ShareOptions = {
                  title: `Card of the Day: ${card.name} (${orientation.toUpperCase()})`,
                  text: `${card.name} (${orientation}): "${meaningText}"\n\nDaily Reflection: ${card.reflectionPrompt || 'Honor your inner guidance today.'}`,
                  category: 'card'
                };
                if (onOpenShare) {
                  onOpenShare(shareOpts);
                } else {
                  shareContent(shareOpts);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md glow-gold cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-black" />
              Share
            </button>

            <button
              onClick={handleCopyWisdom}
              className="px-3.5 py-1.5 rounded-xl bg-[#161618] border border-[#C5A059]/30 text-xs font-mono text-[#D4B97E] hover:border-[#C5A059] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSuccess ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSuccess ? 'Copied!' : 'Copy Summary'}
            </button>
          </div>
        </div>

        {/* Hero Card Overview Details */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#D4B97E] font-mono text-[10px] uppercase font-bold tracking-widest">
                {card.arcana === 'major' ? `Major Arcana #${card.number}` : `${card.suit?.toUpperCase()} Suit`}
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-[#161618] border border-[#C5A059]/20 text-gray-300 font-mono text-[10px] uppercase tracking-widest">
                {card.element} Element
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border ${
                orientation === 'upright'
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/40'
              }`}>
                {orientation} Draw
              </span>
            </div>

            <h2 className="font-serif text-3xl font-bold text-[#E5E5E5] tracking-wide">
              {card.name}
            </h2>

            {card.archetype && (
              <p className="text-xs text-[#C5A059] italic font-serif">
                "{card.archetype}"
              </p>
            )}
          </div>

          {/* Quick Essence Meaning */}
          <div className="p-4 rounded-xl bg-[#0E0E10] border border-[#C5A059]/20 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-mono font-bold block">
              Today's Key Symbolic Essence
            </span>
            <p className="text-xs text-gray-200 leading-relaxed font-light">
              {orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning}
            </p>
          </div>

          {/* Daily Affirmation Callout */}
          <div className="p-4 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4B97E] font-serif font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Daily Contemplative Affirmation
            </span>
            <p className="text-xs font-serif italic text-[#E5E5E5]">
              "{affirmation}"
            </p>
          </div>

          {/* Flow Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                const singleSpread: SpreadDefinition = {
                  id: 'card_of_the_day_reading',
                  title: 'Card of the Day Session',
                  subtitle: formattedDate,
                  description: `Reflection on today's card: ${card.name}`,
                  cardCount: 1,
                  positions: [{ name: 'Today’s Arcana', description: dailyPrompt }],
                  recommendedFor: 'Daily alignment'
                };
                onStartReflectionReading(singleSpread, todayData);
              }}
              className="px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-lg glow-gold"
            >
              <Feather className="w-4 h-4" />
              <span>Reflect in Full Reading Session</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('reflection');
                const el = document.getElementById('daily-journal-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-[#161618] border border-[#C5A059]/30 text-[#D4B97E] font-semibold text-xs uppercase tracking-wider hover:border-[#C5A059] transition-all flex items-center gap-1.5"
            >
              <PenTool className="w-3.5 h-3.5 text-[#C5A059]" />
              Write Daily Note
            </button>
          </div>

        </div>
      </div>

      {/* Tabs Navigation for Educational Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[#C5A059]/20 overflow-x-auto pb-2">
          {[
            { id: 'meanings', label: 'Traditional Meanings & Keywords', icon: BookOpen },
            { id: 'symbolism', label: 'Visual & Esoteric Symbolism', icon: Layers },
            { id: 'lore', label: 'Archetype Lore & Element', icon: Compass },
            { id: 'reflection', label: 'Daily Reflection & Journal', icon: PenTool }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#C5A059] text-black font-bold shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-[#C5A059]/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Traditional Meanings */}
        {activeTab === 'meanings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Upright Wisdom */}
            <div className="p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/20 space-y-4">
              <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
                <span className="font-serif text-base font-bold text-[#D4B97E] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Upright Traditional Wisdom
                </span>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Light Aspect</span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">
                  Upright Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {card.uprightKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">
                  Classical Interpretation:
                </span>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {card.uprightMeaning}
                </p>
              </div>
            </div>

            {/* Reversed Wisdom */}
            <div className="p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/20 space-y-4">
              <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
                <span className="font-serif text-base font-bold text-[#D4B97E] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Reversed Traditional Nuance
                </span>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Shadow Aspect</span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">
                  Reversed Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {card.reversedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">
                  Internalized / Shadow Interpretation:
                </span>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {card.reversedMeaning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Visual Symbolism */}
        {activeTab === 'symbolism' && (
          <div className="p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/30 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-[#C5A059]/20 pb-3">
              <Layers className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif text-lg font-bold text-[#D4B97E]">
                Visual Motifs & Esoteric Iconography
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {card.symbolism}
                </p>

                <div className="p-4 rounded-xl bg-[#161618] border border-[#C5A059]/20 space-y-2">
                  <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider font-bold block">
                    Elemental Correspondence
                  </span>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {elementalWisdom}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161618] border border-[#C5A059]/20 space-y-3 text-xs">
                <span className="text-[10px] font-mono text-[#D4B97E] uppercase tracking-wider font-bold block border-b border-[#C5A059]/20 pb-2">
                  Archetype Blueprint
                </span>
                <div className="space-y-2 text-gray-400">
                  <div>
                    <strong className="text-gray-200">Arcana Level:</strong>{' '}
                    <span className="capitalize">{card.arcana} Arcana</span>
                  </div>
                  <div>
                    <strong className="text-gray-200">Station / Number:</strong> #{card.number}
                  </div>
                  <div>
                    <strong className="text-gray-200">Suit Governance:</strong>{' '}
                    <span className="capitalize">{card.suit}</span>
                  </div>
                  <div>
                    <strong className="text-gray-200">Archetypal Title:</strong> {card.archetype || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Archetype Lore */}
        {activeTab === 'lore' && (
          <div className="p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/30 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-[#C5A059]/20 pb-3">
              <Compass className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif text-lg font-bold text-[#D4B97E]">
                Traditional Lore & Classical History
              </h3>
            </div>

            <div className="space-y-4 text-xs text-gray-300 leading-relaxed font-light">
              <p>{esotericLore}</p>
              <p>
                In meditative tarot study, reflecting on the daily arcana helps align personal awareness with universal human archetypes. Whether navigating triumphs, quiet contemplation, or unexpected shifts, the card acts as a mirror rather than a fortune-telling tool.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Daily Reflection & Journaling */}
        {activeTab === 'reflection' && (
          <div id="daily-journal-section" className="p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/30 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif text-lg font-bold text-[#D4B97E]">
                  Daily Guided Journal Scratchpad
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gray-500 uppercase">
                Private & Encrypted in Firestore
              </span>
            </div>

            {/* Guided Prompt Box */}
            <div className="p-4 rounded-xl bg-[#161618] border border-[#C5A059]/30 space-y-2">
              <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest font-bold block">
                Today's Inquiry Question:
              </span>
              <p className="font-serif text-sm font-semibold text-[#E5E5E5] leading-relaxed">
                "{dailyPrompt}"
              </p>
            </div>

            {/* Input Form */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-mono text-gray-400 tracking-wider block">
                Write your thoughts on today's card & question:
              </label>
              <textarea
                rows={4}
                value={userJournalInput}
                onChange={(e) => setUserJournalInput(e.target.value)}
                placeholder="What feelings, insights, or current situations arise as you look at this card today?..."
                className="w-full px-4 py-3 rounded-xl bg-[#161618] border border-[#C5A059]/20 text-gray-200 text-xs focus:outline-none focus:border-[#C5A059] transition-all resize-none"
              />

              <div className="flex items-center justify-between pt-2">
                {journalSavedSuccess ? (
                  <span className="text-xs text-green-400 flex items-center gap-1.5 font-mono">
                    <Check className="w-4 h-4" />
                    Saved to your private Tarot Journal!
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-500 font-mono">
                    {userProfile ? 'Saves to your Firestore account' : 'Sign in to save entries permanently'}
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleSaveDailyReflection}
                  disabled={!userJournalInput.trim() || isSavingJournal}
                  className="px-5 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-md glow-gold disabled:opacity-40"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  {isSavingJournal ? 'Saving Entry...' : 'Save Entry to Journal'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
