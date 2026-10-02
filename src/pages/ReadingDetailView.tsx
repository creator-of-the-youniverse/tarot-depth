import React, { useState, useEffect } from 'react';
import { TarotReading, ReadingNote, UserProfile } from '../types';
import { getReadingNotes, addReadingNote, toggleFavoriteReading, deleteReading } from '../lib/firebase';
import { ShareOptions, shareContent } from '../lib/share';
import { ArrowLeft, Sparkles, BookOpen, Heart, Trash2, Calendar, Share2, Check, MessageSquare, Plus } from 'lucide-react';

interface ReadingDetailViewProps {
  userProfile: UserProfile | null;
  reading: TarotReading;
  onBack: () => void;
  onRefreshReadings: () => void;
  onOpenShare?: (options: ShareOptions) => void;
}

export const ReadingDetailView: React.FC<ReadingDetailViewProps> = ({
  userProfile,
  reading,
  onBack,
  onRefreshReadings,
  onOpenShare
}) => {
  const [notes, setNotes] = useState<ReadingNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isFavorite, setIsFavorite] = useState(reading.isFavorite || false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (userProfile && reading.id) {
      loadNotes();
    }
  }, [userProfile, reading.id]);

  const loadNotes = async () => {
    if (!userProfile) return;
    const list = await getReadingNotes(userProfile.uid, reading.id);
    setNotes(list);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !newNoteText.trim()) return;
    await addReadingNote(userProfile.uid, reading.id, newNoteText.trim());
    setNewNoteText('');
    await loadNotes();
  };

  const handleToggleFav = async () => {
    if (!userProfile) return;
    const nextFav = !isFavorite;
    setIsFavorite(nextFav);
    await toggleFavoriteReading(userProfile.uid, reading.id, nextFav);
    onRefreshReadings();
  };

  const handleDeleteReading = async () => {
    if (!userProfile) return;
    if (window.confirm('Are you sure you want to delete this reading from your journal?')) {
      await deleteReading(userProfile.uid, reading.id);
      onRefreshReadings();
      onBack();
    }
  };

  const handleShare = () => {
    const cardSummary = reading.cards?.map(c => `${c.position}: ${c.name} (${c.orientation})`).join('\n') || '';
    const shareOpts: ShareOptions = {
      title: `Tarot Reading: "${reading.question || reading.spreadTitle}"`,
      text: `Spread: ${reading.spreadTitle}\nDate: ${new Date(reading.createdAt).toLocaleDateString()}\n\nCards Drawn:\n${cardSummary}\n\nInterpretation:\n${reading.aiInterpretation.slice(0, 300)}...`,
      category: 'reading'
    };

    if (onOpenShare) {
      onOpenShare(shareOpts);
    } else {
      shareContent(shareOpts);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journal History
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFav}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${
              isFavorite
                ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                : 'bg-[#12141d] border-gold-subtle text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-[#12141d] border border-gold-subtle text-xs text-gray-300 hover:text-[#d4af37] hover:border-[#d4af37] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handleDeleteReading}
            className="p-2 rounded-lg bg-red-950/30 border border-red-500/40 text-xs text-red-300 hover:bg-red-900/50 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="p-6 rounded-2xl bg-[#12141d] border border-gold-glow space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#d4af37] uppercase">{reading.spreadTitle}</span>
          <span className="text-gray-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            {new Date(reading.createdAt).toLocaleString()}
          </span>
        </div>

        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f3e5ab]">
          "{reading.question}"
        </h1>

        <div className="flex flex-wrap gap-2 pt-2">
          {reading.cards?.map((c, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#0b0c10] border border-gold-subtle text-[#f3e5ab] font-mono"
            >
              <strong>{c.position}:</strong> {c.name} ({c.orientation})
            </span>
          ))}
        </div>
      </div>

      {/* AI Interpretation Breakdown */}
      <section className="bg-[#12141d] p-6 sm:p-8 rounded-2xl border border-gold-subtle space-y-6">
        <div className="flex items-center gap-2 border-b border-gold-subtle pb-3">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <h2 className="font-serif-luxury text-xl font-bold text-[#f3e5ab]">
            Symbolic Interpretation
          </h2>
        </div>

        <div className="space-y-4 text-gray-200 text-sm leading-relaxed">
          {reading.aiInterpretation?.split('### ').map((section, idx) => {
            if (!section.trim()) return null;
            const lines = section.trim().split('\n');
            const title = lines[0];
            const content = lines.slice(1).join('\n');

            return (
              <div key={idx} className="p-4 rounded-xl bg-[#0b0c10] border border-gold-subtle space-y-2">
                <h3 className="font-serif-luxury text-base font-bold text-[#f3e5ab] border-b border-gold-subtle/30 pb-1">
                  {title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm whitespace-pre-line font-light">
                  {content}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Private Notes & Reflections Timeline */}
      <section className="bg-[#12141d] p-6 sm:p-8 rounded-2xl border border-gold-subtle space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#d4af37]" />
          <h2 className="font-serif-luxury text-xl font-bold text-[#f3e5ab]">
            Reflection Notes Timeline ({notes.length})
          </h2>
        </div>

        {/* Add note form */}
        <form onSubmit={handleAddNote} className="space-y-3">
          <textarea
            rows={3}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Add an ongoing personal reflection note as this situation evolves over time..."
            className="w-full p-3 rounded-xl bg-[#0b0c10] border border-gold-subtle text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newNoteText.trim()}
              className="px-4 py-2 rounded-lg bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:brightness-110 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Timeline Note
            </button>
          </div>
        </form>

        {/* Existing notes list */}
        <div className="space-y-3 pt-2">
          {notes.map((n) => (
            <div key={n.id} className="p-4 rounded-xl bg-[#0b0c10] border border-gold-subtle/60 space-y-1">
              <span className="text-[10px] font-mono text-[#d4af37] block">
                {new Date(n.createdAt).toLocaleString()}
              </span>
              <p className="text-xs text-gray-200 leading-relaxed font-light">{n.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
