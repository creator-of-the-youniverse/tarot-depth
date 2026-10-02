import { TarotCard, CardOrientation } from '../types';
import { FULL_DECK } from '../data/tarotDeck';

export interface CardOfTheDayData {
  card: TarotCard;
  orientation: CardOrientation;
  dateString: string;
  formattedDate: string;
  dailyPrompt: string;
  affirmation: string;
  esotericLore: string;
  elementalWisdom: string;
}

/**
 * Derives a deterministic Card of the Day based on the YYYY-MM-DD calendar date.
 */
export function getCardOfTheDay(date: Date = new Date()): CardOfTheDayData {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  // Formatted date string for elegant display
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const formattedDate = date.toLocaleDateString('en-US', options);

  // Deterministic hash based on date string
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash |= 0;
  }

  const positiveHash = Math.abs(hash);
  const cardIndex = positiveHash % FULL_DECK.length;
  const card = FULL_DECK[cardIndex];

  // Deterministic orientation: 50% chance upright, 50% reversed based on hash
  const orientation: CardOrientation = positiveHash % 2 === 1 ? 'reversed' : 'upright';

  // Generate customized daily reflection prompt & esoteric lore
  const dailyPrompt = getDailyPrompt(card, orientation);
  const affirmation = getDailyAffirmation(card, orientation);
  const esotericLore = getEsotericLore(card);
  const elementalWisdom = getElementalWisdom(card);

  return {
    card,
    orientation,
    dateString,
    formattedDate,
    dailyPrompt,
    affirmation,
    esotericLore,
    elementalWisdom
  };
}

function getDailyPrompt(card: TarotCard, orientation: CardOrientation): string {
  if (orientation === 'upright') {
    switch (card.id) {
      case 'fool':
        return 'What fresh, unburdened possibility is inviting you to take a leap of faith today?';
      case 'magician':
        return 'What active skills or internal tools can you focus on to manifest your immediate priority?';
      case 'high_priestess':
        return 'In what quiet area of your life is your inner voice offering guidance that you have been too busy to hear?';
      case 'empress':
        return 'How can you nourish your physical body and creative projects with patience and self-care today?';
      case 'emperor':
        return 'Where in your daily routine can firm boundaries and structured order create greater peace?';
      case 'hierophant':
        return 'What tradition, timeless principle, or trusted mentor offers perspective on your current inquiry?';
      case 'lovers':
        return 'What choice today best aligns with your deepest, uncompromised personal values?';
      case 'chariot':
        return 'How can you channel opposing internal energies toward a single, purposeful objective?';
      case 'strength':
        return 'Where can you replace forceful pressure with quiet patience and soft, compassionate courage?';
      case 'hermit':
        return 'What clarity emerges when you step back from external noise and hold up your own inner lantern?';
      case 'wheel_of_fortune':
        return 'How can you cultivate poise and adaptability as life shifts around you today?';
      case 'justice':
        return 'In what situation are you called to practice radical honesty and balanced fairness?';
      case 'hanged_man':
        return 'If you pause and view your current challenge upside down, what unexpected truth becomes clear?';
      case 'death':
        return 'What outdated habit or chapter are you ready to gracefully release to create room for new growth?';
      case 'temperance':
        return 'How can you bring middle-ground moderation and alchemical balance to your day?';
      case 'devil':
        return 'What self-imposed constraint or illusory fear are you ready to recognize and untie?';
      case 'tower':
        return 'What core truth has recently shaken away false assumptions, leaving solid ground behind?';
      case 'star':
        return 'Where can you restore quiet faith and hope after a period of uncertainty?';
      default:
        return `How does the energy of ${card.name} (${orientation}) invite you to reflect on your goals today?`;
    }
  } else {
    return `In what area of your life might the reversed energy of ${card.name} be pointing toward internal friction, over-extension, or a need to turn inward?`;
  }
}

function getDailyAffirmation(card: TarotCard, orientation: CardOrientation): string {
  if (orientation === 'upright') {
    return `Today, I embody the archetype of ${card.name}. I move with ${card.uprightKeywords.slice(0, 3).join(', ')}.`;
  } else {
    return `Today, I bring gentle awareness to ${card.name} reversed, transforming ${card.reversedKeywords.slice(0, 2).join(' and ')} into inner clarity.`;
  }
}

function getEsotericLore(card: TarotCard): string {
  if (card.arcana === 'major') {
    return `In classical esoteric tarot traditions, Major Arcana #${card.number} (${card.name}) represents a pivotal station on the Fool's Journey—a universal soul archetype reflecting major spiritual lessons, karmic thresholds, and subconscious shifts.`;
  } else {
    return `As part of the Minor Arcana in the suit of ${card.suit?.toUpperCase()}, ${card.name} translates high archetypal principles into daily practical experiences, emotional nuances, and tangible manifestations.`;
  }
}

function getElementalWisdom(card: TarotCard): string {
  const elem = card.element || 'Spirit';
  switch (elem) {
    case 'Fire':
      return 'Governed by the Element of Fire: Sparking passion, willpower, creative momentum, and courageous transformation.';
    case 'Water':
      return 'Governed by the Element of Water: Resonating with intuition, emotional depth, subconscious dreams, and fluid heart wisdom.';
    case 'Air':
      return 'Governed by the Element of Air: Elevating mental clarity, truth, strategic communication, and objective analysis.';
    case 'Earth':
      return 'Governed by the Element of Earth: Grounded in tangible reality, abundance, physical stewardship, and enduring patience.';
    default:
      return 'Governed by the Quintessence of Spirit: Connecting transcendent purpose with everyday awareness.';
  }
}
