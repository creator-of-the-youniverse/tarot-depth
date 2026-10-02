import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TarotCard, CardOrientation } from '../types';
import { ambientSound } from '../lib/ambientSound';
import { Sparkles, Eye, Shield, Feather, Flame, Droplets, Compass, Sun, Moon, RotateCw } from 'lucide-react';

interface TarotCardViewProps {
  card: TarotCard;
  positionName?: string;
  positionDescription?: string;
  orientation?: CardOrientation;
  isFlipped?: boolean;
  onFlip?: () => void;
  onToggleOrientation?: () => void;
  size?: 'sm' | 'md' | 'lg';
  deckStyle?: string;
}

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  card,
  positionName,
  positionDescription,
  orientation = 'upright',
  isFlipped = true,
  onFlip,
  onToggleOrientation,
  size = 'md',
  deckStyle = 'classic_gold'
}) => {
  const [showModal, setShowModal] = useState(false);

  // Size styling maps
  const sizeClasses = {
    sm: 'w-32 h-52 text-xs',
    md: 'w-44 h-72 text-sm',
    lg: 'w-56 h-96 text-base'
  };

  const getSuitIcon = (suit: string) => {
    switch (suit) {
      case 'cups':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'wands':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'swords':
        return <Feather className="w-4 h-4 text-cyan-300" />;
      case 'pentacles':
        return <Shield className="w-4 h-4 text-[#d4af37]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  const keywords = orientation === 'upright' ? card.uprightKeywords : card.reversedKeywords;
  const meaning = orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning;

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Position Label above Card */}
        {positionName && (
          <div className="mb-2 text-center max-w-[200px]">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] block">
              {positionName}
            </span>
            {positionDescription && (
              <span className="text-[11px] text-gray-400 block line-clamp-1">
                {positionDescription}
              </span>
            )}
          </div>
        )}

        {/* Card Motion Container */}
        <div
          onClick={() => {
            if (!isFlipped && onFlip) {
              if (ambientSound.getIsPlaying()) {
                ambientSound.triggerChime();
              }
              onFlip();
            } else {
              setShowModal(true);
            }
          }}
          className={`cursor-pointer perspective-1000 ${sizeClasses[size]} relative group rounded-xl transition-transform hover:scale-105`}
        >
          <motion.div
            initial={false}
            animate={{ rotateY: isFlipped ? 0 : 180 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="w-full h-full relative preserve-3d rounded-xl shadow-2xl"
          >
            {/* FRONT OF CARD (Revealed) */}
            <div
              className={`absolute inset-0 w-full h-full backface-hidden rounded-xl p-3 flex flex-col justify-between overflow-hidden shadow-2xl ${
                deckStyle === 'cosmic_night'
                  ? 'bg-gradient-to-b from-[#0A0D1F] via-[#101430] to-[#070918] border-2 border-purple-400/50 text-purple-100'
                  : deckStyle === 'minimal_artisan'
                  ? 'bg-[#141416] border-2 border-[#D4B97E]/50 text-gray-200'
                  : 'bg-[#171a26] border-2 border-[#d4af37]/60 text-gray-100 glow-gold'
              }`}
            >
              {/* Outer Golden Line Inset Frame */}
              <div
                className={`absolute inset-1 border rounded-lg pointer-events-none ${
                  deckStyle === 'cosmic_night'
                    ? 'border-purple-300/30'
                    : deckStyle === 'minimal_artisan'
                    ? 'border-[#D4B97E]/30'
                    : 'border-[#d4af37]/30'
                }`}
              />

              {/* Top Header: Number & Suit Badge */}
              <div className="flex items-center justify-between z-10">
                <span className="font-mono font-bold text-xs text-[#d4af37]">
                  {card.arcana === 'major' ? `ARC ${card.number}` : `#${card.number}`}
                </span>
                <div className="flex items-center gap-1 bg-[#0b0c10]/80 px-2 py-0.5 rounded-full border border-[#d4af37]/40 text-[10px] text-[#f3e5ab]">
                  {getSuitIcon(card.suit)}
                  <span className="capitalize">{card.suit}</span>
                </div>
              </div>

              {/* Central Artwork Graphic */}
              <div
                className={`my-auto py-2 flex flex-col items-center justify-center relative rounded-lg bg-[#0b0c10]/70 border border-[#d4af37]/20 ${
                  orientation === 'reversed' ? 'rotate-180' : ''
                }`}
              >
                {/* Celestial background graphic */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4af37]/10 to-[#8b5cf6]/20 flex items-center justify-center border border-[#d4af37]/40 my-2 relative shadow-inner">
                  {card.arcana === 'major' ? (
                    <Sun className="w-8 h-8 text-[#d4af37] animate-pulse" />
                  ) : (
                    <Compass className="w-8 h-8 text-[#f3e5ab]" />
                  )}
                  <Moon className="w-4 h-4 text-purple-300 absolute -top-1 -right-1" />
                </div>

                <span className="font-serif-luxury font-semibold text-center text-[#f3e5ab] text-sm px-1 line-clamp-1">
                  {card.name}
                </span>

                <span className="text-[10px] text-gray-400 italic px-2 text-center line-clamp-1 mt-0.5">
                  {card.archetype || card.element || card.suit}
                </span>
              </div>

              {/* Bottom Footer: Upright/Reversed Badge & Key Keywords */}
              <div className="z-10 flex flex-col items-center gap-1 text-center">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${
                    orientation === 'upright'
                      ? 'bg-[#d4af37]/20 border-[#d4af37]/50 text-[#f3e5ab]'
                      : 'bg-purple-900/40 border-purple-500/50 text-purple-200'
                  }`}
                >
                  {orientation === 'upright' ? 'Upright' : 'Reversed'}
                </span>
                <span className="text-[10px] text-gray-300 line-clamp-1 font-mono">
                  {keywords.slice(0, 2).join(' • ')}
                </span>
              </div>
            </div>

            {/* BACK OF CARD (Face Down - Artistic Deck Backs) */}
            <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl rotate-y-180 overflow-hidden shadow-2xl">
              {deckStyle === 'cosmic_night' ? (
                /* Cosmic Velvet Starlight Back */
                <div className="w-full h-full bg-gradient-to-br from-[#060814] via-[#0E1029] to-[#040510] border-2 border-purple-400/50 p-2.5 flex flex-col items-center justify-center relative">
                  <div className="absolute inset-1.5 border border-purple-300/30 rounded-lg pointer-events-none" />
                  <div className="w-full h-full border border-indigo-500/20 rounded-md p-2 flex flex-col items-center justify-between relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent">
                    <div className="w-full flex items-center justify-between px-1 text-purple-300/60 text-[9px] font-mono">
                      <span>✦</span>
                      <span className="tracking-widest">COSMIC</span>
                      <span>✦</span>
                    </div>

                    <div className="w-20 h-20 rounded-full border border-purple-400/60 flex items-center justify-center relative shadow-[0_0_20px_rgba(139,92,246,0.35)] bg-[#0B0D20]/90">
                      <div className="absolute inset-1 rounded-full border border-dashed border-purple-300/40" />
                      <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-purple-600/30 to-indigo-400/30 flex items-center justify-center border border-purple-300/60 relative">
                        <Sparkles className="w-7 h-7 text-purple-200 animate-pulse" />
                        <Moon className="w-3.5 h-3.5 text-indigo-300 absolute -top-1 -right-1" />
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-between px-1 text-purple-300/60 text-[9px] font-mono">
                      <span>✦</span>
                      <span className="tracking-widest">ARCANA</span>
                      <span>✦</span>
                    </div>
                  </div>
                </div>
              ) : deckStyle === 'minimal_artisan' ? (
                /* Minimal Artisan Gold & Charcoal Back */
                <div className="w-full h-full bg-[#121214] border-2 border-[#D4B97E]/60 p-2.5 flex flex-col items-center justify-center relative">
                  <div className="absolute inset-1.5 border border-[#D4B97E]/30 rounded-lg pointer-events-none" />
                  <div className="w-full h-full border border-[#D4B97E]/20 rounded-md p-3 flex flex-col items-center justify-between relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4B97E]/10 via-transparent to-transparent">
                    <div className="text-[9px] font-mono tracking-[0.3em] text-[#D4B97E]/80 uppercase font-semibold">
                      SANCTUARY
                    </div>

                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 border border-[#D4B97E]/40 rotate-45 rounded-sm" />
                      <div className="absolute inset-2 border border-[#D4B97E]/60 rotate-45 rounded-sm" />
                      <Compass className="w-7 h-7 text-[#D4B97E]" />
                    </div>

                    <div className="text-[9px] font-mono tracking-[0.3em] text-[#D4B97E]/80 uppercase font-semibold">
                      TAROT DEPTH
                    </div>
                  </div>
                </div>
              ) : (
                /* Classic Gold Sacred Geometry Back (Default) */
                <div className="w-full h-full bg-[#0A0A0C] border-2 border-[#C5A059]/80 p-2.5 flex flex-col items-center justify-center relative shadow-2xl">
                  <div className="absolute inset-1.5 border-2 border-[#C5A059]/40 rounded-lg pointer-events-none" />
                  <div className="absolute inset-2.5 border border-[#C5A059]/20 rounded-md pointer-events-none" />

                  <span className="absolute top-3 left-3 text-[10px] text-[#C5A059]/80">✦</span>
                  <span className="absolute top-3 right-3 text-[10px] text-[#C5A059]/80">✦</span>
                  <span className="absolute bottom-3 left-3 text-[10px] text-[#C5A059]/80">✦</span>
                  <span className="absolute bottom-3 right-3 text-[10px] text-[#C5A059]/80">✦</span>

                  <div className="w-full h-full rounded-md p-2 flex flex-col items-center justify-between relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C5A059]/20 via-transparent to-transparent">
                    <span className="font-serif-luxury text-[9px] tracking-[0.25em] text-[#C5A059] uppercase font-bold pt-1">
                      TAROT DEPTH
                    </span>

                    <div className="w-20 h-20 rounded-full border-2 border-[#C5A059]/80 flex items-center justify-center relative shadow-[0_0_25px_rgba(197,160,89,0.3)] bg-[#0A0A0C]/90">
                      <div className="absolute inset-1 rounded-full border border-dashed border-[#C5A059]/50" />
                      <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#C5A059]/35 via-[#D4B97E]/25 to-[#9E7B3B]/35 flex items-center justify-center border border-[#C5A059] relative">
                        <Sun className="w-7 h-7 text-[#D4B97E] animate-pulse" />
                        <Moon className="w-3.5 h-3.5 text-[#C5A059] absolute -bottom-0.5 -right-0.5" />
                      </div>
                    </div>

                    <span className="font-serif-luxury text-[9px] tracking-[0.25em] text-[#C5A059] uppercase font-bold pb-1">
                      SANCTUARY
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Rotate Action Button if enabled */}
        {onToggleOrientation && isFlipped && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleOrientation();
            }}
            className="mt-2 text-[10px] font-mono px-2 py-1 rounded-md bg-[#12141d] border border-[#d4af37]/30 text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-1 transition-all"
            title="Rotate card orientation (Upright ↔ Reversed)"
          >
            <RotateCw className="w-3 h-3 text-[#d4af37]" />
            <span>Rotate ({orientation === 'upright' ? 'Upright' : 'Reversed'})</span>
          </button>
        )}
      </div>

      {/* CARD DETAIL MODAL INSPECTION */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-tarot-card-bg border border-gold-glow rounded-2xl max-w-lg w-full p-5 sm:p-6 relative text-gray-200 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3.5 right-3.5 text-gray-400 hover:text-white p-2 text-lg font-bold min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/5 active:bg-white/15 transition-all cursor-pointer"
              aria-label="Close card details"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase text-[#d4af37] px-2 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
                {card.arcana} arcana
              </span>
              <span className="text-xs text-gray-400">
                {orientation === 'upright' ? '✨ Upright Position' : '🔄 Reversed Position'}
              </span>
            </div>

            <h3 className="font-serif-luxury text-2xl font-bold text-[#f3e5ab] mb-1">
              {card.name}
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
              {positionName ? (
                <p className="text-xs text-[#d4af37]">
                  Position: <span className="text-white font-medium">{positionName}</span>
                </p>
              ) : <div />}

              {onToggleOrientation && (
                <button
                  type="button"
                  onClick={() => onToggleOrientation()}
                  className="px-3 py-1.5 rounded-lg bg-[#161618] border border-[#C5A059]/40 text-xs font-mono text-[#D4B97E] hover:border-[#C5A059] hover:bg-[#C5A059]/10 transition-all flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Rotate ({orientation === 'upright' ? 'Switch to Reversed' : 'Switch to Upright'})</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#0b0c10] border border-gold-subtle mb-4 space-y-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-gray-400 block mb-1">
                  Active Meaning ({orientation})
                </span>
                <p className="text-sm text-gray-200 leading-relaxed">{meaning}</p>
              </div>

              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-gray-400 block mb-1">
                  Symbolic Imagery
                </span>
                <p className="text-xs text-gray-300 italic">{card.symbolism}</p>
              </div>

              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-gray-400 block mb-1">
                  Keywords
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-[#1e2230] text-[#f3e5ab] border border-gold-subtle"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-lg bg-gold-gradient text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition-all"
            >
              Return to Reading
            </button>
          </div>
        </div>
      )}
    </>
  );
};
