// Tarot Depth Theme Management Utility
// Supports 'Classic Gold', 'Cosmic Night', and 'Minimal Artisan' themes

export type ThemeId = 'classic-gold' | 'cosmic-night' | 'minimal-artisan';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  icon: string;
  description: string;
  accentColor: string;
  bgPreview: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'classic-gold',
    name: 'Classic Gold',
    icon: '👑',
    description: 'Sacred gold accents on deep obsidian',
    accentColor: '#C5A059',
    bgPreview: '#0A0A0B'
  },
  {
    id: 'cosmic-night',
    name: 'Cosmic Night',
    icon: '🌌',
    description: 'Amethyst starlight on midnight velvet',
    accentColor: '#A855F7',
    bgPreview: '#070712'
  },
  {
    id: 'minimal-artisan',
    name: 'Minimal Artisan',
    icon: '🏛️',
    description: 'Warm brass on studio parchment',
    accentColor: '#D8AC66',
    bgPreview: '#121110'
  }
];

export function getInitialTheme(): ThemeId {
  if (typeof window === 'undefined') return 'classic-gold';
  const saved = localStorage.getItem('tarot_depth_theme') as ThemeId;
  if (saved && (saved === 'classic-gold' || saved === 'cosmic-night' || saved === 'minimal-artisan')) {
    return saved;
  }
  return 'classic-gold';
}

export function applyTheme(theme: ThemeId) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tarot_depth_theme', theme);
  }
}
