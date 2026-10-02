import React, { useState } from 'react';
import { UserProfile, CustomSpread } from '../types';
import { User, signOut, auth, createOrUpdateUserProfile, signInWithPopup, googleProvider } from '../lib/firebase';
import { User as UserIcon, ShieldCheck, Palette, Layers, LogOut, LogIn, Check, Sparkles, Plus, Edit2, Trash2, Smartphone, Download, Wifi } from 'lucide-react';

interface ProfileViewProps {
  user: User | null;
  userProfile: UserProfile | null;
  customSpreads?: CustomSpread[];
  onRefreshProfile: () => void;
  onOpenDisclaimer: () => void;
  onOpenAuthModal?: () => void;
  onCreateCustomSpread?: () => void;
  onEditCustomSpread?: (spread: CustomSpread) => void;
  onDeleteCustomSpread?: (spreadId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  userProfile,
  customSpreads = [],
  onRefreshProfile,
  onOpenDisclaimer,
  onOpenAuthModal,
  onCreateCustomSpread,
  onEditCustomSpread,
  onDeleteCustomSpread
}) => {
  const [deckStyle, setDeckStyle] = useState<'classic_gold' | 'cosmic_night' | 'minimal_artisan'>(
    userProfile?.defaultDeck || 'classic_gold'
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSavePreferences = async () => {
    localStorage.setItem('tarot_deck_aesthetic', deckStyle);
    if (user) {
      await createOrUpdateUserProfile(user, {
        defaultDeck: deckStyle
      });
    }
    onRefreshProfile();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-[#E5E5E5] tracking-wide">
          Profile & Custom Geometry
        </h1>
        <p className="text-xs text-gray-400 font-light">
          Manage your account, custom tarot spreads, deck aesthetic preferences, and disclaimer status.
        </p>
      </div>

      {/* Account Info Box */}
      <div className="p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center font-bold text-[#D4B97E] text-lg uppercase font-serif">
              {userProfile?.displayName ? userProfile.displayName.slice(0, 2) : 'US'}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#D4B97E]">
                {userProfile?.displayName || 'Guest Seeker'}
              </h3>
              <span className="text-xs text-gray-400 font-mono">
                {user?.email || (user?.isAnonymous ? 'Guest Account (Anonymous)' : 'Not signed in')}
              </span>
            </div>
          </div>

          {user && !user.isAnonymous ? (
            <button
              onClick={() => signOut(auth)}
              className="px-4 py-2 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-300 hover:bg-red-900/50 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                if (onOpenAuthModal) {
                  onOpenAuthModal();
                } else {
                  signInWithPopup(auth, googleProvider).catch(err => console.error(err));
                }
              }}
              className="px-4 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md glow-gold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Sync</span>
            </button>
          )}
        </div>

        <div className="text-xs text-gray-400 space-y-1 font-mono">
          <p>
            <strong className="text-gray-300">Member Since:</strong>{' '}
            {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Active Session'}
          </p>
          <p>
            <strong className="text-gray-300">Storage Engine:</strong> Google Cloud Firestore
          </p>
        </div>
      </div>

      {/* Progressive Web App (PWA) Mobile Status Card */}
      <div className="p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4B97E]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#D4B97E]">
                Progressive Web App (PWA)
              </h3>
              <p className="text-[11px] text-gray-400 font-light">
                Full mobile offline caching, home-screen installation & standalone display.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>PWA Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#161618] border border-[#C5A059]/10 space-y-1">
            <span className="text-gray-400 font-mono text-[10px] block uppercase">Display Mode</span>
            <p className="font-bold text-[#E5E5E5] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {window.matchMedia('(display-mode: standalone)').matches ? 'Standalone App' : 'Mobile Web View'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#161618] border border-[#C5A059]/10 space-y-1">
            <span className="text-gray-400 font-mono text-[10px] block uppercase">Offline Caching</span>
            <p className="font-bold text-[#E5E5E5] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Service Worker Ready
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#161618] border border-[#C5A059]/10 space-y-1">
            <span className="text-gray-400 font-mono text-[10px] block uppercase">Mobile Deck</span>
            <p className="font-bold text-[#E5E5E5] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Touch Target Standard
            </p>
          </div>
        </div>
      </div>

      {/* My Custom Spreads Section */}
      <div className="p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/30 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#D4B97E]">
                My Custom Tarot Spreads ({customSpreads.length})
              </h3>
              <p className="text-[11px] text-gray-400 font-light">
                Spreads designed by you with custom card counts, positions, and keywords.
              </p>
            </div>
          </div>

          {onCreateCustomSpread && (
            <button
              onClick={onCreateCustomSpread}
              className="px-4 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md glow-gold"
            >
              <Plus className="w-4 h-4" />
              <span>Create Spread</span>
            </button>
          )}
        </div>

        {customSpreads.length === 0 ? (
          <div className="p-8 text-center bg-[#161618] rounded-xl border border-dashed border-[#C5A059]/20 space-y-3">
            <p className="text-xs text-gray-400">
              You haven't created any custom tarot spreads yet.
            </p>
            {onCreateCustomSpread && (
              <button
                onClick={onCreateCustomSpread}
                className="px-4 py-2 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs text-[#D4B97E] hover:bg-[#C5A059]/20 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Design Your First Spread</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customSpreads.map((spread) => (
              <div
                key={spread.id}
                className="p-4 rounded-xl bg-[#161618] border border-[#C5A059]/20 space-y-3 relative group hover:border-[#C5A059] transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] font-mono text-[10px] uppercase font-bold border border-[#C5A059]/20">
                      {spread.cardCount} {spread.cardCount === 1 ? 'Card' : 'Cards'}
                    </span>
                    <h4 className="font-serif font-bold text-[#E5E5E5] text-sm group-hover:text-[#D4B97E]">
                      {spread.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    {onEditCustomSpread && (
                      <button
                        onClick={() => onEditCustomSpread(spread)}
                        className="p-1.5 text-gray-400 hover:text-[#C5A059] hover:bg-[#C5A059]/10 rounded-lg transition-colors"
                        title="Edit Spread"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDeleteCustomSpread && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete custom spread "${spread.title}"?`)) {
                            onDeleteCustomSpread(spread.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete Spread"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {spread.subtitle && (
                  <p className="text-xs text-gray-400 italic line-clamp-1">{spread.subtitle}</p>
                )}

                <div className="text-[10px] text-gray-400 space-y-1 bg-[#0E0E10] p-2.5 rounded-lg border border-[#C5A059]/10">
                  <span className="font-mono uppercase text-[#C5A059] block mb-1">Positions:</span>
                  {spread.positions.slice(0, 3).map((pos, pidx) => (
                    <div key={pidx} className="line-clamp-1">
                      • <strong className="text-gray-300">{pos.name}:</strong> {pos.description}
                    </div>
                  ))}
                  {spread.positions.length > 3 && (
                    <div className="text-gray-500 italic text-[9px] pt-0.5">
                      + {spread.positions.length - 3} more positions
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deck Style Customization */}
      <div className="p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/30 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-[#C5A059]/20 pb-3">
          <Palette className="w-5 h-5 text-[#C5A059]" />
          <h3 className="font-serif text-lg font-bold text-[#D4B97E]">
            Default Deck Aesthetic
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              id: 'classic_gold',
              title: 'Classic Gold',
              desc: 'Warm gold leaf borders & deep twilight velvet canvas.',
              bgClass: 'bg-[#0A0A0C] border-[#C5A059]/80 text-[#D4B97E]',
              badge: '✦ SACRED GOLD'
            },
            {
              id: 'cosmic_night',
              title: 'Cosmic Night',
              desc: 'Deep obsidian backdrop with dark starlight accents.',
              bgClass: 'bg-[#060814] border-purple-400/70 text-purple-200',
              badge: '✦ OBSIDIAN STAR'
            },
            {
              id: 'minimal_artisan',
              title: 'Minimal Artisan',
              desc: 'Crisp geometry, minimal lines, and high contrast typography.',
              bgClass: 'bg-[#121214] border-[#D4B97E]/70 text-gray-200',
              badge: '✦ FINE LINES'
            }
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setDeckStyle(style.id as any)}
              className={`p-4 rounded-xl border text-left space-y-3 transition-all cursor-pointer flex flex-col justify-between ${
                deckStyle === style.id
                  ? 'bg-[#C5A059]/20 border-[#C5A059] text-white shadow-lg glow-gold'
                  : 'bg-[#161618] border-[#C5A059]/20 text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#D4B97E]">
                    {style.title}
                  </span>
                  {deckStyle === style.id && <Check className="w-4 h-4 text-[#C5A059]" />}
                </div>
                <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                  {style.desc}
                </p>
              </div>

              {/* Visual Card Back Mockup */}
              <div className={`w-full h-28 rounded-lg border-2 p-2 flex flex-col items-center justify-center relative overflow-hidden ${style.bgClass}`}>
                <span className="text-[9px] font-mono tracking-widest uppercase opacity-80 mb-1">
                  {style.badge}
                </span>
                <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center relative">
                  <Sparkles className="w-5 h-5 opacity-90" />
                </div>
                <span className="text-[8px] font-mono tracking-widest uppercase opacity-70 mt-1">
                  TAROT DEPTH
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSavePreferences}
            className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center gap-2"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {isSaved ? 'Preferences Saved' : 'Save Preferences'}
          </button>
        </div>
      </div>

      {/* Disclaimer Status */}
      <div className="p-6 rounded-2xl bg-[#0E0E10] border border-[#C5A059]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#D4B97E] font-serif font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            Entertainment & Reflective Disclaimer Status
          </div>
          <p className="text-xs text-gray-400">
            {userProfile?.disclaimerAccepted
              ? 'Accepted on ' + (userProfile.disclaimerAcceptedAt ? new Date(userProfile.disclaimerAcceptedAt).toLocaleDateString() : 'First Visit')
              : 'Pending acceptance'}
          </p>
        </div>

        <button
          onClick={onOpenDisclaimer}
          className="px-4 py-2 rounded-xl bg-[#161618] border border-[#C5A059]/30 text-xs text-[#D4B97E] hover:border-[#C5A059] transition-all"
        >
          Review Disclaimer
        </button>
      </div>
    </div>
  );
};
