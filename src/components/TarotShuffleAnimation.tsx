import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shuffle, Compass, Eye, Volume2, VolumeX, FastForward, Play, CheckCircle2 } from 'lucide-react';
import { ambientSound } from '../lib/ambientSound';

interface TarotShuffleAnimationProps {
  onComplete?: () => void;
  deckStyle?: string;
  spreadTitle?: string;
  cardCount?: number;
  autoStart?: boolean;
}

type ShuffleStage = 'gathering' | 'riffle' | 'cut' | 'fanning' | 'ready';

export const TarotShuffleAnimation: React.FC<TarotShuffleAnimationProps> = ({
  onComplete,
  deckStyle = 'classic_gold',
  spreadTitle = 'Sacred Spread',
  cardCount = 3,
  autoStart = true
}) => {
  const [stage, setStage] = useState<ShuffleStage>('gathering');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userHasCut, setUserHasCut] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synthetic Card Rustle & Chime sound FX generator
  const playCardRustle = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const bufferSize = ctx.sampleRate * (intensity === 'heavy' ? 0.35 : intensity === 'medium' ? 0.25 : 0.15);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Generate soft filtered white noise burst for card sliding texture
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200 + Math.random() * 800, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (intensity === 'heavy' ? 0.3 : 0.2));

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch (e) {
      // Audio fallback
    }
  };

  const playGoldChime = () => {
    if (!soundEnabled) return;
    try {
      if (ambientSound.getIsPlaying()) {
        ambientSound.triggerChime();
      } else {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(864, ctx.currentTime); // 864Hz High Gold Pitch
        osc.frequency.exponentialRampToValueAtTime(432, ctx.currentTime + 1.2);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }
    } catch (e) {
      // ignore
    }
  };

  // Progression timeline logic
  useEffect(() => {
    if (!autoStart) return;

    // Stage 1: Gathering -> Riffle (after 1000ms)
    const timer1 = setTimeout(() => {
      setStage('riffle');
      playCardRustle('heavy');
      setProgress(25);
    }, 1100);

    // Stage 2: Riffle -> Cut (after 2800ms)
    const timer2 = setTimeout(() => {
      setStage('cut');
      playCardRustle('medium');
      setProgress(55);
    }, 3100);

    // Stage 3: Cut -> Fanning (after 5200ms)
    const timer3 = setTimeout(() => {
      setStage('fanning');
      playCardRustle('light');
      playGoldChime();
      setProgress(85);
    }, 5500);

    // Stage 4: Fanning -> Ready & Complete (after 7500ms)
    const timer4 = setTimeout(() => {
      setStage('ready');
      setProgress(100);
      playGoldChime();
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 700);
    }, 7800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [autoStart]);

  const handleManualCut = () => {
    setUserHasCut(true);
    playCardRustle('heavy');
    playGoldChime();
    if (stage === 'cut') {
      setStage('fanning');
      setProgress(85);
    }
  };

  const handleSkip = () => {
    playGoldChime();
    setStage('ready');
    setProgress(100);
    if (onComplete) onComplete();
  };

  // Render deck card back based on selected theme
  const renderCardBack = (key: string | number, isExtraGlow = false) => {
    if (deckStyle === 'cosmic_night') {
      return (
        <div
          key={key}
          className={`w-32 h-52 sm:w-36 sm:h-56 rounded-xl bg-gradient-to-br from-[#060814] via-[#0E1029] to-[#040510] border-2 border-purple-400/60 p-2 shadow-2xl flex flex-col items-center justify-between relative overflow-hidden select-none ${
            isExtraGlow ? 'shadow-[0_0_30px_rgba(168,85,247,0.5)]' : ''
          }`}
        >
          <div className="absolute inset-1 border border-purple-300/30 rounded-lg pointer-events-none" />
          <div className="w-full flex items-center justify-between text-[8px] text-purple-300/70 font-mono">
            <span>✦</span>
            <span>COSMIC</span>
            <span>✦</span>
          </div>
          <div className="w-12 h-12 rounded-full border border-purple-400/50 bg-[#0B0D20] flex items-center justify-center relative">
            <Sparkles className="w-6 h-6 text-purple-200 animate-pulse" />
          </div>
          <div className="w-full flex items-center justify-between text-[8px] text-purple-300/70 font-mono">
            <span>✦</span>
            <span>ARCANA</span>
            <span>✦</span>
          </div>
        </div>
      );
    }

    if (deckStyle === 'minimal_artisan') {
      return (
        <div
          key={key}
          className={`w-32 h-52 sm:w-36 sm:h-56 rounded-xl bg-[#121214] border-2 border-[#D4B97E]/70 p-2 shadow-2xl flex flex-col items-center justify-between relative overflow-hidden select-none ${
            isExtraGlow ? 'shadow-[0_0_30px_rgba(212,185,126,0.4)]' : ''
          }`}
        >
          <div className="absolute inset-1 border border-[#D4B97E]/30 rounded-lg pointer-events-none" />
          <span className="text-[8px] font-mono tracking-widest text-[#D4B97E]">SANCTUARY</span>
          <div className="w-10 h-10 border border-[#D4B97E]/50 rotate-45 flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#D4B97E] -rotate-45" />
          </div>
          <span className="text-[8px] font-mono tracking-widest text-[#D4B97E]">TAROT</span>
        </div>
      );
    }

    // Default: Classic Gold Sacred Geometry Back
    return (
      <div
        key={key}
        className={`w-32 h-52 sm:w-36 sm:h-56 rounded-xl bg-[#0A0A0C] border-2 border-[#C5A059]/90 p-2.5 shadow-2xl flex flex-col items-center justify-between relative overflow-hidden select-none ${
          isExtraGlow ? 'shadow-[0_0_35px_rgba(197,160,89,0.6)]' : ''
        }`}
      >
        <div className="absolute inset-1 border-2 border-[#C5A059]/40 rounded-lg pointer-events-none" />
        <div className="absolute inset-2 border border-[#C5A059]/20 rounded-md pointer-events-none" />
        <div className="w-full flex justify-between items-center text-[9px] font-mono text-[#D4B97E]">
          <span>✧</span>
          <span className="tracking-widest uppercase text-[8px]">Sacred</span>
          <span>✧</span>
        </div>
        <div className="w-12 h-12 rounded-full border border-[#C5A059] flex items-center justify-center bg-[#111218] relative shadow-[0_0_15px_rgba(197,160,89,0.3)]">
          <div className="absolute inset-1 border border-dashed border-[#C5A059]/40 rounded-full" />
          <Sparkles className="w-6 h-6 text-[#f3e5ab] animate-pulse" />
        </div>
        <div className="w-full flex justify-between items-center text-[9px] font-mono text-[#D4B97E]">
          <span>✧</span>
          <span className="tracking-widest uppercase text-[8px]">Arcana</span>
          <span>✧</span>
        </div>
      </div>
    );
  };

  const getStageTitle = () => {
    switch (stage) {
      case 'gathering':
        return 'Gathering the 78 Sacred Arcana...';
      case 'riffle':
        return 'Riffle-Shuffling Chance & Cosmic Currents...';
      case 'cut':
        return 'Cutting the Deck with Intention...';
      case 'fanning':
        return 'Attuning Arcana to your Energy...';
      case 'ready':
        return 'The Deck is Aligned. Revealing Cards...';
    }
  };

  const getStageSubtitle = () => {
    switch (stage) {
      case 'gathering':
        return 'Concentrate on your core question or emotional state.';
      case 'riffle':
        return 'Blending past, present, and subtle future trajectories.';
      case 'cut':
        return userHasCut ? 'Deck cut complete. Merging streams.' : 'Tap the deck stack below to physically cut the cards.';
      case 'fanning':
        return `Preparing ${cardCount} cards for ${spreadTitle}.`;
      case 'ready':
        return 'Sacred divination stage prepared.';
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[520px] flex flex-col items-center justify-between p-6 rounded-3xl bg-[#090A0E]/90 border border-[#C5A059]/30 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden my-4">
      {/* Mystical Background Radial Glow & Rotating Sacred Geometry Mandala */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full bg-radial from-[#C5A059]/15 via-[#8B5CF6]/5 to-transparent blur-3xl animate-pulse" />
        
        {/* Rotating Sacred Mandala SVG */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="w-[420px] h-[420px] text-[#C5A059]/15 absolute"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100 5 L100 195 M5 100 L195 100 M26 26 L174 174 M26 174 L174 26" stroke="currentColor" strokeWidth="0.3" />
          <polygon points="100,20 169,140 31,140" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <polygon points="100,180 31,60 169,60" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </motion.svg>
      </div>

      {/* Header Bar with Ritual Title & Quick Actions */}
      <div className="w-full flex items-center justify-between z-20 border-b border-[#C5A059]/20 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#f3e5ab]">
            <Shuffle className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4B97E] block">
              Sacred Ritual
            </span>
            <h3 className="font-serif-luxury text-sm font-semibold text-white">
              Deck Shuffle & Energy Attunement
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-[#12141D] border border-[#C5A059]/30 text-gray-300 hover:text-[#f3e5ab] hover:border-[#C5A059] transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Shuffle Sounds' : 'Enable Shuffle Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D4B97E]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="px-3 py-1.5 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 text-xs font-mono font-medium text-[#f3e5ab] hover:bg-[#C5A059]/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip Ritual</span>
          </button>
        </div>
      </div>

      {/* Main 3D Shuffling Arena Stage */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-6 relative min-h-[280px] z-10 perspective-1000">
        <AnimatePresence mode="wait">
          {/* STAGE 1: GATHERING (Stack of cards levitating up and down) */}
          {stage === 'gathering' && (
            <motion.div
              key="stage-gathering"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center justify-center"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [i * -3, i * -3 - 12, i * -3],
                    rotateZ: [i * 1.5 - 3, i * -1, i * 1.5 - 3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.1
                  }}
                  className="absolute"
                  style={{
                    zIndex: i,
                    transform: `translateY(${i * -4}px) rotate(${i * 2 - 4}deg)`
                  }}
                >
                  {renderCardBack(`gather-${i}`, i === 4)}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* STAGE 2: RIFFLE SHUFFLE (Split Left & Right stacks interleaved in 3D arc) */}
          {stage === 'riffle' && (
            <motion.div
              key="stage-riffle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full max-w-md h-64 flex items-center justify-center"
            >
              {/* Left Stack */}
              <motion.div
                initial={{ x: 0, rotateZ: 0 }}
                animate={{
                  x: [-120, -110, -60, 0],
                  rotateZ: [-15, -12, -6, 0],
                  rotateY: [20, 15, 8, 0]
                }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                className="absolute"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ x: [0, -4, 0] }}
                    transition={{ duration: 0.3, repeat: 3, delay: i * 0.1 }}
                    className="absolute"
                    style={{ transform: `translateY(${i * -3}px)` }}
                  >
                    {renderCardBack(`left-${i}`)}
                  </motion.div>
                ))}
              </motion.div>

              {/* Right Stack */}
              <motion.div
                initial={{ x: 0, rotateZ: 0 }}
                animate={{
                  x: [120, 110, 60, 0],
                  rotateZ: [15, 12, 6, 0],
                  rotateY: [-20, -15, -8, 0]
                }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                className="absolute"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 0.3, repeat: 3, delay: i * 0.1 }}
                    className="absolute"
                    style={{ transform: `translateY(${i * -3}px)` }}
                  >
                    {renderCardBack(`right-${i}`)}
                  </motion.div>
                ))}
              </motion.div>

              {/* Interleaving Cascading Cards in Center */}
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <motion.div
                  key={`cascade-${idx}`}
                  initial={{ opacity: 0, y: -40, scale: 0.9 }}
                  animate={{
                    opacity: [0, 1, 1, 1],
                    y: [-40, (idx % 2 === 0 ? -1 : 1) * 10, idx * -2],
                    rotateZ: [(idx % 2 === 0 ? -10 : 10), 0]
                  }}
                  transition={{
                    duration: 1.8,
                    delay: 0.3 + idx * 0.2,
                    ease: 'easeOut'
                  }}
                  className="absolute z-20"
                >
                  {renderCardBack(`casc-${idx}`, idx === 5)}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* STAGE 3: THE SACRED CUT (3 Stacks split horizontally with interactive Cut deck touch) */}
          {stage === 'cut' && (
            <motion.div
              key="stage-cut"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleManualCut}
              className="relative w-full max-w-lg h-64 flex items-center justify-center cursor-pointer group"
            >
              {/* Stack 1: Past (Left) */}
              <motion.div
                animate={{
                  x: userHasCut ? [ -140, 0 ] : [-140, -130, -140],
                  y: userHasCut ? [ -20, 0 ] : [-10, 0, -10],
                  rotateZ: userHasCut ? [ -10, 0 ] : [-8, -6, -8]
                }}
                transition={{ duration: userHasCut ? 0.8 : 2.5, repeat: userHasCut ? 0 : Infinity }}
                className="absolute z-10"
              >
                {renderCardBack('cut-left')}
                <span className="text-[10px] font-mono text-[#D4B97E] block text-center mt-2 opacity-80 group-hover:text-white">
                  Past Stream
                </span>
              </motion.div>

              {/* Stack 2: Present (Center) */}
              <motion.div
                animate={{
                  y: userHasCut ? [ -30, 0 ] : [-25, -15, -25],
                  scale: userHasCut ? [ 1.1, 1 ] : [1, 1.05, 1]
                }}
                transition={{ duration: userHasCut ? 0.8 : 2.2, repeat: userHasCut ? 0 : Infinity }}
                className="absolute z-20"
              >
                {renderCardBack('cut-center', true)}
                <span className="text-[10px] font-mono text-[#f3e5ab] font-bold block text-center mt-2 group-hover:scale-110 transition-transform">
                  ✦ Click to Cut ✦
                </span>
              </motion.div>

              {/* Stack 3: Future (Right) */}
              <motion.div
                animate={{
                  x: userHasCut ? [ 140, 0 ] : [140, 130, 140],
                  y: userHasCut ? [ -20, 0 ] : [-10, 0, -10],
                  rotateZ: userHasCut ? [ 10, 0 ] : [8, 6, 8]
                }}
                transition={{ duration: userHasCut ? 0.8 : 2.5, repeat: userHasCut ? 0 : Infinity }}
                className="absolute z-10"
              >
                {renderCardBack('cut-right')}
                <span className="text-[10px] font-mono text-[#D4B97E] block text-center mt-2 opacity-80 group-hover:text-white">
                  Future Stream
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* STAGE 4: FANNING & DEALING ALIGNMENT (Arcana Celestial Semicircle Fan) */}
          {(stage === 'fanning' || stage === 'ready') && (
            <motion.div
              key="stage-fanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full max-w-xl h-64 flex items-center justify-center"
            >
              {[ -40, -25, -10, 0, 10, 25, 40 ].map((angle, idx) => {
                const total = 7;
                const offsetFactor = (idx - 3) * 28;
                return (
                  <motion.div
                    key={`fan-${idx}`}
                    initial={{ rotateZ: 0, x: 0, y: 0 }}
                    animate={{
                      rotateZ: stage === 'ready' ? 0 : angle,
                      x: stage === 'ready' ? 0 : offsetFactor,
                      y: stage === 'ready' ? 0 : Math.abs(angle) * 0.8 - 15,
                      scale: stage === 'ready' ? 1 : 0.95
                    }}
                    transition={{
                      duration: 1.2,
                      delay: idx * 0.08,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="absolute"
                    style={{ zIndex: idx }}
                  >
                    {renderCardBack(`fanned-${idx}`, idx === 3)}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls & Ritual Status */}
      <div className="w-full text-center space-y-3 z-20 pt-2 border-t border-[#C5A059]/20">
        <div>
          <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#f3e5ab] animate-fade-in flex items-center justify-center gap-2">
            <span>{getStageTitle()}</span>
            {stage === 'ready' && <CheckCircle2 className="w-5 h-5 text-emerald-400 inline" />}
          </h4>
          <p className="text-xs text-gray-400 italic mt-0.5">
            {getStageSubtitle()}
          </p>
        </div>

        {/* Progress Tracker Bar */}
        <div className="w-full max-w-md mx-auto h-1.5 rounded-full bg-[#12141D] border border-[#C5A059]/30 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#C5A059] to-[#F3E5AB] rounded-full shadow-[0_0_10px_rgba(197,160,89,0.8)]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Interactive Ritual Steps Pills */}
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap text-[10px] font-mono">
          <span
            className={`px-2.5 py-1 rounded-full border transition-all ${
              stage === 'gathering'
                ? 'bg-[#C5A059]/30 border-[#C5A059] text-[#f3e5ab] shadow-sm'
                : 'bg-[#12141D] border-white/5 text-gray-500'
            }`}
          >
            1. Gathering
          </span>
          <span
            className={`px-2.5 py-1 rounded-full border transition-all ${
              stage === 'riffle'
                ? 'bg-[#C5A059]/30 border-[#C5A059] text-[#f3e5ab] shadow-sm'
                : 'bg-[#12141D] border-white/5 text-gray-500'
            }`}
          >
            2. Arcana Riffle
          </span>
          <span
            onClick={stage === 'cut' ? handleManualCut : undefined}
            className={`px-2.5 py-1 rounded-full border transition-all ${
              stage === 'cut'
                ? 'bg-[#C5A059]/30 border-[#C5A059] text-[#f3e5ab] shadow-sm cursor-pointer animate-pulse'
                : 'bg-[#12141D] border-white/5 text-gray-500'
            }`}
          >
            3. Sacred Cut {stage === 'cut' && !userHasCut ? '(Tap)' : ''}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full border transition-all ${
              stage === 'fanning' || stage === 'ready'
                ? 'bg-[#C5A059]/30 border-[#C5A059] text-[#f3e5ab] shadow-sm'
                : 'bg-[#12141D] border-white/5 text-gray-500'
            }`}
          >
            4. Attunement
          </span>
        </div>
      </div>
    </div>
  );
};
