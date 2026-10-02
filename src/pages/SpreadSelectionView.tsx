import React, { useState } from 'react';
import { SPREADS } from '../data/tarotDeck';
import { SpreadDefinition, CustomSpread } from '../types';
import { Sparkles, Layers, ArrowRight, Plus, Edit2, Trash2, Tag, Compass } from 'lucide-react';

interface SpreadSelectionViewProps {
  customSpreads?: CustomSpread[];
  onSelectSpread: (spread: SpreadDefinition) => void;
  onCreateCustomSpread?: () => void;
  onEditCustomSpread?: (spread: CustomSpread) => void;
  onDeleteCustomSpread?: (spreadId: string) => void;
}

export const SpreadSelectionView: React.FC<SpreadSelectionViewProps> = ({
  customSpreads = [],
  onSelectSpread,
  onCreateCustomSpread,
  onEditCustomSpread,
  onDeleteCustomSpread
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'classic' | 'custom'>('all');

  // Convert custom spreads into SpreadDefinition structure
  const formattedCustomSpreads: SpreadDefinition[] = customSpreads.map(cs => ({
    id: cs.id,
    title: cs.title,
    subtitle: cs.subtitle,
    description: cs.description,
    cardCount: cs.cardCount,
    positions: cs.positions,
    recommendedFor: cs.recommendedFor || 'Custom Reflection',
    badge: 'Custom Spread',
    isCustom: true,
    customSpreadId: cs.id
  }));

  const allSpreads = [...formattedCustomSpreads, ...SPREADS];

  const displayedSpreads =
    filterTab === 'classic'
      ? SPREADS
      : filterTab === 'custom'
      ? formattedCustomSpreads
      : allSpreads;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs text-[#D4B97E] font-mono uppercase tracking-[0.2em]">
          <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
          Choose Your Geometry
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#E5E5E5] tracking-wide">
          Select or Design a Tarot Spread
        </h1>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Choose from classic spread geometries or create your own custom card arrangements with tailored positions and intentions.
        </p>
      </div>

      {/* Filter Tabs & Create Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#C5A059]/20 pb-4">
        <div className="flex items-center gap-2 bg-[#0E0E10] p-1.5 rounded-xl border border-[#C5A059]/20 w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              filterTab === 'all'
                ? 'bg-[#C5A059] text-black font-bold shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#C5A059]/10'
            }`}
          >
            All ({allSpreads.length})
          </button>
          <button
            onClick={() => setFilterTab('classic')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              filterTab === 'classic'
                ? 'bg-[#C5A059] text-black font-bold shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#C5A059]/10'
            }`}
          >
            Classic ({SPREADS.length})
          </button>
          <button
            onClick={() => setFilterTab('custom')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              filterTab === 'custom'
                ? 'bg-[#C5A059] text-black font-bold shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#C5A059]/10'
            }`}
          >
            My Custom ({formattedCustomSpreads.length})
          </button>
        </div>

        {onCreateCustomSpread && (
          <button
            onClick={onCreateCustomSpread}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg glow-gold"
          >
            <Plus className="w-4 h-4" />
            Create Custom Spread
          </button>
        )}
      </div>

      {/* Spreads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Create Card Prompt if in Custom view and no spreads */}
        {filterTab === 'custom' && formattedCustomSpreads.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl bg-[#0E0E10] border border-dashed border-[#C5A059]/30 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mx-auto text-[#C5A059]">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#E5E5E5]">No Custom Spreads Created Yet</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Design custom spread layouts tailored to your unique inquiry topics, card position questions, and focus keywords.
              </p>
            </div>
            {onCreateCustomSpread && (
              <button
                onClick={onCreateCustomSpread}
                className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all inline-flex items-center gap-2 shadow-lg glow-gold"
              >
                <Plus className="w-4 h-4" />
                Create First Custom Spread
              </button>
            )}
          </div>
        )}

        {displayedSpreads.map((spread) => {
          const rawCustom = customSpreads.find(cs => cs.id === spread.customSpreadId);

          return (
            <div
              key={spread.id}
              className={`group rounded-2xl bg-[#0E0E10] border ${
                spread.isCustom ? 'border-[#C5A059]/50 shadow-[0_0_20px_rgba(197,160,89,0.12)]' : 'border-[#C5A059]/20'
              } hover:border-[#C5A059] p-6 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl hover:shadow-2xl relative overflow-hidden`}
            >
              {/* Badge & Custom Actions */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider bg-[#C5A059]/10 px-2.5 py-1 rounded-md border border-[#C5A059]/20">
                  {spread.cardCount} {spread.cardCount === 1 ? 'Card' : 'Cards'} Draw
                </span>

                <div className="flex items-center gap-2">
                  {spread.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#D4B97E] text-[10px] font-mono uppercase tracking-wider">
                      {spread.badge}
                    </span>
                  )}

                  {spread.isCustom && rawCustom && (
                    <div className="flex items-center gap-1 z-10">
                      {onEditCustomSpread && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCustomSpread(rawCustom);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#C5A059] hover:bg-[#C5A059]/10 rounded-lg transition-colors"
                          title="Edit Custom Spread"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteCustomSpread && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete custom spread "${spread.title}"?`)) {
                              onDeleteCustomSpread(rawCustom.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Delete Custom Spread"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Header */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#E5E5E5] group-hover:text-[#D4B97E] transition-colors">
                    {spread.title}
                  </h3>
                  <p className="text-xs text-[#C5A059] italic mt-0.5">
                    {spread.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {spread.description}
                </p>

                {/* Position Preview */}
                <div className="space-y-2 pt-3 border-t border-[#C5A059]/20">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block tracking-wider">
                    Positions in Spread:
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {spread.positions.map((pos, idx) => (
                      <div key={idx} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                        <span className="text-[#C5A059] font-bold">•</span>
                        <div>
                          <strong className="text-[#E5E5E5]">{pos.name}:</strong>{' '}
                          <span className="text-gray-400">{pos.description}</span>
                          {pos.keywords && pos.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {pos.keywords.map((kw, kidx) => (
                                <span key={kidx} className="text-[9px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended for */}
                <div className="text-[11px] text-gray-400 bg-[#161618] p-2.5 rounded-xl border border-[#C5A059]/20">
                  <strong className="text-[#D4B97E]">Best for:</strong> {spread.recommendedFor}
                </div>
              </div>

              {/* Select CTA */}
              <div className="pt-6">
                <button
                  onClick={() => onSelectSpread(spread)}
                  className="w-full py-2.5 rounded-xl bg-[#161618] border border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-gold-gradient hover:text-black text-[#D4B97E] font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 group-hover:glow-gold"
                >
                  <span>Select This Spread</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
