import React, { useState } from 'react';
import { ShieldAlert, Sparkles, Check } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose?: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onAccept,
  onClose
}) => {
  const [checked, setChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141d] border border-gold-glow rounded-2xl max-w-lg w-full p-6 sm:p-8 relative text-gray-200 shadow-2xl space-y-6">
        {/* Header Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#f3e5ab]">
              Reflective Tarot Notice
            </h2>
            <p className="text-xs text-[#d4af37]/80 uppercase tracking-wider font-mono">
              Entertainment & Mindfulness Framework
            </p>
          </div>
        </div>

        {/* Disclaimer Body */}
        <div className="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#0b0c10] p-4 rounded-xl border border-gold-subtle max-h-60 overflow-y-auto">
          <p>
            Welcome to <strong className="text-[#f3e5ab]">Tarot Depth</strong>. This application is crafted strictly as a personal mirror for self-reflection, mindfulness, creative brainstorming, and entertainment.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
            <li>
              <strong className="text-white">Non-Predictive Symbolism:</strong> Tarot readings are symbolic representations, not certain predictions or prophecies of future outcomes.
            </li>
            <li>
              <strong className="text-white">No Professional Advice:</strong> Readings do NOT constitute medical, mental health, legal, financial, or emergency guidance. Always consult licensed professionals for health, financial, or legal matters.
            </li>
            <li>
              <strong className="text-white">Personal Agency:</strong> You retain complete free will, agency, and responsibility over your choices, actions, and decisions at all times.
            </li>
          </ul>
        </div>

        {/* Acceptance Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 rounded border-gold-subtle bg-[#0b0c10] text-[#d4af37] focus:ring-[#d4af37]"
          />
          <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
            I understand and accept that Tarot Depth is for reflection and entertainment only, and does not replace professional guidance.
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gold-subtle text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Close
            </button>
          )}
          <button
            disabled={!checked}
            onClick={onAccept}
            className={`px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 ${
              checked
                ? 'bg-gold-gradient text-black hover:brightness-110 shadow-lg glow-gold'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            Enter Tarot Depth
          </button>
        </div>
      </div>
    </div>
  );
};
