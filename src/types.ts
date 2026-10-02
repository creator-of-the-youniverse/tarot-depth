export type CardOrientation = 'upright' | 'reversed';

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  arcana: 'major' | 'minor';
  uprightKeywords: string[];
  reversedKeywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  element?: 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit';
  archetype?: string;
  symbolism: string;
}

export interface CardInSpread {
  card: TarotCard;
  positionName: string;
  positionDescription: string;
  orientation: CardOrientation;
}

export interface CustomPosition {
  name: string;
  description: string;
  keywords?: string[];
}

export interface CustomSpread {
  id: string;
  userId: string;
  title: string;
  subtitle: string;
  description: string;
  cardCount: number;
  positions: CustomPosition[];
  recommendedFor?: string;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpreadDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cardCount: number;
  positions: { name: string; description: string; keywords?: string[] }[];
  recommendedFor: string;
  badge?: string;
  isCustom?: boolean;
  customSpreadId?: string;
}

export type MoodType =
  | 'seeking_clarity'
  | 'curious'
  | 'anxious'
  | 'hopeful'
  | 'contemplative'
  | 'facing_change'
  | 'heartbroken'
  | 'peaceful';

export interface SavedCard {
  name: string;
  number: number;
  suit: string;
  position: string;
  positionDescription: string;
  orientation: CardOrientation;
  meaning: string;
  keywords: string[];
  symbolism: string;
}

export interface TarotReading {
  id: string;
  userId: string;
  question: string;
  spreadType: string;
  spreadTitle: string;
  cards: SavedCard[];
  aiInterpretation: string;
  structuredInterpretation?: {
    spreadOverview: string;
    cardByCardMeanings: { cardName: string; position: string; orientation: string; text: string }[];
    combinedMessage: string;
    tensionsAndContradictions: string;
    reflectionQuestions: string[];
    journalingPrompt: string;
    closingAffirmation: string;
  };
  reflectionQuestions: string[];
  journalingPrompt: string;
  mood?: string;
  tags: string[];
  notes?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingNote {
  id: string;
  readingId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface FavoriteReading {
  id: string;
  readingId: string;
  userId: string;
  savedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  createdAt: string;
  preferenceTheme: 'luxury_gold' | 'mystic_obsidian' | 'celestial_silver';
  defaultDeck: 'classic_gold' | 'cosmic_night' | 'minimal_artisan';
  disclaimerAccepted: boolean;
  disclaimerAcceptedAt?: string;
  zodiacSign?: string;
}

export interface PatternAnalytics {
  totalReadings: number;
  mostFrequentCards: { name: string; count: number; suit: string }[];
  spreadCounts: Record<string, number>;
  moodCounts: Record<string, number>;
  aiThemeSummary?: string;
}
