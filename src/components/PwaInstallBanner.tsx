import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Sparkles, Check } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Before Install Prompt Listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user hasn't dismissed before
      const dismissed = localStorage.getItem('tarot_depth_pwa_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    // Online / Offline Listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // App Installed Listener
    window.addEventListener('appinstalled', () => {
      setShowInstallBanner(false);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 4000);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted PWA installation');
    }
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('tarot_depth_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* Offline Alert Indicator */}
      {isOffline && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md p-3 rounded-2xl bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs font-mono shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md animate-fade-in">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Working Offline — Cached journal & deck remain accessible</span>
          </div>
        </div>
      )}

      {/* Installed Confirmation Toast */}
      {installedSuccess && (
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-mono shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Tarot Depth successfully installed to your device!</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && deferredPrompt && (
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg p-4 rounded-2xl bg-tarot-card-bg border border-[#C5A059]/40 shadow-2xl backdrop-blur-xl animate-fade-in flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center shrink-0 text-[#C5A059]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-serif text-xs font-bold text-[#E5E5E5]">
                Add Tarot Depth App
              </h4>
              <p className="text-[11px] text-gray-400 font-light">
                Install for offline access & full-screen mobile sanctuary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-md min-h-[40px] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 active:bg-white/10 transition-all min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
