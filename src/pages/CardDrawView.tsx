import React, { useState, useEffect } from 'react';
import { SpreadDefinition, CardInSpread, TarotCard, CardOrientation, UserProfile } from '../types';
import { getRandomCards } from '../data/tarotDeck';
import { SpreadLayout } from '../components/SpreadLayout';
import { TarotShuffleAnimation } from '../components/TarotShuffleAnimation';
import { Sparkles, Shuffle, Eye, ArrowLeft, Loader2, RotateCw } from 'lucide-react';

interface CardDrawViewProps {
  spread: SpreadDefinition;
  question: string;
  mood: string;
  tags: string[];
  notes: string;
  userProfile?: UserProfile | null;
  onBack: () => void;
  onCompleteDraw: (data: {
    cards: CardInSpread[];
    interpretationText: string;
  }) => void;
}

export const CardDrawView: React.FC<CardDrawViewProps> = ({
  spread,
  question,
  mood,
  tags,
  notes,
  userProfile,
  onBack,
  onCompleteDraw
}) => {
  const [cardsInSpread, setCardsInSpread] = useState<CardInSpread[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<boolean[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(true);
  const [isInterpreting, setIsInterpreting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial Draw on Mount
  useEffect(() => {
    drawFreshSpread();
  }, [spread]);

  const drawFreshSpread = () => {
    setIsShuffling(true);
    setFlippedIndices(new Array(spread.cardCount).fill(false));
  };

  const handleShuffleComplete = () => {
    const drawn = getRandomCards(spread.cardCount);
    const mapped: CardInSpread[] = drawn.map((d, index) => {
      const pos = spread.positions[index] || {
        name: `Position ${index + 1}`,
        description: 'Reflective focus'
      };
      return {
        card: d.card,
        positionName: pos.name,
        positionDescription: pos.description,
        orientation: d.orientation
      };
    });

    setCardsInSpread(mapped);
    setIsShuffling(false);
  };

  const handleFlipCard = (index: number) => {
    const next = [...flippedIndices];
    next[index] = true;
    setFlippedIndices(next);
  };

  const handleRevealAll = () => {
    setFlippedIndices(new Array(spread.cardCount).fill(true));
  };

  const handleToggleCardOrientation = (index: number) => {
    setCardsInSpread((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          orientation: next[index].orientation === 'upright' ? 'reversed' : 'upright'
        };
      }
      return next;
    });
  };

  const handleInvertAllOrientations = () => {
    setCardsInSpread((prev) =>
      prev.map((c) => ({
        ...c,
        orientation: c.orientation === 'upright' ? 'reversed' : 'upright'
      }))
    );
  };

  const allFlipped = flippedIndices.length > 0 && flippedIndices.every((f) => f);

  // Trigger Gemini API Server-Side Interpretation
  const handleGenerateInterpretation = async () => {
    try {
      setIsInterpreting(true);
      setErrorMessage(null);

      // Auto-reveal all cards if not already flipped
      if (!allFlipped) {
        handleRevealAll();
      }

      const formattedCardsForApi = cardsInSpread.map((item) => ({
        name: item.card.name,
        positionName: item.positionName,
        positionDescription: item.positionDescription,
        orientation: item.orientation,
        keywords: item.orientation === 'upright' ? item.card.uprightKeywords : item.card.reversedKeywords,
        symbolism: item.card.symbolism
      }));

      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          spreadTitle: spread.title,
          spreadType: spread.id,
          cards: formattedCardsForApi,
          mood,
          notes
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server error generating interpretation');
      }

      const data = await res.json();
      onCompleteDraw({
        cards: cardsInSpread,
        interpretationText: data.interpretation
      });
    } catch (err: any) {
      console.error('Interpretation request error:', err);
      setErrorMessage(err.message || 'Failed to connect to AI server. Please try again.');
    } finally {
      setIsInterpreting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold-subtle pb-4">
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Modify Intent
        </button>

        <div className="text-center">
          <h1 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#f3e5ab]">
            {spread.title}
          </h1>
          <p className="text-xs text-gray-400 italic">
            "{question || 'General Self Reflection'}"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={drawFreshSpread}
            disabled={isShuffling || isInterpreting}
            className="px-3 py-1.5 rounded-lg bg-[#12141d] border border-gold-subtle text-xs text-[#f3e5ab] hover:border-[#d4af37] transition-all flex items-center gap-1.5"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>Re-shuffle</span>
          </button>

          <button
            onClick={handleInvertAllOrientations}
            disabled={isShuffling || isInterpreting}
            className="px-3 py-1.5 rounded-lg bg-[#12141d] border border-gold-subtle text-xs text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all flex items-center gap-1.5"
            title="Invert all card orientations in spread (Upright ↔ Reversed)"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Invert Orientations</span>
          </button>

          {!allFlipped && (
            <button
              onClick={handleRevealAll}
              className="px-3 py-1.5 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-xs text-[#f3e5ab] hover:bg-[#d4af37]/30 transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal All</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Spread Stage */}
      {isShuffling ? (
        <TarotShuffleAnimation
          spreadTitle={spread.title}
          cardCount={spread.cardCount}
          deckStyle={userProfile?.defaultDeck || 'classic_gold'}
          onComplete={handleShuffleComplete}
        />
      ) : (
        <SpreadLayout
          spreadId={spread.id}
          cardsInSpread={cardsInSpread}
          flippedIndices={flippedIndices}
          onFlipCard={handleFlipCard}
          onToggleOrientation={handleToggleCardOrientation}
          deckStyle={userProfile?.defaultDeck || 'classic_gold'}
        />
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-xs text-center">
          {errorMessage}
        </div>
      )}

      {/* Bottom CTA to Trigger AI Interpretation */}
      <div className="max-w-md mx-auto pt-4 text-center space-y-3">
        <p className="text-xs text-gray-400">
          {!allFlipped
            ? 'Click individual cards to flip them, or click below to generate full AI interpretation.'
            : 'Cards revealed. Ready to weave the symbolic interpretation.'}
        </p>

        <button
          onClick={handleGenerateInterpretation}
          disabled={isInterpreting || isShuffling}
          className={`w-full py-4 rounded-2xl bg-gold-gradient text-black font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-2xl glow-gold flex items-center justify-center gap-2 ${
            isInterpreting ? 'opacity-70 cursor-wait' : 'hover:brightness-110'
          }`}
        >
          {isInterpreting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Synthesizing Symbolic Guidance with Gemini...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Deep AI Interpretation
            </>
          )}
        </button>
      </div>
    </div>
  );
};
