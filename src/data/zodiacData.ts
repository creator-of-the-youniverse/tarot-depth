// Zodiac & Astrology Dataset for Tarot Depth
// Includes all 12 Zodiac signs, elemental dynamics, Tarot links, and compatibility matrix

export type ZodiacId =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ZodiacModality = 'Cardinal' | 'Fixed' | 'Mutable';

export interface ZodiacSign {
  id: ZodiacId;
  name: string;
  symbol: string;
  dates: string;
  element: ZodiacElement;
  elementSymbol: string;
  modality: ZodiacModality;
  rulingPlanet: string;
  keywords: string[];
  tarotArchetype: string;
  tarotCardNumber: number;
  description: string;
  traits: {
    strengths: string[];
    challenges: string[];
    secretDesire: string;
  };
  defaultDaily: {
    overall: string;
    energyScore: number; // 1 to 100
    love: string;
    career: string;
    spirit: string;
    luckyColor: string;
    luckyNumbers: number[];
    powerHour: string;
    tarotFocus: string;
  };
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '♈',
    dates: 'Mar 21 - Apr 19',
    element: 'Fire',
    elementSymbol: '🔥',
    modality: 'Cardinal',
    rulingPlanet: 'Mars',
    keywords: ['Pioneer', 'Courage', 'Initiative', 'Passion'],
    tarotArchetype: 'The Emperor',
    tarotCardNumber: 4,
    description: 'Aries leads with bold passion and unyielding vitality, forging new paths with fearless momentum.',
    traits: {
      strengths: ['Charismatic Leadership', 'Bold Honesty', 'Inexhaustible Energy'],
      challenges: ['Impatience', 'Impulsiveness', 'Resistance to Delay'],
      secretDesire: 'To initiate transformative breakthroughs and be recognized for pioneering courage.'
    },
    defaultDaily: {
      overall: 'Mars injects fiery clarity into your morning choices. Trust your initial instinct—your first spark carries sacred truth today.',
      energyScore: 92,
      love: 'Bold vulnerability opens doors. Express your heartfelt truth directly without pretense.',
      career: 'Ideal timing to pitch fresh ideas or spearhead an ambitious project.',
      spirit: 'Ground your passionate momentum into mindful action. Channel inner fire into constructive creation.',
      luckyColor: 'Crimson Gold',
      luckyNumbers: [9, 18, 27],
      powerHour: '10:00 AM - 11:30 AM',
      tarotFocus: 'The Emperor — Command your personal sphere with clear boundaries and vision.'
    }
  },
  {
    id: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    dates: 'Apr 20 - May 20',
    element: 'Earth',
    elementSymbol: '🌱',
    modality: 'Fixed',
    rulingPlanet: 'Venus',
    keywords: ['Grounding', 'Devotion', 'Abundance', 'Serenity'],
    tarotArchetype: 'The Hierophant',
    tarotCardNumber: 5,
    description: 'Taurus anchors reality with sensual appreciation, steadfast loyalty, and deep earthly wisdom.',
    traits: {
      strengths: ['Unwavering Reliability', 'Aesthetic Sensitivity', 'Deep Resilience'],
      challenges: ['Stubbornness', 'Reluctance to Sudden Change', 'Possessiveness'],
      secretDesire: 'To construct an enduring sanctuary of beauty, comfort, and timeless security.'
    },
    defaultDaily: {
      overall: 'Venus invites you to slow down and savor the texture of the present moment. Tangible efforts yield lasting fruit today.',
      energyScore: 88,
      love: 'Deepen intimacy through quiet presence, shared comfort, and comforting consistency.',
      career: 'Steady focus completes complex tasks. Long-term investments and practical planning are favored.',
      spirit: 'Connect with nature or mindful ritual. Your inner peace radiates calm stability to all around you.',
      luckyColor: 'Emerald Moss',
      luckyNumbers: [6, 15, 24],
      powerHour: '2:00 PM - 3:30 PM',
      tarotFocus: 'The Hierophant — Reconnect with sacred traditions and foundational values.'
    }
  },
  {
    id: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    dates: 'May 21 - Jun 20',
    element: 'Air',
    elementSymbol: '💨',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    keywords: ['Curiosity', 'Duality', 'Synthesis', 'Articulation'],
    tarotArchetype: 'The Lovers',
    tarotCardNumber: 6,
    description: 'Gemini dances between dualities, bridging ideas, conversations, and multifaceted perspectives.',
    traits: {
      strengths: ['Quick Wit', 'Adaptability', 'Intellectual Brilliance'],
      challenges: ['Scattered Energy', 'Restlessness', 'Superficial Distractions'],
      secretDesire: 'To explore endless horizons of knowledge and connect deeply with soulful minds.'
    },
    defaultDaily: {
      overall: 'Mercury sparks brilliant synchronicities in conversation today. A chance message or idea carries unexpected insight.',
      energyScore: 85,
      love: 'Engaging dialogue and playful curiosity spark joyful connection. Share your inner thoughts freely.',
      career: 'Brainstorming and collaborative discussions unlock creative workarounds.',
      spirit: 'Synthesize opposing viewpoints. The Lovers remind you that choices shaped by truth align your heart and mind.',
      luckyColor: 'Amber Mercury',
      luckyNumbers: [5, 14, 23],
      powerHour: '11:00 AM - 12:30 PM',
      tarotFocus: 'The Lovers — Align your intellectual curiosity with emotional integrity.'
    }
  },
  {
    id: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    dates: 'Jun 21 - Jul 22',
    element: 'Water',
    elementSymbol: '🌊',
    modality: 'Cardinal',
    rulingPlanet: 'Moon',
    keywords: ['Intuition', 'Nurturing', 'Depth', 'Sanctuary'],
    tarotArchetype: 'The Chariot',
    tarotCardNumber: 7,
    description: 'Cancer holds the sacred mirror of intuitive feeling, nurturing emotional sanctuaries with lunar grace.',
    traits: {
      strengths: ['Profound Intuition', 'Protective Devotion', 'Empathetic Heart'],
      challenges: ['Mood Swings', 'Defensive Shell', 'Clinging to Nostalgia'],
      secretDesire: 'To foster unconditional belonging and safeguard emotional harmony.'
    },
    defaultDaily: {
      overall: 'Lunar tides heighten your subtle perception. Your intuition is exceptionally sharp—listen to the quiet whispers of your heart.',
      energyScore: 90,
      love: 'Nurture those you hold dear while keeping healthy boundaries around your sensitive aura.',
      career: 'Steer emotional passion toward goal achievement with disciplined Chariot focus.',
      spirit: 'Honor your emotional weather without judgement. Stillness near water or reflection brings clarity.',
      luckyColor: 'Silver Pearl',
      luckyNumbers: [2, 7, 16],
      powerHour: '8:00 PM - 9:30 PM',
      tarotFocus: 'The Chariot — Direct your rich emotional depth into clear, intentional direction.'
    }
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '♌',
    dates: 'Jul 23 - Aug 22',
    element: 'Fire',
    elementSymbol: '🔥',
    modality: 'Fixed',
    rulingPlanet: 'Sun',
    keywords: ['Radiance', 'Sovereignty', 'Generosity', 'Creation'],
    tarotArchetype: 'Strength',
    tarotCardNumber: 8,
    description: 'Leo radiates solar warmth and creative sovereignty, illuminating the world with golden confidence.',
    traits: {
      strengths: ['Magnanimous Heart', 'Creative Expression', 'Unshakeable Courage'],
      challenges: ['Pride', 'Need for External Validation', 'Drama'],
      secretDesire: 'To shine as a beacon of joy, warmth, and authentic artistic expression.'
    },
    defaultDaily: {
      overall: 'The Sun illuminates your creative centers. Lead with compassion and gentleness—true strength is gentle grace.',
      energyScore: 95,
      love: 'Generous affection and heartfelt encouragement kindle radiant romantic warmth.',
      career: 'Take center stage in your creative endeavors. Your natural charisma inspires teamwork.',
      spirit: 'Channel the Strength card: tame inner doubts with loving patience rather than forceful willpower.',
      luckyColor: 'Imperial Gold',
      luckyNumbers: [1, 10, 19],
      powerHour: '12:00 PM - 1:30 PM',
      tarotFocus: 'Strength — Mastery over instinct through gentle self-love and dignity.'
    }
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    dates: 'Aug 23 - Sep 22',
    element: 'Earth',
    elementSymbol: '🌱',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    keywords: ['Mastery', 'Devotion', 'Refinement', 'Discernment'],
    tarotArchetype: 'The Hermit',
    tarotCardNumber: 9,
    description: 'Virgo seeks sacred order, quiet discernment, and practical refinement to serve the highest good.',
    traits: {
      strengths: ['Analytical Brilliance', 'Selfless Service', 'Attention to Sublime Detail'],
      challenges: ['Perfectionism', 'Self-Criticism', 'Overthinking'],
      secretDesire: 'To bring pristine order, healing, and meaningful utility to every endeavor.'
    },
    defaultDaily: {
      overall: 'The Hermit’s lantern guides your inner inventory today. Quiet focus yields extraordinary breakthroughs.',
      energyScore: 86,
      love: 'Small acts of practical care speak louder than grand gestures. Show love through attentive presence.',
      career: 'Refine systems, streamline workflows, and edit complex details with sharp accuracy.',
      spirit: 'Step back from outer noise. Solitude illuminates the golden wisdom already within you.',
      luckyColor: 'Sage Olive',
      luckyNumbers: [5, 14, 32],
      powerHour: '7:00 AM - 8:30 AM',
      tarotFocus: 'The Hermit — Shine your inner lamp upon your unique spiritual path.'
    }
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '♎',
    dates: 'Sep 23 - Oct 22',
    element: 'Air',
    elementSymbol: '💨',
    modality: 'Cardinal',
    rulingPlanet: 'Venus',
    keywords: ['Harmony', 'Justice', 'Elegance', 'Partnership'],
    tarotArchetype: 'Justice',
    tarotCardNumber: 11,
    description: 'Libra seeks harmonious equilibrium, aesthetic beauty, and objective fairness in all relationships.',
    traits: {
      strengths: ['Diplomatic Grace', 'Aesthetic Eye', 'Search for Truth'],
      challenges: ['Indecision', 'Avoiding Friction at All Costs', 'People-Pleasing'],
      secretDesire: 'To cultivate perfect balance, artistic beauty, and soul-level partnerships.'
    },
    defaultDaily: {
      overall: 'Venus and Justice align to restore balance in key relationships and choices. Seek harmony without compromising your core truth.',
      energyScore: 89,
      love: 'Mutual respect and balanced reciprocity deepen connection. Be honest about your needs.',
      career: 'Mediate disputes and bring refined aesthetic design to group initiatives.',
      spirit: 'Weigh your internal scales. Release expectations that create energetic imbalance.',
      luckyColor: 'Rose Bronze',
      luckyNumbers: [6, 15, 33],
      powerHour: '4:00 PM - 5:30 PM',
      tarotFocus: 'Justice — Make decisions rooted in truth, equity, and personal alignment.'
    }
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    dates: 'Oct 23 - Nov 21',
    element: 'Water',
    elementSymbol: '🌊',
    modality: 'Fixed',
    rulingPlanet: 'Pluto & Mars',
    keywords: ['Transformation', 'Depth', 'Alchemical Power', 'Truth'],
    tarotArchetype: 'Death',
    tarotCardNumber: 13,
    description: 'Scorpio dives into subterranean truths, transforming shadows into golden spiritual empowerment.',
    traits: {
      strengths: ['Unfathomable Depth', 'Magnetic Presence', 'Transformative Resilience'],
      challenges: ['Trust Issues', 'Guarded Intensity', 'Holding Grudges'],
      secretDesire: 'To experience profound soul rebirth and uncover hidden universal mysteries.'
    },
    defaultDaily: {
      overall: 'Plutonian intensity highlights necessary shedding. Releasing an old boundary opens the floodgates for authentic power.',
      energyScore: 91,
      love: 'Soulful depth over superficial small talk. Vulnerable honesty creates instant intimacy.',
      career: 'Investigate underlying issues, uncover subtle truths, and lead transformative turnarounds.',
      spirit: 'Embrace the Death archetype: shed worn-out identities so your true essence can bloom.',
      luckyColor: 'Obsidian Burgundy',
      luckyNumbers: [8, 13, 22],
      powerHour: '9:00 PM - 10:30 PM',
      tarotFocus: 'Death — Honor natural cycles of release, rebirth, and profound renewal.'
    }
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    dates: 'Nov 22 - Dec 21',
    element: 'Fire',
    elementSymbol: '🔥',
    modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    keywords: ['Expansion', 'Philosophy', 'Freedom', 'Truth-Seeking'],
    tarotArchetype: 'Temperance',
    tarotCardNumber: 14,
    description: 'Sagittarius aims the archer’s arrow toward higher truth, expanding horizons with boundless optimism.',
    traits: {
      strengths: ['Philosophical Optimism', 'Love of Adventure', 'Infectious Enthusiasm'],
      challenges: ['Over-promising', 'Tactlessness', 'Restlessness'],
      secretDesire: 'To unlock universal philosophical wisdom and live without restrictive limits.'
    },
    defaultDaily: {
      overall: 'Jupiter expands your horizon today. The alchemy of Temperance guides you to blend passion with patient wisdom.',
      energyScore: 94,
      love: 'Share adventurous visions or philosophical conversations with your partner.',
      career: 'Broaden your scope. International, educational, or big-picture projects flourish.',
      spirit: 'Blend opposing forces inside yourself. True freedom comes from inner synthesis.',
      luckyColor: 'Saffron Indigo',
      luckyNumbers: [3, 12, 21],
      powerHour: '1:00 PM - 2:30 PM',
      tarotFocus: 'Temperance — Practice spiritual alchemy and harmonious moderation.'
    }
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: '♑',
    dates: 'Dec 22 - Jan 19',
    element: 'Earth',
    elementSymbol: '🌱',
    modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    keywords: ['Mastery', 'Ambition', 'Structure', 'Legacy'],
    tarotArchetype: 'The Devil',
    tarotCardNumber: 15,
    description: 'Capricorn scales the highest mountain peaks with disciplined focus, building enduring earthly legacies.',
    traits: {
      strengths: ['Unshakeable Discipline', 'Strategic Mastery', 'Enduring Reliability'],
      challenges: ['Rigidity', 'Pessimistic Gravity', 'Overworking'],
      secretDesire: 'To build a lasting legacy of mastery, authority, and structural excellence.'
    },
    defaultDaily: {
      overall: 'Saturnian discipline provides immense focus today. Examine self-imposed limitations—The Devil card reminds you the chains are loose.',
      energyScore: 87,
      love: 'Demonstrate commitment through steady presence and honoring shared responsibilities.',
      career: 'Execute long-term strategies. Your authority and pragmatic wisdom earn respect.',
      spirit: 'Reclaim personal agency from unhealthy habits or restrictive beliefs.',
      luckyColor: 'Midnight Slate',
      luckyNumbers: [4, 8, 26],
      powerHour: '8:00 AM - 9:30 AM',
      tarotFocus: 'The Devil — Break free from self-limiting illusions and shadow attachments.'
    }
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    dates: 'Jan 20 - Feb 18',
    element: 'Air',
    elementSymbol: '💨',
    modality: 'Fixed',
    rulingPlanet: 'Uranus & Saturn',
    keywords: ['Visionary', 'Innovation', 'Humanitarian', 'Truth'],
    tarotArchetype: 'The Star',
    tarotCardNumber: 17,
    description: 'Aquarius pours cosmic inspiration into humanity’s vessel, breaking outdated molds with visionary brilliance.',
    traits: {
      strengths: ['Original Genius', 'Humanitarian Compassion', 'Unconventional Clarity'],
      challenges: ['Emotional Detachment', 'Stubborn Eccentricity', 'Aloofness'],
      secretDesire: 'To spark revolutionary awakenings and create a more enlightened collective.'
    },
    defaultDaily: {
      overall: 'Uranian flashes of insight illuminate your morning. The Star card pours renewed hope and cosmic clarity into your path.',
      energyScore: 93,
      love: 'Value intellectual freedom and authentic individuality in your relationships.',
      career: 'Pioneer groundbreaking ideas. Futuristic concepts and group collaboration shine.',
      spirit: 'Be a conduit for hope. Share your unique perspective to uplift your community.',
      luckyColor: 'Electric Aquamarine',
      luckyNumbers: [7, 11, 29],
      powerHour: '3:00 PM - 4:30 PM',
      tarotFocus: 'The Star — Pour out inspiration, hope, and clear cosmic guidance.'
    }
  },
  {
    id: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    dates: 'Feb 19 - Mar 20',
    element: 'Water',
    elementSymbol: '🌊',
    modality: 'Mutable',
    rulingPlanet: 'Neptune & Jupiter',
    keywords: ['Mysticism', 'Transcendence', 'Empathy', 'Dreams'],
    tarotArchetype: 'The Moon',
    tarotCardNumber: 18,
    description: 'Pisces swims through boundless seas of empathy and mysticism, weaving dreams into divine art.',
    traits: {
      strengths: ['Boundless Empathy', 'Mystical Intuition', 'Artistic Imagination'],
      challenges: ['Escapism', 'Blurry Boundaries', 'Over-Absorbing Others’ Moods'],
      secretDesire: 'To dissolve earthly division and embody divine universal love.'
    },
    defaultDaily: {
      overall: 'Neptunian dreaminess enhances artistic creation and intuitive downloads. Navigate illusions with calm inner trust.',
      energyScore: 90,
      love: 'Romantic soul connection flourishes. Express affection through poetry, music, or quiet devotion.',
      career: 'Creative intuition solves abstract problems that logic alone cannot touch.',
      spirit: 'The Moon invites you into the realm of dreams. Meditate, paint, or write down intuitive visions.',
      luckyColor: 'Celestial Lavender',
      luckyNumbers: [3, 7, 12],
      powerHour: '9:00 AM - 10:30 AM',
      tarotFocus: 'The Moon — Navigate subconscious realms with intuitive trust and creative imagination.'
    }
  }
];

// Helper to get sign by ID
export function getZodiacSign(id: ZodiacId): ZodiacSign {
  return ZODIAC_SIGNS.find((s) => s.id === id) || ZODIAC_SIGNS[0];
}

// Elemental Compatibility Dynamics Map
export const ELEMENTAL_DYNAMICS: Record<string, {
  score: number;
  label: string;
  summary: string;
  tarotSynergy: string;
}> = {
  'Fire-Fire': {
    score: 92,
    label: 'Blazing Fusion',
    summary: 'High energy, passion, and mutual inspiration. You spark each other’s ambition, though occasional fiery clashes require cooling patience.',
    tarotSynergy: 'Wands meets Wands — Boundless creative momentum and adventurous fire.'
  },
  'Fire-Earth': {
    score: 78,
    label: 'Volcanic Anchor',
    summary: 'Earth grounds Fire’s wild sparks into lasting reality, while Fire warms Earth’s steady routines. Pragmatism meets passionate inspiration.',
    tarotSynergy: 'Wands meets Pentacles — Turning visionary sparks into tangible physical manifestations.'
  },
  'Fire-Air': {
    score: 95,
    label: 'Wild Wind & Flame',
    summary: 'Air fans Fire’s creative flames into brilliant momentum! Dynamic communication, endless adventure, and intellectual stimulation.',
    tarotSynergy: 'Wands meets Swords — Ideas ignite immediate action and bold forward movement.'
  },
  'Fire-Water': {
    score: 72,
    label: 'Steam & Transformation',
    summary: 'A dramatic, alchemical connection. Water softens Fire’s intensity, while Fire warms Water’s emotional depth. Requires tender balance.',
    tarotSynergy: 'Wands meets Cups — Passionate emotion meets creative fire; powerful transformation.'
  },
  'Earth-Earth': {
    score: 94,
    label: 'Immutable Mountain',
    summary: 'Unshakeable stability, shared practical values, and deep mutual trust. You build enduring physical and financial sanctuaries together.',
    tarotSynergy: 'Pentacles meets Pentacles — Deep earthly security, mastery, and timeless devotion.'
  },
  'Earth-Air': {
    score: 74,
    label: 'Structured Atmosphere',
    summary: 'Air brings brilliant ideas to Earth’s practical foundation, while Earth gives shape to Air’s abstract thoughts. A cerebral and productive match.',
    tarotSynergy: 'Pentacles meets Swords — Clear logic gives form to physical structures and goals.'
  },
  'Earth-Water': {
    score: 96,
    label: 'Fertile Oasis',
    summary: 'A deeply harmonious elemental union! Water nourishes Earth’s soil, cultivating rich emotional growth, stability, and enduring love.',
    tarotSynergy: 'Pentacles meets Cups — Emotional fulfillment rooted in deep physical sanctuary.'
  },
  'Air-Air': {
    score: 90,
    label: 'Cosmic Symphony',
    summary: 'Endless intellectual dialogue, witty banter, and shared social visions. You inspire each other’s minds without restricting personal freedom.',
    tarotSynergy: 'Swords meets Swords — Brilliant mental synergy and visionary clarity.'
  },
  'Air-Water': {
    score: 76,
    label: 'Mist & Reflection',
    summary: 'Air seeks to understand Water’s deep emotions, while Water teaches Air the depth of feeling. Intellect meets intuition in a poetic dance.',
    tarotSynergy: 'Swords meets Cups — Mind meets heart; bridging rational thought with empathetic intuition.'
  },
  'Water-Water': {
    score: 95,
    label: 'Oceanic Soulmeld',
    summary: 'Profound empathetic resonance and unspoken intuitive understanding. You navigate deep emotional currents as soulmates and protectors.',
    tarotSynergy: 'Cups meets Cups — Deep emotional union, unconditional love, and spiritual harmony.'
  }
};

export function getElementalKey(e1: ZodiacElement, e2: ZodiacElement): string {
  const elements = [e1, e2].sort();
  return `${elements[0]}-${elements[1]}`;
}

export function getCompatibility(sign1Id: ZodiacId, sign2Id: ZodiacId) {
  const s1 = getZodiacSign(sign1Id);
  const s2 = getZodiacSign(sign2Id);

  const key = getElementalKey(s1.element, s2.element);
  const baseDynamic = ELEMENTAL_DYNAMICS[key] || {
    score: 80,
    label: 'Harmonious Synergy',
    summary: 'A unique blend of distinct planetary forces with rich potential for mutual growth.',
    tarotSynergy: 'Diverse archetypes weaving a rich tapestry of wisdom.'
  };

  // Adjust score slightly based on modalities (Same modality can have slight friction or intense focus)
  let score = baseDynamic.score;
  if (s1.id === s2.id) {
    score = 88; // Mirror match
  } else if (s1.modality === s2.modality) {
    score = Math.max(68, score - 3); // Square/Opposition tension can build resilience
  } else {
    score = Math.min(99, score + 2);
  }

  return {
    s1,
    s2,
    score,
    label: baseDynamic.label,
    summary: baseDynamic.summary,
    tarotSynergy: baseDynamic.tarotSynergy,
    romanceScore: Math.min(100, score + (s1.element === s2.element ? 5 : -2)),
    communicationScore: Math.min(100, score + (s1.element === 'Air' || s2.element === 'Air' ? 6 : 0)),
    growthScore: Math.min(100, score + (s1.modality !== s2.modality ? 5 : 2))
  };
}
