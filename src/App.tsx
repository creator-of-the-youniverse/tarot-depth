import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DisclaimerModal } from './components/DisclaimerModal';
import { CreateSpreadModal } from './components/CreateSpreadModal';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './pages/HomeView';
import { SpreadSelectionView } from './pages/SpreadSelectionView';
import { QuestionInputView } from './pages/QuestionInputView';
import { CardDrawView } from './pages/CardDrawView';
import { ReadingResultView } from './pages/ReadingResultView';
import { JournalView } from './pages/JournalView';
import { ReadingDetailView } from './pages/ReadingDetailView';
import { PatternsView } from './pages/PatternsView';
import { ProfileView } from './pages/ProfileView';
import { CardOfTheDayView } from './pages/CardOfTheDayView';
import { HoroscopeView } from './pages/HoroscopeView';
import { CardOfTheDayData } from './lib/cardOfTheDay';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { ShareModal } from './components/ShareModal';
import { ShareOptions } from './lib/share';
import { getInitialTheme, applyTheme, THEME_OPTIONS, ThemeId } from './lib/theme';

import {
  auth,
  onAuthStateChanged,
  User,
  getUserProfile,
  createOrUpdateUserProfile,
  getUserReadings,
  getUserCustomSpreads,
  saveCustomSpread,
  updateCustomSpread,
  deleteCustomSpread
} from './lib/firebase';
import { SpreadDefinition, CardInSpread, TarotReading, UserProfile, CustomSpread, CustomPosition } from './types';
import { SPREADS } from './data/tarotDeck';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [customSpreads, setCustomSpreads] = useState<CustomSpread[]>([]);
  const [userZodiacSign, setUserZodiacSign] = useState<string>(
    localStorage.getItem('tarot_user_zodiac') || 'aries'
  );

  const handleUpdateZodiacSign = async (signId: string) => {
    setUserZodiacSign(signId);
    localStorage.setItem('tarot_user_zodiac', signId);
    if (userProfile && user) {
      const updated = { ...userProfile, zodiacSign: signId };
      setUserProfile(updated);
      await createOrUpdateUserProfile(user, { zodiacSign: signId });
    }
  };

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Reading Flow State
  const [selectedSpread, setSelectedSpread] = useState<SpreadDefinition | null>(null);
  const [questionData, setQuestionData] = useState<{
    question: string;
    mood: string;
    tags: string[];
    notes: string;
  }>({
    question: '',
    mood: 'seeking_clarity',
    tags: ['Personal Growth'],
    notes: ''
  });
  const [drawData, setDrawData] = useState<{
    cards: CardInSpread[];
    interpretationText: string;
  } | null>(null);

  // Detail View State
  const [activeDetailReading, setActiveDetailReading] = useState<TarotReading | null>(null);

  // Theme State
  const [theme, setTheme] = useState<ThemeId>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Modal States
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [isSpreadModalOpen, setIsSpreadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareOptions, setShareOptions] = useState<ShareOptions | null>(null);
  const [editingSpread, setEditingSpread] = useState<CustomSpread | null>(null);

  const handleOpenShare = (options: ShareOptions) => {
    setShareOptions(options);
    setIsShareModalOpen(true);
  };

  // Auth & Profile Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const prof = await getUserProfile(currentUser.uid);
        if (!prof) {
          const newProf = await createOrUpdateUserProfile(currentUser);
          setUserProfile(newProf);
          if (!newProf.disclaimerAccepted) {
            setDisclaimerOpen(true);
          }
        } else {
          setUserProfile(prof);
          if (!prof.disclaimerAccepted) {
            setDisclaimerOpen(true);
          }
        }
        refreshReadings(currentUser.uid);
        refreshCustomSpreads(currentUser.uid);
      } else {
        setUserProfile(null);
        setReadings([]);
        setCustomSpreads([]);
        // First visit check from localStorage if unauthenticated
        const acceptedLocal = localStorage.getItem('tarot_depth_disclaimer_accepted');
        if (!acceptedLocal) {
          setDisclaimerOpen(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshReadings = async (uid?: string) => {
    const targetUid = uid || user?.uid;
    if (targetUid) {
      const list = await getUserReadings(targetUid);
      setReadings(list);
    }
  };

  const refreshCustomSpreads = async (uid?: string) => {
    const targetUid = uid || user?.uid;
    if (targetUid) {
      const list = await getUserCustomSpreads(targetUid);
      setCustomSpreads(list);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const prof = await getUserProfile(user.uid);
      setUserProfile(prof);
    }
  };

  const handleAcceptDisclaimer = async () => {
    setDisclaimerOpen(false);
    localStorage.setItem('tarot_depth_disclaimer_accepted', 'true');
    if (user) {
      const updated = await createOrUpdateUserProfile(user, {
        disclaimerAccepted: true,
        disclaimerAcceptedAt: new Date().toISOString()
      });
      setUserProfile(updated);
    }
  };

  // Custom Spreads Handlers
  const handleOpenCreateSpreadModal = () => {
    setEditingSpread(null);
    setIsSpreadModalOpen(true);
  };

  const handleOpenEditSpreadModal = (spread: CustomSpread) => {
    setEditingSpread(spread);
    setIsSpreadModalOpen(true);
  };

  const handleSaveCustomSpread = async (data: {
    title: string;
    subtitle: string;
    description: string;
    cardCount: number;
    positions: CustomPosition[];
    recommendedFor: string;
  }) => {
    if (!user) return;
    if (editingSpread) {
      await updateCustomSpread(user.uid, editingSpread.id, data);
    } else {
      await saveCustomSpread(user.uid, data);
    }
    await refreshCustomSpreads(user.uid);
  };

  const handleDeleteCustomSpread = async (spreadId: string) => {
    if (!user) return;
    await deleteCustomSpread(user.uid, spreadId);
    await refreshCustomSpreads(user.uid);
  };

  // Flow Triggers
  const handleStartNewReading = () => {
    setSelectedSpread(null);
    setDrawData(null);
    setCurrentTab('spreads');
  };

  const handleQuickDailyDraw = () => {
    const singleSpread = SPREADS.find(s => s.id === 'single_draw') || SPREADS[0];
    setSelectedSpread(singleSpread);
    setQuestionData({
      question: 'Daily Intention & Single Focus',
      mood: 'seeking_clarity',
      tags: ['Daily Intention'],
      notes: ''
    });
    setCurrentTab('draw');
  };

  const handleStartCardOfDayReflection = (spread: SpreadDefinition, cardOfTodayData: CardOfTheDayData) => {
    setSelectedSpread(spread);
    setQuestionData({
      question: `Daily Reflection on ${cardOfTodayData.card.name}`,
      mood: 'seeking_clarity',
      tags: ['Card of the Day', 'Daily Intention'],
      notes: cardOfTodayData.dailyPrompt
    });
    setDrawData({
      cards: [
        {
          card: cardOfTodayData.card,
          positionName: 'Card of the Day',
          positionDescription: cardOfTodayData.dailyPrompt,
          orientation: cardOfTodayData.orientation
        }
      ],
      interpretationText: `**Card of the Day**: ${cardOfTodayData.card.name} (${cardOfTodayData.orientation.toUpperCase()})\n\n**Symbolism**: ${cardOfTodayData.card.symbolism}\n\n**Traditional Meaning**: ${cardOfTodayData.orientation === 'upright' ? cardOfTodayData.card.uprightMeaning : cardOfTodayData.card.reversedMeaning}\n\n**Daily Reflection Question**: ${cardOfTodayData.dailyPrompt}`
    });
    setCurrentTab('result');
  };

  const activeDeckAesthetic =
    userProfile?.defaultDeck ||
    (localStorage.getItem('tarot_deck_aesthetic') as 'classic_gold' | 'cosmic_night' | 'minimal_artisan') ||
    'classic_gold';

  const canvasBgClass =
    activeDeckAesthetic === 'cosmic_night'
      ? 'min-h-screen bg-[#04050D] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#04050D] to-[#020207] text-purple-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200'
      : activeDeckAesthetic === 'minimal_artisan'
      ? 'min-h-screen bg-[#101012] text-gray-100 flex flex-col font-sans selection:bg-[#D4B97E]/30 selection:text-[#D4B97E]'
      : 'min-h-screen bg-tarot-dark text-gray-200 flex flex-col font-sans selection:bg-[#C5A059]/30 selection:text-[#D4B97E]';

  return (
    <div className={canvasBgClass}>
      {/* Top Header Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onOpenDisclaimer={() => setDisclaimerOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        startNewReading={handleStartNewReading}
        onSelectSpreadDirectly={(spread) => {
          setSelectedSpread(spread);
          setCurrentTab('question');
        }}
      />

      {/* Main View Area */}
      <main className="flex-grow pt-4 sm:pt-8 pb-24 lg:pb-12">
        {currentTab === 'home' && (
          <HomeView
            userProfile={userProfile}
            recentReadings={readings}
            onSelectSpread={handleStartNewReading}
            onQuickDailyDraw={handleQuickDailyDraw}
            onNavigateTab={setCurrentTab}
            onOpenReadingDetail={(r) => {
              setActiveDetailReading(r);
              setCurrentTab('reading_detail');
            }}
            onOpenShare={handleOpenShare}
          />
        )}

        {currentTab === 'card_of_the_day' && (
          <CardOfTheDayView
            userProfile={userProfile}
            onStartReflectionReading={handleStartCardOfDayReflection}
            onNavigateTab={setCurrentTab}
            onOpenShare={handleOpenShare}
          />
        )}

        {currentTab === 'spreads' && (
          <SpreadSelectionView
            customSpreads={customSpreads}
            onSelectSpread={(spread) => {
              setSelectedSpread(spread);
              setCurrentTab('question');
            }}
            onCreateCustomSpread={handleOpenCreateSpreadModal}
            onEditCustomSpread={handleOpenEditSpreadModal}
            onDeleteCustomSpread={handleDeleteCustomSpread}
          />
        )}

        {currentTab === 'question' && selectedSpread && (
          <QuestionInputView
            spread={selectedSpread}
            onBack={() => setCurrentTab('spreads')}
            onSubmitQuestion={(data) => {
              setQuestionData(data);
              setCurrentTab('draw');
            }}
          />
        )}

        {currentTab === 'draw' && selectedSpread && (
          <CardDrawView
            spread={selectedSpread}
            question={questionData.question}
            mood={questionData.mood}
            tags={questionData.tags}
            notes={questionData.notes}
            userProfile={userProfile}
            onBack={() => setCurrentTab('question')}
            onCompleteDraw={(data) => {
              setDrawData(data);
              setCurrentTab('result');
              refreshReadings();
            }}
          />
        )}

        {currentTab === 'result' && selectedSpread && drawData && (
          <ReadingResultView
            user={user}
            userProfile={userProfile}
            spread={selectedSpread}
            question={questionData.question}
            cardsInSpread={drawData.cards}
            interpretationText={drawData.interpretationText}
            mood={questionData.mood}
            tags={questionData.tags}
            notes={questionData.notes}
            onNavigateTab={setCurrentTab}
            onOpenDisclaimer={() => setDisclaimerOpen(true)}
            onOpenShare={handleOpenShare}
          />
        )}

        {currentTab === 'journal' && (
          <JournalView
            userProfile={userProfile}
            readings={readings}
            onOpenReadingDetail={(r) => {
              setActiveDetailReading(r);
              setCurrentTab('reading_detail');
            }}
            onRefreshReadings={refreshReadings}
            onStartNewReading={handleStartNewReading}
            onOpenShare={handleOpenShare}
          />
        )}

        {currentTab === 'reading_detail' && activeDetailReading && (
          <ReadingDetailView
            userProfile={userProfile}
            reading={activeDetailReading}
            onBack={() => setCurrentTab('journal')}
            onRefreshReadings={refreshReadings}
            onOpenShare={handleOpenShare}
          />
        )}

        {currentTab === 'horoscope' && (
          <HoroscopeView
            userZodiacSign={userProfile?.zodiacSign || userZodiacSign}
            onUpdateZodiacSign={handleUpdateZodiacSign}
            onNavigateToCard={(cardName) => {
              // Could open card drawer or daily card
              setCurrentTab('card_of_the_day');
            }}
          />
        )}

        {currentTab === 'patterns' && (
          <PatternsView readings={readings} />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            userProfile={userProfile}
            customSpreads={customSpreads}
            onRefreshProfile={refreshProfile}
            onOpenDisclaimer={() => setDisclaimerOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onCreateCustomSpread={handleOpenCreateSpreadModal}
            onEditCustomSpread={handleOpenEditSpreadModal}
            onDeleteCustomSpread={handleDeleteCustomSpread}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#C5A059]/20 bg-tarot-surface py-8 px-4 text-center text-xs text-gray-500 space-y-4 mb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:mb-0">
        <p className="font-serif text-[#C5A059] tracking-[0.2em] font-bold uppercase">TAROT DEPTH</p>
        <p className="max-w-xl mx-auto font-light leading-relaxed">
          Designed for reflection, symbolic inquiry, and mindfulness. Tarot Depth interpretations are for entertainment and personal journaling purposes only.
        </p>

        {/* Aesthetic Theme Toggle */}
        <div className="pt-2 pb-1 max-w-lg mx-auto border-t border-[#C5A059]/10">
          <p className="text-[10px] uppercase font-mono tracking-wider text-[#C5A059]/80 mb-2">Sanctuary Visual Atmosphere</p>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center sm:items-start gap-1 ${
                  theme === t.id
                    ? 'bg-tarot-card-bg border-[#C5A059] text-[#F3E5AB] shadow-md ring-1 ring-[#C5A059]/30'
                    : 'bg-[#12141d]/50 border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{t.icon}</span>
                  <span className={`text-[11px] font-semibold ${theme === t.id ? 'text-gold-light' : 'text-gray-300'}`}>
                    {t.name}
                  </span>
                </div>
                <p className="text-[9px] text-gray-400 leading-tight hidden sm:block">
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={() => setDisclaimerOpen(true)}
            className="text-[11px] text-[#C5A059] underline hover:text-[#D4B97E] transition-colors cursor-pointer"
          >
            View Disclaimer & Terms
          </button>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
      />

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={disclaimerOpen}
        onAccept={handleAcceptDisclaimer}
        onClose={() => setDisclaimerOpen(false)}
      />

      {/* Create / Edit Custom Spread Modal */}
      <CreateSpreadModal
        isOpen={isSpreadModalOpen}
        editingSpread={editingSpread}
        onClose={() => setIsSpreadModalOpen(false)}
        onSave={handleSaveCustomSpread}
      />

      {/* Universal Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        options={shareOptions}
      />

      {/* PWA Install Banner & Offline Toast */}
      <PwaInstallBanner />
    </div>
  );
}
