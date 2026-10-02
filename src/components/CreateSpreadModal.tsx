import React, { useState, useEffect } from 'react';
import { CustomSpread, CustomPosition } from '../types';
import { X, Plus, Trash2, Sparkles, Layers, Sliders, Layout, Tag, HelpCircle } from 'lucide-react';

interface CreateSpreadModalProps {
  isOpen: boolean;
  editingSpread?: CustomSpread | null;
  onClose: () => void;
  onSave: (spread: {
    title: string;
    subtitle: string;
    description: string;
    cardCount: number;
    positions: CustomPosition[];
    recommendedFor: string;
  }) => Promise<void>;
}

const TEMPLATES = [
  {
    title: '3-Card Mind Body Spirit',
    subtitle: 'A holistic alignment check across mental, physical, and spiritual realms.',
    cardCount: 3,
    recommendedFor: 'Daily Balance & Self-Check',
    positions: [
      { name: 'Mind', description: 'Mental clarity, thoughts, and cognitive focus', keywords: ['Clarity', 'Thoughts'] },
      { name: 'Body', description: 'Physical sensation, environment, and grounded action', keywords: ['Grounded', 'Action'] },
      { name: 'Spirit', description: 'Intuitive insight, soul lesson, and higher purpose', keywords: ['Soul', 'Wisdom'] }
    ]
  },
  {
    title: '4-Card Elemental Compass',
    subtitle: 'Navigating situations through Fire, Water, Air, and Earth energies.',
    cardCount: 4,
    recommendedFor: 'Complex Decisions & Strategy',
    positions: [
      { name: 'Fire (Passion & Action)', description: 'What drives your desire and immediate momentum', keywords: ['Willpower', 'Spark'] },
      { name: 'Water (Emotion & Heart)', description: 'Emotional resonance, feelings, and intuition', keywords: ['Feeling', 'Flow'] },
      { name: 'Air (Mind & Truth)', description: 'Strategic perspective, communications, and truths', keywords: ['Logic', 'Truth'] },
      { name: 'Earth (Reality & Manifestation)', description: 'Tangible resources, material constraints, and grounding', keywords: ['Structure', 'Result'] }
    ]
  },
  {
    title: '5-Card Decision Crossroads',
    subtitle: 'Compare two paths or evaluate root causes and future outcomes.',
    cardCount: 5,
    recommendedFor: 'Choice & Path Evaluation',
    positions: [
      { name: 'Core Situation', description: 'The focal point and present state', keywords: ['Heart', 'Center'] },
      { name: 'Option A Potential', description: 'Energy & trajectory if taking Path A', keywords: ['Path A'] },
      { name: 'Option B Potential', description: 'Energy & trajectory if taking Path B', keywords: ['Path B'] },
      { name: 'Hidden Factor', description: 'What is unseen or influencing behind the scenes', keywords: ['Shadow', 'Unseen'] },
      { name: 'Integration Advice', description: 'Optimal wisdom for synthesizing your choice', keywords: ['Wisdom', 'Choice'] }
    ]
  }
];

export const CreateSpreadModal: React.FC<CreateSpreadModalProps> = ({
  isOpen,
  editingSpread,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [recommendedFor, setRecommendedFor] = useState('');
  const [cardCount, setCardCount] = useState(3);
  const [positions, setPositions] = useState<CustomPosition[]>([
    { name: 'Position 1: Current State', description: 'What is happening right now', keywords: ['Present'] },
    { name: 'Position 2: Core Obstacle', description: 'What blocks your energy', keywords: ['Challenge'] },
    { name: 'Position 3: Guidance', description: 'Recommended focus or outcome', keywords: ['Advice'] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingSpread) {
      setTitle(editingSpread.title || '');
      setSubtitle(editingSpread.subtitle || '');
      setDescription(editingSpread.description || '');
      setRecommendedFor(editingSpread.recommendedFor || '');
      setCardCount(editingSpread.cardCount || editingSpread.positions.length || 3);
      setPositions(editingSpread.positions || []);
    } else {
      resetForm();
    }
  }, [editingSpread, isOpen]);

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setDescription('');
    setRecommendedFor('Personal Reflections');
    setCardCount(3);
    setPositions([
      { name: 'Position 1: Foundation', description: 'The root or background context', keywords: ['Root'] },
      { name: 'Position 2: Present Focus', description: 'Where energy is concentrated now', keywords: ['Focus'] },
      { name: 'Position 3: Potential Outcome', description: 'The natural trajectory', keywords: ['Future'] }
    ]);
    setError(null);
  };

  const handleCardCountChange = (newCount: number) => {
    if (newCount < 1 || newCount > 10) return;
    setCardCount(newCount);

    setPositions(prev => {
      const updated = [...prev];
      if (newCount > updated.length) {
        for (let i = updated.length; i < newCount; i++) {
          updated.push({
            name: `Position ${i + 1}`,
            description: `Focus or question for card ${i + 1}`,
            keywords: []
          });
        }
      } else if (newCount < updated.length) {
        return updated.slice(0, newCount);
      }
      return updated;
    });
  };

  const handlePositionChange = (index: number, field: keyof CustomPosition, value: any) => {
    setPositions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setTitle(tpl.title);
    setSubtitle(tpl.subtitle);
    setDescription(`Custom spread based on ${tpl.title}.`);
    setRecommendedFor(tpl.recommendedFor);
    setCardCount(tpl.cardCount);
    setPositions(tpl.positions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a spread title.');
      return;
    }
    for (let i = 0; i < positions.length; i++) {
      if (!positions[i].name.trim()) {
        setError(`Please enter a name for Position ${i + 1}.`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        title: title.trim(),
        subtitle: subtitle.trim() || `${cardCount}-card custom reflection spread`,
        description: description.trim() || 'A personal custom tarot spread created in Tarot Depth.',
        cardCount,
        positions,
        recommendedFor: recommendedFor.trim() || 'Custom Reflections'
      });
      onClose();
    } catch (err: any) {
      console.error('Error saving spread:', err);
      setError(err.message || 'Failed to save custom spread.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0E0E10] border border-[#C5A059]/30 rounded-2xl shadow-2xl flex flex-col my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#C5A059]/20 bg-[#161618]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#D4B97E] tracking-wider uppercase">
                {editingSpread ? 'Edit Custom Spread' : 'Create Custom Tarot Spread'}
              </h2>
              <p className="text-[11px] text-gray-400 font-light">
                Define positions, card counts, and intentions stored securely in your profile.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#C5A059]/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-xs">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Templates Quick bar */}
          {!editingSpread && (
            <div className="p-4 rounded-xl bg-[#161618] border border-[#C5A059]/20 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold block">
                Quick Start Templates
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="p-3 rounded-lg bg-[#0E0E10] border border-[#C5A059]/20 hover:border-[#C5A059] text-left transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-[#E5E5E5] group-hover:text-[#D4B97E] text-xs">
                        {tpl.title}
                      </span>
                      <span className="text-[9px] font-mono text-[#C5A059] px-1.5 py-0.5 rounded bg-[#C5A059]/10">
                        {tpl.cardCount} cards
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{tpl.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form id="custom-spread-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  Spread Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Monthly Alignment Spread"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161618] border border-[#C5A059]/20 text-gray-200 focus:outline-none focus:border-[#C5A059] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  Brief Subtitle / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g., Evaluating goals, momentum, and inner roadblocks"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161618] border border-[#C5A059]/20 text-gray-200 focus:outline-none focus:border-[#C5A059] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  Recommended Category / Intent
                </label>
                <input
                  type="text"
                  placeholder="e.g., Career, Creative Projects, Relationship"
                  value={recommendedFor}
                  onChange={(e) => setRecommendedFor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161618] border border-[#C5A059]/20 text-gray-200 focus:outline-none focus:border-[#C5A059] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  Number of Cards (1 - 10)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#161618] p-1.5 rounded-xl border border-[#C5A059]/20 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleCardCountChange(num)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          cardCount === num
                            ? 'bg-[#C5A059] text-black shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-[#C5A059]/10'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                Detailed Description & Guidance Notes
              </label>
              <textarea
                rows={2}
                placeholder="Explain the underlying intention, background philosophy, or how best to approach this spread..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161618] border border-[#C5A059]/20 text-gray-200 focus:outline-none focus:border-[#C5A059] transition-all resize-none"
              />
            </div>

            {/* Position Configurator */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4B97E] font-serif font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#C5A059]" />
                  Card Positions Definition ({positions.length} Positions)
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Configure names, intentions, & keywords per position
                </span>
              </div>

              <div className="space-y-3">
                {positions.map((pos, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#161618] border border-[#C5A059]/20 space-y-3 relative group hover:border-[#C5A059]/40 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#C5A059]/20 text-[#D4B97E] font-serif font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          required
                          placeholder={`Position ${idx + 1} Title (e.g. Current Reality)`}
                          value={pos.name}
                          onChange={(e) => handlePositionChange(idx, 'name', e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-[#0E0E10] border border-[#C5A059]/30 text-gray-200 font-serif font-semibold text-xs focus:outline-none focus:border-[#C5A059] w-64 sm:w-80"
                        />
                      </div>

                      {positions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (positions.length <= 1) return;
                            setCardCount(positions.length - 1);
                            setPositions(positions.filter((_, i) => i !== idx));
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Remove position"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-8">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-gray-400 font-mono">
                          Position Meaning / Intention
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. What force or mindset is currently dominant..."
                          value={pos.description}
                          onChange={(e) => handlePositionChange(idx, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0E0E10] border border-[#C5A059]/20 text-gray-300 text-xs focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#C5A059]" />
                          Keywords (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mind, Focus, Root"
                          value={pos.keywords ? pos.keywords.join(', ') : ''}
                          onChange={(e) => {
                            const kwList = e.target.value
                              .split(',')
                              .map(k => k.trim())
                              .filter(Boolean);
                            handlePositionChange(idx, 'keywords', kwList);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0E0E10] border border-[#C5A059]/20 text-gray-300 text-xs focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Spread Visual Layout Preview */}
            <div className="p-4 rounded-xl bg-[#0E0E10] border border-[#C5A059]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Live Spread Visual Preview
                </span>
                <span className="text-[9px] font-mono text-gray-500">
                  Interactive Card Stage Rendering
                </span>
              </div>

              <div className="p-6 rounded-xl bg-[radial-gradient(circle_at_50%_50%,_#1A1A1D_0%,_#0A0A0B_100%)] border border-[#C5A059]/10 flex flex-wrap items-center justify-center gap-4 min-h-[160px]">
                {positions.map((pos, i) => (
                  <div
                    key={i}
                    className="w-28 h-40 rounded-lg bg-[#161618] border border-[#C5A059]/40 shadow-lg p-2.5 flex flex-col justify-between text-center transform hover:scale-105 transition-transform"
                  >
                    <div className="text-[10px] font-serif font-bold text-[#C5A059]">
                      #{i + 1}
                    </div>
                    <div className="space-y-1 my-auto">
                      <p className="font-serif text-xs font-bold text-[#E5E5E5] line-clamp-2">
                        {pos.name || `Card ${i + 1}`}
                      </p>
                      {pos.keywords && pos.keywords.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1">
                          {pos.keywords.slice(0, 2).map((kw, kidx) => (
                            <span key={kidx} className="text-[8px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-tighter">
                      Tarot Depth
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#C5A059]/20 bg-[#161618] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="custom-spread-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-lg glow-gold disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isSubmitting ? 'Saving Spread...' : editingSpread ? 'Update Custom Spread' : 'Save Custom Spread'}
          </button>
        </div>

      </div>
    </div>
  );
};
