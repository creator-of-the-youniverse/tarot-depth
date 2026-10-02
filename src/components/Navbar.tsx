import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Compass,
  LineChart,
  User as UserIcon,
  ShieldAlert,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Volume2,
  Volume1,
  VolumeX,
  Music,
  ChevronDown,
  Layers,
  Sliders
} from 'lucide-react';
import { User, signInWithPopup, googleProvider, signOut, auth } from '../lib/firebase';
import { ambientSound, SoundscapePreset, SoundscapeState } from '../lib/ambientSound';
import { SPREADS } from '../data/tarotDeck';
import { SpreadDefinition } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User | null;
  onOpenDisclaimer: () => void;
  onOpenAuthModal?: () => void;
  startNewReading: () => void;
  onSelectSpreadDirectly?: (spread: SpreadDefinition) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenDisclaimer,
  onOpenAuthModal,
  startNewReading,
  onSelectSpreadDirectly
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundMenuOpen, setSoundMenuOpen] = useState(false);
  const [spreadMenuOpen, setSpreadMenuOpen] = useState(false);
  const [soundState, setSoundState] = useState<SoundscapeState>(ambientSound.getState());

  const soundButtonRef = useRef<HTMLButtonElement | null>(null);
  const soundPopoverRef = useRef<HTMLDivElement | null>(null);
  const spreadPopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = ambientSound.subscribe((st) => setSoundState(st));
    return () => unsubscribe();
  }, []);

  // Close floating popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        soundPopoverRef.current &&
        !soundPopoverRef.current.contains(target) &&
        soundButtonRef.current &&
        !soundButtonRef.current.contains(target)
      ) {
        setSoundMenuOpen(false);
      }
      if (
        spreadPopoverRef.current &&
        !spreadPopoverRef.current.contains(target)
      ) {
        setSpreadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleAmbient = () => {
    ambientSound.toggle();
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google sign in error:', err);
    }
  };

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setSoundMenuOpen(false);
    setSpreadMenuOpen(false);
  };

  const isTabActive = (tabKey: string) => {
    if (tabKey === 'home' && currentTab === 'home') return true;
    if (tabKey === 'card_of_the_day' && currentTab === 'card_of_the_day') return true;
    if (tabKey === 'horoscope' && currentTab === 'horoscope') return true;
    if (tabKey === 'spreads' && (currentTab === 'spreads' || currentTab === 'draw' || currentTab === 'question')) return true;
    if (tabKey === 'journal' && (currentTab === 'journal' || currentTab === 'reading_detail')) return true;
    if (tabKey === 'patterns' && currentTab === 'patterns') return true;
    if (tabKey === 'profile' && currentTab === 'profile') return true;
    return false;
  };

  return (
    <>
      {/* Top Header Navbar - Sticky to top of viewport */}
      <header className="sticky top-0 z-40 bg-tarot-dark/95 backdrop-blur-xl border-b border-[#C5A059]/20 shadow-lg w-full pt-[env(safe-area-inset-top,0px)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Brand Logo & Title */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2 group focus:outline-none shrink-0 active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-full bg-tarot-card-bg border border-[#C5A059]/40 flex items-center justify-center glow-gold group-hover:border-[#C5A059] transition-all">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div className="text-left">
              <span className="font-serif text-sm sm:text-base font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#C5A059] block leading-tight">
                TAROT DEPTH
              </span>
              <span className="text-[7.5px] sm:text-[8px] tracking-widest text-[#D4B97E]/70 uppercase font-mono hidden xl:block">
                Symbolic Reflection
              </span>
            </div>
          </button>

          {/* Center: Desktop Navigation Tabs (Hidden on < lg, Cleanly Spaced on lg+) */}
          <nav aria-label="Desktop Navigation" className="hidden lg:flex items-center gap-1 xl:gap-2 flex-shrink-0">
            <button
              onClick={() => handleTabClick('home')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isTabActive('home')
                  ? 'bg-[#C5A059]/20 text-[#F3E5AB] border border-[#C5A059]/50 shadow-sm font-semibold'
                  : 'text-gray-300 hover:text-[#F3E5AB] hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleTabClick('card_of_the_day')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isTabActive('card_of_the_day')
                  ? 'bg-[#C5A059]/20 text-[#F3E5AB] border border-[#C5A059]/50 shadow-sm font-semibold'
                  : 'text-gray-300 hover:text-[#F3E5AB] hover:bg-white/5'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Daily Card</span>
            </button>

            <button
              onClick={() => handleTabClick('horoscope')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isTabActive('horoscope')
                  ? 'bg-[#C5A059]/20 text-[#F3E5AB] border border-[#C5A059]/50 shadow-sm font-semibold'
                  : 'text-gray-300 hover:text-[#F3E5AB] hover:bg-white/5'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Zodiac</span>
            </button>

            <button
              onClick={() => handleTabClick('spreads')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isTabActive('spreads')
                  ? 'bg-[#C5A059]/20 text-[#F3E5AB] border border-[#C5A059]/50 shadow-sm font-semibold'
                  : 'text-gray-300 hover:text-[#F3E5AB] hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Spreads</span>
            </button>

            <button
              onClick={() => handleTabClick('journal')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isTabActive('journal')
                  ? 'bg-[#C5A059]/20 text-[#F3E5AB] border border-[#C5A059]/50 shadow-sm font-semibold'
                  : 'text-gray-300 hover:text-[#F3E5AB] hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Journal</span>
            </button>

            <button
              onClick={() => handleTabClick('patterns')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isTabActive('patterns')
                  ? 'bg-[#C5A059]/20 text-[#F3E5AB] border border-[#C5A059]/50 shadow-sm font-semibold'
                  : 'text-gray-300 hover:text-[#F3E5AB] hover:bg-white/5'
              }`}
            >
              <LineChart className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Stats</span>
            </button>
          </nav>

          {/* Right: Consolidated Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Quick Spread Picker Popover (Only on XL to preserve space on LG) */}
            <div className="relative hidden xl:block" ref={spreadPopoverRef}>
              <button
                onClick={() => setSpreadMenuOpen(!spreadMenuOpen)}
                className="px-2.5 py-1.5 rounded-xl bg-tarot-card-bg border border-[#C5A059]/30 text-gray-300 hover:text-[#F3E5AB] hover:border-[#C5A059] transition-all text-xs flex items-center gap-1.5 min-h-[36px] active:scale-95 cursor-pointer"
                title="Select Tarot Spread"
              >
                <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px] font-medium">Presets</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {spreadMenuOpen && (
                <div
                  style={{ backgroundColor: '#0E0E10', opacity: 1 }}
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/40 shadow-2xl p-2 z-50 animate-fade-in space-y-1"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-mono text-[#D4B97E] uppercase border-b border-[#C5A059]/20 flex items-center justify-between">
                    <span>Quick Spreads</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-[#C5A059]/30">
                    {SPREADS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSpreadMenuOpen(false);
                          if (onSelectSpreadDirectly) {
                            onSelectSpreadDirectly(s);
                          }
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-gray-200 hover:bg-[#C5A059]/20 hover:text-[#F3E5AB] transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{s.title}</span>
                        <span className="text-[10px] font-mono text-[#C5A059] shrink-0 ml-2">
                          {s.cardCount} cards
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSpreadMenuOpen(false);
                      setCurrentTab('spreads');
                    }}
                    className="w-full text-center py-2 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs font-semibold text-[#F3E5AB] hover:bg-[#C5A059]/25 transition-all mt-1 cursor-pointer"
                  >
                    View All & Custom Spreads →
                  </button>
                </div>
              )}
            </div>

            {/* Soundscape Toggle Button in Navbar */}
            <button
              ref={soundButtonRef}
              onClick={() => setSoundMenuOpen((prev) => !prev)}
              title={
                soundState.isPlaying
                  ? `Meditative Soundscape Playing (${Math.round(soundState.volume * 100)}%)`
                  : 'Meditative Soundscape'
              }
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 min-h-[34px] sm:min-h-[36px] active:scale-95 cursor-pointer shrink-0 ${
                soundState.isPlaying
                  ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#F3E5AB] shadow-[0_0_10px_rgba(197,160,89,0.3)]'
                  : 'bg-tarot-card-bg border-[#C5A059]/30 text-gray-300 hover:text-[#F3E5AB]'
              }`}
            >
              {soundState.isPlaying ? (
                soundState.volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                ) : soundState.volume < 0.5 ? (
                  <Volume1 className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                )
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span className="hidden sm:inline text-[11px] font-medium">
                {soundState.isPlaying
                  ? soundState.volume === 0
                    ? '0%'
                    : `${Math.round(soundState.volume * 100)}%`
                  : 'Audio'}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:inline" />
            </button>

            {/* Disclaimer Shield Button */}
            <button
              onClick={onOpenDisclaimer}
              title="Reflective Disclaimer"
              className="p-1.5 sm:p-2 rounded-xl bg-tarot-card-bg border border-[#C5A059]/30 text-gray-400 hover:text-[#D4B97E] hover:border-[#C5A059]/60 transition-all text-xs flex items-center justify-center min-h-[34px] min-w-[34px] sm:min-h-[36px] sm:min-w-[36px] active:scale-95 cursor-pointer shrink-0"
            >
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059]" />
            </button>

            {/* Primary CTA: Draw New Reading */}
            <button
              onClick={startNewReading}
              className="px-3 py-1.5 rounded-xl bg-gold-gradient text-black font-bold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer min-h-[34px] sm:min-h-[36px] shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Draw</span>
            </button>

            {/* User Sign In / Profile Avatar */}
            {user ? (
              <div className="flex items-center gap-1 pl-1 border-l border-[#C5A059]/20 shrink-0">
                <button
                  onClick={() => onOpenAuthModal ? onOpenAuthModal() : handleTabClick('profile')}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-tarot-card-bg border border-[#C5A059]/50 flex items-center justify-center text-[#F3E5AB] text-[10px] sm:text-xs font-bold uppercase hover:border-[#C5A059] active:scale-95 transition-all cursor-pointer"
                  title={user.email || user.displayName || 'Profile & Account'}
                >
                  {user.displayName ? user.displayName.slice(0, 2) : user.isAnonymous ? 'AN' : 'US'}
                </button>
                <button
                  onClick={() => signOut(auth)}
                  title="Sign Out"
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors active:scale-95 cursor-pointer hidden sm:block"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuthModal ? onOpenAuthModal() : handleGoogleSignIn()}
                className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-tarot-card-bg border border-[#C5A059]/40 text-xs text-[#F3E5AB] hover:border-[#C5A059] active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer min-h-[34px] sm:min-h-[36px] shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Hamburger Drawer Toggle (for Mobile & Tablet < lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-tarot-card-bg border border-[#C5A059]/40 text-[#D4B97E] hover:border-[#C5A059] active:scale-95 transition-all focus:outline-none min-h-[34px] min-w-[34px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center cursor-pointer shrink-0"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Slide-Down Navigation Drawer (Attached to header bottom for Mobile / Tablet) */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 bg-tarot-surface border-b border-[#C5A059]/40 p-4 sm:p-6 space-y-4 shadow-2xl backdrop-blur-2xl animate-fade-in pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#D4B97E] uppercase pb-1 border-b border-[#C5A059]/20">
                <span>Sanctuary Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-[#C5A059] flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleTabClick('home')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all min-h-[44px] cursor-pointer ${
                    currentTab === 'home'
                      ? 'bg-[#C5A059]/20 text-[#D4B97E] border-[#C5A059] shadow-sm font-semibold'
                      : 'bg-tarot-card-bg text-gray-300 border-white/5 hover:border-[#C5A059]/30 active:bg-white/10'
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#C5A059]" />
                  <span>Home Sanctuary</span>
                </button>

                <button
                  onClick={() => handleTabClick('card_of_the_day')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all min-h-[44px] cursor-pointer ${
                    currentTab === 'card_of_the_day'
                      ? 'bg-[#C5A059]/20 text-[#D4B97E] border-[#C5A059] shadow-sm font-semibold'
                      : 'bg-tarot-card-bg text-gray-300 border-white/5 hover:border-[#C5A059]/30 active:bg-white/10'
                  }`}
                >
                  <Sun className="w-4 h-4 text-[#C5A059]" />
                  <span>Daily Card</span>
                </button>

                <button
                  onClick={() => handleTabClick('horoscope')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all min-h-[44px] cursor-pointer ${
                    currentTab === 'horoscope'
                      ? 'bg-[#C5A059]/20 text-[#D4B97E] border-[#C5A059] shadow-sm font-semibold'
                      : 'bg-tarot-card-bg text-gray-300 border-white/5 hover:border-[#C5A059]/30 active:bg-white/10'
                  }`}
                >
                  <Moon className="w-4 h-4 text-[#C5A059]" />
                  <span>Zodiac & Horoscopes</span>
                </button>

                <button
                  onClick={() => handleTabClick('spreads')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all min-h-[44px] cursor-pointer ${
                    currentTab === 'spreads' || currentTab === 'draw' || currentTab === 'question'
                      ? 'bg-[#C5A059]/20 text-[#D4B97E] border-[#C5A059] shadow-sm font-semibold'
                      : 'bg-tarot-card-bg text-gray-300 border-white/5 hover:border-[#C5A059]/30 active:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Tarot Spreads</span>
                </button>

                <button
                  onClick={() => handleTabClick('journal')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all min-h-[44px] cursor-pointer ${
                    currentTab === 'journal' || currentTab === 'reading_detail'
                      ? 'bg-[#C5A059]/20 text-[#D4B97E] border-[#C5A059] shadow-sm font-semibold'
                      : 'bg-tarot-card-bg text-gray-300 border-white/5 hover:border-[#C5A059]/30 active:bg-white/10'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>Journal Log</span>
                </button>

                <button
                  onClick={() => handleTabClick('patterns')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all min-h-[44px] cursor-pointer ${
                    currentTab === 'patterns'
                      ? 'bg-[#C5A059]/20 text-[#D4B97E] border-[#C5A059] shadow-sm font-semibold'
                      : 'bg-tarot-card-bg text-gray-300 border-white/5 hover:border-[#C5A059]/30 active:bg-white/10'
                  }`}
                >
                  <LineChart className="w-4 h-4 text-[#C5A059]" />
                  <span>Patterns & Stats</span>
                </button>

                <button
                  onClick={() => handleTabClick('profile')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all min-h-[44px] cursor-pointer ${
                    currentTab === 'profile'
                      ? 'bg-[#C5A059]/20 text-[#D4B97E] border-[#C5A059] shadow-sm font-semibold'
                      : 'bg-tarot-card-bg text-gray-300 border-white/5 hover:border-[#C5A059]/30 active:bg-white/10'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-[#C5A059]" />
                  <span>My Profile</span>
                </button>
              </div>

              {/* Drawer Soundscape & Dedicated Volume Controls */}
              <div className="pt-3 border-t border-[#C5A059]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#D4B97E] uppercase flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Ambient Soundscape</span>
                  </span>
                  <button
                    onClick={handleToggleAmbient}
                    className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      soundState.isPlaying
                        ? 'bg-[#C5A059]/20 text-[#F3E5AB] border border-[#C5A059]'
                        : 'bg-tarot-card-bg text-gray-400 border border-white/10'
                    }`}
                  >
                    {soundState.isPlaying ? <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{soundState.isPlaying ? 'Playing' : 'Muted'}</span>
                  </button>
                </div>

                {/* Mobile Dedicated Volume Slider */}
                <div className="bg-[#161618] p-2.5 rounded-xl border border-[#C5A059]/25 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-[#D4B97E] uppercase flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-[#C5A059]" />
                      <span>Volume Level</span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#F3E5AB]">
                      {soundState.volume === 0 ? 'Muted (0%)' : `${Math.round(soundState.volume * 100)}%`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (soundState.volume > 0) ambientSound.setVolume(0);
                        else ambientSound.setVolume(0.40);
                      }}
                      className="text-gray-400 hover:text-white p-1"
                      title={soundState.volume === 0 ? 'Restore Volume' : 'Mute'}
                    >
                      {soundState.volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : soundState.volume < 0.5 ? (
                        <Volume1 className="w-4 h-4 text-[#C5A059]" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#C5A059]" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(soundState.volume * 100)}
                      onChange={(e) => {
                        const val = Number(e.target.value) / 100;
                        ambientSound.setVolume(val);
                        if (!soundState.isPlaying && val > 0) ambientSound.start();
                      }}
                      aria-label="Soundscape Volume Level"
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                      style={{
                        background: `linear-gradient(to right, #C5A059 0%, #F3E5AB ${Math.round(
                          soundState.volume * 100
                        )}%, rgba(255,255,255,0.15) ${Math.round(
                          soundState.volume * 100
                        )}%, rgba(255,255,255,0.15) 100%)`
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => ambientSound.triggerSingingBowl()}
                    className="p-2 rounded-xl bg-[#161618] border border-[#C5A059]/30 text-xs text-[#D4B97E] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>🔔</span>
                    <span>Tibetan Bowl</span>
                  </button>
                  <button
                    onClick={() => ambientSound.triggerCrystalCascade()}
                    className="p-2 rounded-xl bg-[#161618] border border-[#C5A059]/30 text-xs text-[#D4B97E] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>✨</span>
                    <span>Crystal Cascade</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  startNewReading();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg min-h-[44px] cursor-pointer active:scale-[0.98] transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                <span>Begin New Reading</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Soundscape Floating Popover - Root Viewport Anchored (100% Solid & Safe Positioning) */}
      {soundMenuOpen && (
        <div
          ref={soundPopoverRef}
          style={{
            backgroundColor: '#0E0E10',
            opacity: 1
          }}
          className="fixed top-16 right-3 sm:right-6 md:right-8 w-[calc(100vw-1.5rem)] max-w-[21.5rem] rounded-2xl bg-[#0E0E10] border-2 border-[#C5A059]/60 shadow-[0_20px_60px_rgba(0,0,0,0.98)] p-3.5 z-50 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-[#C5A059]/25 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F3E5AB]">
                <Music className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Sacred Soundscape</span>
              </div>
              <button
                onClick={handleToggleAmbient}
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  soundState.isPlaying
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                {soundState.isPlaying ? 'Active' : 'Muted'}
              </button>
            </div>
            <button
              onClick={() => setSoundMenuOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-[#F3E5AB] hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dedicated Volume Control Slider */}
          <div className="space-y-2 bg-[#161618] p-2.5 rounded-xl border border-[#C5A059]/25">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-[#D4B97E]">
                <Sliders className="w-3 h-3 text-[#C5A059]" />
                <span>Volume Level</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#F3E5AB]">
                {soundState.volume === 0 ? 'Muted (0%)' : `${Math.round(soundState.volume * 100)}%`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (soundState.volume > 0) {
                    ambientSound.setVolume(0);
                  } else {
                    ambientSound.setVolume(0.40);
                    if (!soundState.isPlaying) ambientSound.start();
                  }
                }}
                title={soundState.volume === 0 ? 'Restore Volume (40%)' : 'Mute Sound'}
                className="p-1 rounded-lg text-gray-400 hover:text-[#F3E5AB] active:scale-95 transition-all cursor-pointer shrink-0"
              >
                {soundState.volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400/90" />
                ) : soundState.volume < 0.5 ? (
                  <Volume1 className="w-4 h-4 text-[#C5A059]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#C5A059]" />
                )}
              </button>

              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.round(soundState.volume * 100)}
                  onChange={(e) => {
                    const val = Number(e.target.value) / 100;
                    ambientSound.setVolume(val);
                    if (!soundState.isPlaying && val > 0) {
                      ambientSound.start();
                    }
                  }}
                  aria-label="Soundscape Volume Level Slider"
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#C5A059] focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #C5A059 0%, #F3E5AB ${Math.round(
                      soundState.volume * 100
                    )}%, rgba(255,255,255,0.12) ${Math.round(
                      soundState.volume * 100
                    )}%, rgba(255,255,255,0.12) 100%)`
                  }}
                />
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-4 gap-1 pt-0.5">
              {[
                { label: 'Whisper', val: 0.15 },
                { label: 'Gentle', val: 0.35 },
                { label: 'Presence', val: 0.60 },
                { label: 'Deep', val: 0.85 }
              ].map((preset) => {
                const isCurrent = Math.abs(soundState.volume - preset.val) < 0.08;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      ambientSound.setVolume(preset.val);
                      if (!soundState.isPlaying) ambientSound.start();
                    }}
                    className={`py-1 px-1 rounded-md text-[9px] font-mono tracking-tight transition-all cursor-pointer text-center ${
                      isCurrent
                        ? 'bg-[#C5A059]/25 text-[#F3E5AB] border border-[#C5A059]/60 font-semibold'
                        : 'bg-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-[#D4B97E] block">
              Harmonic Frequency Preset
            </label>
            <select
              value={soundState.preset}
              onChange={(e) => {
                const p = e.target.value as SoundscapePreset;
                ambientSound.setPreset(p);
                if (!soundState.isPlaying) ambientSound.start();
              }}
              className="w-full bg-[#161618] border border-[#C5A059]/30 text-[#F3E5AB] rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer font-sans"
            >
              <option value="sanctuary">🎵 432Hz Sacred Sanctuary</option>
              <option value="cosmic">✨ Cosmic Starlight (216Hz)</option>
              <option value="temple">🧘 Tibetan Temple OM (136Hz)</option>
              <option value="solfeggio">🌟 Solfeggio Miracle (528Hz)</option>
            </select>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-[#C5A059]/15">
            <span className="text-[10px] uppercase font-mono text-[#D4B97E] block">
              Acoustic Overtones
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => ambientSound.triggerSingingBowl()}
                className="px-2 py-1.5 rounded-xl bg-[#161618] border border-[#C5A059]/30 hover:border-[#C5A059] text-[11px] text-[#D4B97E] hover:text-[#F3E5AB] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🔔</span>
                <span>Singing Bowl</span>
              </button>
              <button
                onClick={() => ambientSound.triggerCrystalCascade()}
                className="px-2 py-1.5 rounded-xl bg-[#161618] border border-[#C5A059]/30 hover:border-[#C5A059] text-[11px] text-[#D4B97E] hover:text-[#F3E5AB] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>✨</span>
                <span>Crystal Harp</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleToggleAmbient}
            className="w-full py-2 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 text-xs font-semibold text-[#F3E5AB] hover:bg-[#C5A059]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {soundState.isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{soundState.isPlaying ? 'Mute Soundscape' : 'Start Soundscape'}</span>
          </button>
        </div>
      )}

      {/* Drawer Full-Screen Backdrop (Placed at root level so it covers entire viewport below header) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-14 sm:top-16 bg-black/80 backdrop-blur-md z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile & Tablet Bottom Navigation Bar - Root level fixed to true viewport bottom (< lg) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-tarot-dark/95 backdrop-blur-2xl border-t border-[#C5A059]/30 px-1 pt-1 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_25px_rgba(0,0,0,0.7)] transition-colors duration-300"
      >
        <div className="grid grid-cols-6 items-center justify-between text-center max-w-lg mx-auto">
          <button
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] cursor-pointer active:scale-95 ${
              isTabActive('home')
                ? 'text-[#D4B97E] font-semibold bg-[#C5A059]/15 border border-[#C5A059]/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[9px] leading-tight mt-0.5 font-sans">Home</span>
          </button>

          <button
            onClick={() => handleTabClick('card_of_the_day')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] cursor-pointer active:scale-95 ${
              isTabActive('card_of_the_day')
                ? 'text-[#D4B97E] font-semibold bg-[#C5A059]/15 border border-[#C5A059]/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sun className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[9px] leading-tight mt-0.5 font-sans">Daily</span>
          </button>

          <button
            onClick={() => handleTabClick('horoscope')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] cursor-pointer active:scale-95 ${
              isTabActive('horoscope')
                ? 'text-[#D4B97E] font-semibold bg-[#C5A059]/15 border border-[#C5A059]/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Moon className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[9px] leading-tight mt-0.5 font-sans">Zodiac</span>
          </button>

          <button
            onClick={() => handleTabClick('spreads')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] cursor-pointer active:scale-95 ${
              isTabActive('spreads')
                ? 'text-[#D4B97E] font-semibold bg-[#C5A059]/15 border border-[#C5A059]/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[9px] leading-tight mt-0.5 font-sans">Spreads</span>
          </button>

          <button
            onClick={() => handleTabClick('journal')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] cursor-pointer active:scale-95 ${
              isTabActive('journal')
                ? 'text-[#D4B97E] font-semibold bg-[#C5A059]/15 border border-[#C5A059]/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[9px] leading-tight mt-0.5 font-sans">Journal</span>
          </button>

          <button
            onClick={() => handleTabClick('profile')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] cursor-pointer active:scale-95 ${
              isTabActive('profile')
                ? 'text-[#D4B97E] font-semibold bg-[#C5A059]/15 border border-[#C5A059]/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <UserIcon className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[9px] leading-tight mt-0.5 font-sans">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
