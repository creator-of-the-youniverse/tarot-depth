import React, { useState } from 'react';
import { X, Share2, Copy, Check, Sparkles, MessageCircle, Twitter, Mail, Send } from 'lucide-react';
import { ShareOptions, shareContent } from '../lib/share';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: ShareOptions | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, options }) => {
  const [copied, setCopied] = useState(false);
  const [nativeShared, setNativeShared] = useState(false);

  if (!isOpen || !options) return null;

  const currentUrl = options.url || window.location.href;
  const formattedShareText = `${options.title}\n\n"${options.text}"\n\n✨ Tarot Depth Sacred Sanctuary: ${currentUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    const res = await shareContent(options);
    if (res.shared) {
      setNativeShared(true);
      setTimeout(() => {
        setNativeShared(false);
        onClose();
      }, 1500);
    } else if (res.copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${options.title}\n\n"${options.text.slice(0, 180)}..."\n\n✨ Tarot Depth`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const waText = encodeURIComponent(`${options.title}\n\n"${options.text}"\n\n✨ Tarot Depth: ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Tarot Reflection: ${options.title}`);
    const body = encodeURIComponent(`${options.title}\n\n${options.text}\n\nShared from Tarot Depth Sacred Sanctuary: ${currentUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0A0A0B] border border-[#C5A059]/40 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative glow-gold overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-[#C5A059] hover:bg-white/5 transition-all cursor-pointer"
          title="Close Share Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-[#161618] border border-[#C5A059]/40 flex items-center justify-center mx-auto glow-gold text-[#C5A059]">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold tracking-wider text-[#D4B97E] uppercase">
            Share Sacred Arcana
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Pass along this reflection, daily affirmation, or card wisdom to fellow seekers.
          </p>
        </div>

        {/* Preview Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#161618] via-[#0E0E10] to-[#12100C] border border-[#C5A059]/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#C5A059] uppercase tracking-widest border-b border-[#C5A059]/15 pb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              {options.category ? options.category.toUpperCase() : 'TAROT WISDOM'}
            </span>
            <span>TAROT DEPTH SANCTUARY</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-[#E5E5E5] leading-snug">
            {options.title}
          </h3>

          <p className="font-serif italic text-sm text-[#F3E5AB] leading-relaxed line-clamp-4">
            "{options.text}"
          </p>

          <div className="pt-2 text-[10px] font-mono text-gray-400 text-right">
            ✨ {currentUrl}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="py-3 px-4 rounded-xl bg-[#161618] border border-[#C5A059]/40 text-[#D4B97E] font-semibold text-xs tracking-wider uppercase hover:border-[#C5A059] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#C5A059]" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            {/* Native Share Button */}
            <button
              onClick={handleNativeShare}
              className="py-3 px-4 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 glow-gold cursor-pointer"
            >
              {nativeShared ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Shared!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-black" />
                  <span>Share App</span>
                </>
              )}
            </button>
          </div>

          {/* Social Quick Share Grid */}
          <div className="pt-2 border-t border-[#C5A059]/20 flex items-center justify-center gap-3 text-xs text-gray-400">
            <span className="font-mono text-[10px] uppercase text-gray-500 mr-1">Direct Share:</span>

            <button
              onClick={handleTwitterShare}
              className="p-2.5 rounded-xl bg-[#141622] border border-[#C5A059]/20 text-gray-300 hover:text-[#C5A059] hover:border-[#C5A059] transition-all cursor-pointer"
              title="Share on X / Twitter"
            >
              <Twitter className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="p-2.5 rounded-xl bg-[#141622] border border-[#C5A059]/20 text-gray-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all cursor-pointer"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              onClick={handleEmailShare}
              className="p-2.5 rounded-xl bg-[#141622] border border-[#C5A059]/20 text-gray-300 hover:text-[#D4B97E] hover:border-[#C5A059] transition-all cursor-pointer"
              title="Share via Email"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
