import React, { useState } from 'react';
import { TarotReading, UserProfile } from '../types';
import { deleteReading, toggleFavoriteReading } from '../lib/firebase';
import { ShareOptions, shareContent } from '../lib/share';
import { BookOpen, Search, Heart, Trash2, Calendar, Clock, Filter, Tag, ArrowRight, Sparkles, Share2 } from 'lucide-react';

interface JournalViewProps {
  userProfile: UserProfile | null;
  readings: TarotReading[];
  onOpenReadingDetail: (reading: TarotReading) => void;
  onRefreshReadings: () => void;
  onStartNewReading: () => void;
  onOpenShare?: (options: ShareOptions) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  userProfile,
  readings,
  onOpenReadingDetail,
  onRefreshReadings,
  onStartNewReading,
  onOpenShare
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpreadFilter, setSelectedSpreadFilter] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filteredReadings = readings.filter((r) => {
    // Favorite filter
    if (onlyFavorites && !r.isFavorite) return false;

    // Spread filter
    if (selectedSpreadFilter !== 'all' && r.spreadType !== selectedSpreadFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuestion = r.question?.toLowerCase().includes(q);
      const matchSpread = r.spreadTitle?.toLowerCase().includes(q);
      const matchInterpretation = r.aiInterpretation?.toLowerCase().includes(q);
      const matchCards = r.cards?.some((c) => c.name.toLowerCase().includes(q));
      if (!matchQuestion && !matchSpread && !matchInterpretation && !matchCards) return false;
    }

    return true;
  });

  const handleDelete = async (e: React.MouseEvent, readingId: string) => {
    e.stopPropagation();
    if (!userProfile) return;
    if (window.confirm('Are you sure you want to delete this reading from your journal?')) {
      await deleteReading(userProfile.uid, readingId);
      onRefreshReadings();
    }
  };

  const handleToggleFav = async (e: React.MouseEvent, reading: TarotReading) => {
    e.stopPropagation();
    if (!userProfile) return;
    const nextFav = !reading.isFavorite;
    await toggleFavoriteReading(userProfile.uid, reading.id, nextFav);
    onRefreshReadings();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs text-[#f3e5ab] font-mono uppercase tracking-widest mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
            Private Reading Archive
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#f3e5ab]">
            Tarot Journal
          </h1>
          <p className="text-xs text-gray-400 font-light">
            {readings.length} total reflection sessions recorded
          </p>
        </div>

        <button
          onClick={onStartNewReading}
          className="px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg glow-gold flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          New Reading Draw
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-[#12141d] border border-gold-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, cards, or keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0b0c10] border border-gold-subtle text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Spread Filter Dropdown & Favorites Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={selectedSpreadFilter}
            onChange={(e) => setSelectedSpreadFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#0b0c10] border border-gold-subtle text-xs text-[#f3e5ab] focus:outline-none focus:border-[#d4af37]"
          >
            <option value="all">All Spreads</option>
            <option value="single_draw">Daily Focus (1 Card)</option>
            <option value="three_card_time">Past, Present, Future (3 Cards)</option>
            <option value="three_card_mind">Mind, Body, Spirit (3 Cards)</option>
            <option value="crossroads">Crossroads (3 Cards)</option>
            <option value="relationship">Relational Mirror (5 Cards)</option>
            <option value="celtic_cross">Celtic Cross (10 Cards)</option>
          </select>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              onlyFavorites
                ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                : 'bg-[#0b0c10] border-gold-subtle text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Journal Cards List */}
      {filteredReadings.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#12141d] border border-dashed border-gold-subtle text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#d4af37]/40 mx-auto" />
          <h3 className="font-serif-luxury text-lg text-[#f3e5ab]">No Journal Entries Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery || onlyFavorites || selectedSpreadFilter !== 'all'
              ? 'Try adjusting your search or filter parameters.'
              : 'Begin your journey by drawing your first tarot spread.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReadings.map((reading) => (
            <div
              key={reading.id}
              onClick={() => onOpenReadingDetail(reading)}
              className="group cursor-pointer p-6 rounded-2xl bg-[#12141d] border border-gold-subtle hover:border-[#d4af37] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-lg relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header Date & Favorite */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#d4af37] uppercase tracking-wider">
                    {reading.spreadTitle}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const cardSummary = reading.cards?.map(c => `${c.position}: ${c.name} (${c.orientation})`).join(', ') || '';
                        const shareOpts: ShareOptions = {
                          title: `Journal Reading: "${reading.question || reading.spreadTitle}"`,
                          text: `Spread: ${reading.spreadTitle}\nCards: ${cardSummary}\n\nReflection: ${reading.aiInterpretation?.slice(0, 250) || 'Sacred Reflection'}...`,
                          category: 'journal'
                        };
                        if (onOpenShare) {
                          onOpenShare(shareOpts);
                        } else {
                          shareContent(shareOpts);
                        }
                      }}
                      className="p-1 text-gray-500 hover:text-[#d4af37] transition-colors"
                      title="Share reading"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleToggleFav(e, reading)}
                      className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                      title="Toggle favorite"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          reading.isFavorite ? 'fill-rose-400 text-rose-400' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, reading.id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete reading"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <h3 className="font-serif-luxury text-lg font-bold text-[#f3e5ab] group-hover:text-white transition-colors line-clamp-2">
                  "{reading.question}"
                </h3>

                {/* Drawn Cards Preview */}
                <div className="flex flex-wrap gap-1.5">
                  {reading.cards?.map((c, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#0b0c10] border border-gold-subtle/50 text-gray-300 font-mono"
                    >
                      {c.name} ({c.orientation === 'upright' ? '↑' : '↓'})
                    </span>
                  ))}
                </div>

                {/* Snippet */}
                <p className="text-xs text-gray-400 line-clamp-3 font-light leading-relaxed">
                  {reading.aiInterpretation?.replace(/###/g, '') || 'No text snippet available.'}
                </p>
              </div>

              {/* Bottom Footer */}
              <div className="pt-4 mt-4 border-t border-gold-subtle/50 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-[#d4af37]" />
                  {new Date(reading.createdAt).toLocaleDateString()}
                </span>
                <span className="text-[#d4af37] font-semibold flex items-center gap-1 group-hover:underline">
                  Full Reading <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
