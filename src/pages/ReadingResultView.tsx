import React, { useState } from 'react';
import { CardInSpread, SpreadDefinition, TarotReading, UserProfile } from '../types';
import { SpreadLayout } from '../components/SpreadLayout';
import { saveReading, addReadingNote, toggleFavoriteReading, User } from '../lib/firebase';
import { ShareOptions, shareContent } from '../lib/share';
import { Sparkles, Bookmark, Heart, Share2, Check, BookOpen, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

interface ReadingResultViewProps {
  user: User | null;
  userProfile?: UserProfile | null;
  spread: SpreadDefinition;
  question: string;
  cardsInSpread: CardInSpread[];
  interpretationText: string;
  mood: string;
  tags: string[];
  notes: string;
  onNavigateTab: (tab: string) => void;
  onOpenDisclaimer: () => void;
  onOpenShare?: (options: ShareOptions) => void;
}

export const ReadingResultView: React.FC<ReadingResultViewProps> = ({
  user,
  userProfile,
  spread,
  question,
  cardsInSpread,
  interpretationText,
  mood,
  tags,
  notes,
  onNavigateTab,
  onOpenDisclaimer,
  onOpenShare
}) => {
  const [savedReadingId, setSavedReadingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [journalNote, setJournalNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto save reading to Firestore if user exists
  const handleSaveToJournal = async () => {
    if (!user) {
      alert('Please sign in or continue as guest to save readings.');
      return;
    }
    if (savedReadingId) return;

    try {
      setIsSaving(true);
      const savedCards = cardsInSpread.map(item => ({
        name: item.card.name,
        number: item.card.number,
        suit: item.card.suit,
        position: item.positionName,
        positionDescription: item.positionDescription,
        orientation: item.orientation,
        meaning: item.orientation === 'upright' ? item.card.uprightMeaning : item.card.reversedMeaning,
        keywords: item.orientation === 'upright' ? item.card.uprightKeywords : item.card.reversedKeywords,
        symbolism: item.card.symbolism
      }));

      const readingData: Omit<TarotReading, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        question: question || 'General check-in & symbolic reflection',
        spreadType: spread.id,
        spreadTitle: spread.title,
        cards: savedCards,
        aiInterpretation: interpretationText,
        reflectionQuestions: [],
        journalingPrompt: '',
        mood,
        tags,
        isFavorite
      };

      const id = await saveReading(user.uid, readingData);
      setSavedReadingId(id);

      // If note was typed, save note too
      if (journalNote.trim()) {
        await addReadingNote(user.uid, id, journalNote.trim());
        setNoteSaved(true);
      }
    } catch (err) {
      console.error('Error saving reading:', err);
      alert('Could not save reading. Please check network.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFav = async () => {
    const nextFav = !isFavorite;
    setIsFavorite(nextFav);
    if (user && savedReadingId) {
      await toggleFavoriteReading(user.uid, savedReadingId, nextFav);
    }
  };

  const handleSaveNote = async () => {
    if (!user || !savedReadingId || !journalNote.trim()) return;
    try {
      await addReadingNote(user.uid, savedReadingId, journalNote.trim());
      setNoteSaved(true);
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const handleShareReading = () => {
    const cardNames = cardsInSpread.map(c => `${c.positionName}: ${c.card.name} (${c.orientation})`).join('\n');
    const shareOpts: ShareOptions = {
      title: `Tarot Depth Reading: "${question || spread.title}"`,
      text: `Spread: ${spread.title}\n\nCards Drawn:\n${cardNames}\n\nKey Insights:\n${interpretationText.slice(0, 300)}...`,
      category: 'reading'
    };

    if (onOpenShare) {
      onOpenShare(shareOpts);
    } else {
      shareContent(shareOpts);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold-subtle pb-6">
        <div>
          <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest block">
            {spread.title} • {cardsInSpread.length} Cards
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f3e5ab] mt-1">
            "{question || 'General Reflection Session'}"
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite Toggle */}
          <button
            onClick={handleToggleFav}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs ${
              isFavorite
                ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                : 'bg-[#12141d] border-gold-subtle text-gray-400 hover:text-white'
            }`}
            title="Favorite this reading"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          {/* Share Reading */}
          <button
            onClick={handleShareReading}
            className="p-2.5 rounded-xl bg-[#12141d] border border-gold-subtle text-xs text-gray-300 hover:text-[#d4af37] hover:border-[#d4af37] transition-all flex items-center gap-1.5 cursor-pointer"
            title="Share reading"
          >
            <Share2 className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden sm:inline">Share Reading</span>
          </button>

          {/* Save to Journal CTA */}
          <button
            onClick={handleSaveToJournal}
            disabled={!!savedReadingId || isSaving}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              savedReadingId
                ? 'bg-emerald-900/30 border border-emerald-500/50 text-emerald-300'
                : 'bg-gold-gradient text-black hover:brightness-110 shadow-lg glow-gold'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {savedReadingId ? 'Saved to Journal' : isSaving ? 'Saving...' : 'Save to Journal'}
          </button>
        </div>
      </div>

      {/* Drawn Cards Display */}
      <section className="bg-[#12141d]/50 p-6 rounded-2xl border border-gold-subtle">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#d4af37] text-center mb-4">
          Spread Arrangement
        </h3>
        <SpreadLayout
          spreadId={spread.id}
          cardsInSpread={cardsInSpread}
          flippedIndices={new Array(cardsInSpread.length).fill(true)}
          cardSize="sm"
          deckStyle={userProfile?.defaultDeck || 'classic_gold'}
        />
      </section>

      {/* AI Interpretation Section */}
      <section className="bg-[#12141d] p-6 sm:p-10 rounded-3xl border border-gold-glow shadow-2xl space-y-8">
        <div className="flex items-center justify-between border-b border-gold-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-[#f3e5ab]">
                Gemini Symbolic Interpretation
              </h2>
              <span className="text-[10px] font-mono uppercase text-[#d4af37]/80">
                Non-predictive • Reflective Mirror
              </span>
            </div>
          </div>

          <button
            onClick={onOpenDisclaimer}
            className="text-[11px] text-gray-400 hover:text-[#d4af37] flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            Entertainment Notice
          </button>
        </div>

        {/* Structured Reading Markdown Display */}
        <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-sm space-y-6">
          {interpretationText.split('### ').map((section, idx) => {
            if (!section.trim()) return null;
            const lines = section.trim().split('\n');
            const title = lines[0];
            const content = lines.slice(1).join('\n');

            return (
              <div key={idx} className="p-5 rounded-2xl bg-[#0b0c10]/70 border border-gold-subtle space-y-3">
                <h3 className="font-serif-luxury text-lg font-bold text-[#f3e5ab] flex items-center gap-2 border-b border-gold-subtle/40 pb-2">
                  <span className="text-[#d4af37]">◆</span>
                  {title}
                </h3>
                <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed font-light">
                  {content}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Immediate Private Journaling Note Section */}
      <section className="bg-[#12141d] p-6 sm:p-8 rounded-2xl border border-gold-subtle space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#d4af37]" />
          <h3 className="font-serif-luxury text-lg font-bold text-[#f3e5ab]">
            Your Private Reflection Note
          </h3>
        </div>
        <p className="text-xs text-gray-400">
          What emotions, memories, or epiphanies arose as you read this interpretation? Record your thoughts here.
        </p>

        <textarea
          rows={4}
          value={journalNote}
          onChange={(e) => setJournalNote(e.target.value)}
          placeholder="Write your private journal reflection..."
          className="w-full p-4 rounded-xl bg-[#0b0c10] border border-gold-subtle text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#d4af37] resize-none"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-gray-500 italic">
            {noteSaved ? '✓ Reflection saved to journal entry' : 'Notes remain private in your profile storage.'}
          </span>
          <button
            onClick={savedReadingId ? handleSaveNote : handleSaveToJournal}
            className="px-5 py-2 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/50 text-xs font-bold text-[#f3e5ab] hover:bg-[#d4af37]/30 transition-all"
          >
            {noteSaved ? 'Update Reflection Note' : 'Save Reflection Note'}
          </button>
        </div>
      </section>

      {/* Bottom Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gold-subtle">
        <button
          onClick={() => onNavigateTab('journal')}
          className="text-xs text-gray-300 hover:text-white flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4 text-[#d4af37]" />
          Go to Journal History
        </button>

        <button
          onClick={() => onNavigateTab('spreads')}
          className="px-6 py-3 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg glow-gold flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Begin Another Reading
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
