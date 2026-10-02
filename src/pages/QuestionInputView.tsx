import React, { useState } from 'react';
import { SpreadDefinition, MoodType } from '../types';
import { MOODS } from '../data/tarotDeck';
import { HelpCircle, Sparkles, ArrowRight, ArrowLeft, Tag } from 'lucide-react';

interface QuestionInputViewProps {
  spread: SpreadDefinition;
  onBack: () => void;
  onSubmitQuestion: (data: {
    question: string;
    mood: MoodType;
    tags: string[];
    notes: string;
  }) => void;
}

const PRESET_TAGS = ['Personal Growth', 'Relationships & Love', 'Career & Purpose', 'Decision & Crossroads', 'Creative Block', 'Daily Intention'];

export const QuestionInputView: React.FC<QuestionInputViewProps> = ({
  spread,
  onBack,
  onSubmitQuestion
}) => {
  const [question, setQuestion] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType>('seeking_clarity');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Personal Growth']);
  const [notes, setNotes] = useState('');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitQuestion({
      question: question.trim() || 'General check-in & symbolic reflection',
      mood: selectedMood,
      tags: selectedTags,
      notes: notes.trim()
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Spread Selection
        </button>

        <span className="text-xs font-mono text-[#d4af37] px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
          Spread: {spread.title} ({spread.cardCount} Cards)
        </span>
      </div>

      <div className="text-center space-y-2">
        <h1 className="font-serif-luxury text-3xl font-bold text-[#f3e5ab]">
          Formulate Your Intent
        </h1>
        <p className="text-xs text-gray-400 max-w-lg mx-auto">
          Frame your question as an open door for reflection rather than a yes/no demand.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#12141d] border border-gold-glow space-y-6 shadow-2xl">
        {/* Question / Inquiry Input */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-mono tracking-wider text-[#d4af37]">
            What is your question or topic of inquiry?
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How can I best navigate this creative transition?"
            className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-gold-subtle text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-all"
          />
          <p className="text-[11px] text-gray-400 italic">
            Tip: Open-ended questions starting with "How", "What", or "Where" invite deeper symbolic insights.
          </p>
        </div>

        {/* Mood / Mindset Selector */}
        <div className="space-y-3">
          <label className="block text-xs uppercase font-mono tracking-wider text-[#d4af37]">
            What is your current emotional posture?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {MOODS.map((m) => (
              <button
                key={m.type}
                type="button"
                onClick={() => setSelectedMood(m.type)}
                className={`p-2.5 rounded-xl text-left border text-xs transition-all flex flex-col justify-between h-20 ${
                  selectedMood === m.type
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-white glow-gold'
                    : 'bg-[#0b0c10] border-gold-subtle text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{m.icon}</span>
                  {selectedMood === m.type && <span className="text-[#d4af37] text-xs">✓</span>}
                </div>
                <span className="font-medium text-[11px] leading-tight block">
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Topic Tags */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-mono tracking-wider text-[#d4af37]">
            Focus Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 min-h-[38px] active:scale-95 cursor-pointer ${
                  selectedTags.includes(tag)
                    ? 'bg-[#d4af37] text-black font-semibold shadow-sm'
                    : 'bg-[#0b0c10] text-gray-400 border border-gold-subtle hover:text-white'
                }`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Context / Notes */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-mono tracking-wider text-[#d4af37]">
            Additional Context (Optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write any background thoughts or specific details you wish to bring into this reading session..."
            className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-gold-subtle text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-all resize-none"
          />
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gold-gradient text-black font-bold text-xs tracking-wider uppercase hover:brightness-110 active:scale-[0.98] transition-all shadow-xl glow-gold flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Proceed to Shuffle & Draw Cards</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
