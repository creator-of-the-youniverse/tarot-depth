import React, { useState } from 'react';
import { X, Sparkles, User, LogIn, LogOut, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { auth, signInWithPopup, googleProvider, signInAnonymously, signOut, User as FirebaseUser } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err?.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      onClose();
    } catch (err: any) {
      console.error('Anonymous Sign-In Error:', err);
      setError(err?.message || 'Failed to sign in as guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      onClose();
    } catch (err: any) {
      console.error('Sign-Out Error:', err);
      setError(err?.message || 'Failed to sign out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0A0A0B] border border-[#C5A059]/40 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl relative glow-gold">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-[#C5A059] hover:bg-white/5 transition-all"
          title="Close Auth Window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-full bg-[#161618] border border-[#C5A059]/40 flex items-center justify-center mx-auto glow-gold">
            <Sparkles className="w-6 h-6 text-[#C5A059]" />
          </div>
          <h2 className="font-serif text-xl font-bold tracking-wider text-[#D4B97E]">
            {currentUser ? 'Sanctuary Account' : 'Sign In to Tarot Depth'}
          </h2>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            {currentUser
              ? 'Your symbolic journal and readings are synchronized with Google Cloud Firestore.'
              : 'Sign in to sync your tarot readings, custom spreads, personal notes, and symbolic pattern analytics across devices.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="line-clamp-2">{error}</span>
          </div>
        )}

        {/* Signed In View vs Signed Out Actions */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#12141d] border border-[#C5A059]/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center font-bold text-[#F3E5AB] uppercase">
                  {currentUser.displayName ? currentUser.displayName.slice(0, 2) : currentUser.isAnonymous ? 'AN' : 'US'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-sm font-bold text-[#E5E5E5] truncate">
                    {currentUser.displayName || (currentUser.isAnonymous ? 'Anonymous Seeker' : 'Authenticated Seeker')}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-mono truncate">
                    {currentUser.email || (currentUser.isAnonymous ? 'Guest Account (Transient Session)' : currentUser.uid)}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#C5A059]/15 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cloud Sync Active (Firestore)</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/50 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{loading ? 'Signing Out...' : 'Sign Out of Sanctuary'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Primary Google Auth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2.5 glow-gold cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
              </svg>
              <span>{loading ? 'Connecting...' : 'Sign In with Google'}</span>
            </button>

            {/* Guest / Anonymous Auth */}
            <button
              onClick={handleAnonymousSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#141622] border border-[#C5A059]/30 text-[#D4B97E] hover:border-[#C5A059] font-medium text-xs tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-[#C5A059]" />
              <span>Continue as Anonymous Guest</span>
            </button>

            <div className="pt-2 text-[10px] text-gray-500 text-center font-mono space-y-1">
              <p className="flex items-center justify-center gap-1 text-[#C5A059]/80">
                <ShieldCheck className="w-3 h-3" />
                <span>Encrypted session powered by Firebase Auth</span>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
