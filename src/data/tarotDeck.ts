import { TarotCard, SpreadDefinition, MoodType } from '../types';

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 'fool',
    name: 'The Fool',
    number: 0,
    suit: 'major',
    arcana: 'major',
    element: 'Spirit',
    archetype: 'The Innocent Explorer',
    uprightKeywords: ['New Beginnings', 'Innocence', 'Spontaneity', 'Free Spirit', 'Faith'],
    reversedKeywords: ['Recklessness', 'Risk-taking', 'Hesitation', 'Foolishness', 'Naivety'],
    uprightMeaning: 'Stepping into the unknown with an open heart. Trusting the journey despite untrodden paths.',
    reversedMeaning: 'Caution against blind leaps without grounding or holding back due to fear of the unknown.',
    symbolism: 'A traveler atop a cliff, sun overhead, holding a white rose of purity with a faithful dog by their side.'
  },
  {
    id: 'magician',
    name: 'The Magician',
    number: 1,
    suit: 'major',
    arcana: 'major',
    element: 'Air',
    archetype: 'The Alchemist Master',
    uprightKeywords: ['Manifestation', 'Resourcefulness', 'Power', 'Inspired Action', 'Skill'],
    reversedKeywords: ['Illusion', 'Unrealized Potential', 'Manipulation', 'Wasted Talent'],
    uprightMeaning: 'All tools are at your disposal to transform intention into reality through focused willpower.',
    reversedMeaning: 'Misdirection or self-doubt blocking the alignment of your natural gifts.',
    symbolism: 'The lemniscate infinity symbol above the head, table bearing wand, cup, sword, and pentacle.'
  },
  {
    id: 'high_priestess',
    name: 'The High Priestess',
    number: 2,
    suit: 'major',
    arcana: 'major',
    element: 'Water',
    archetype: 'The Keeper of Secrets',
    uprightKeywords: ['Intuition', 'Sacred Knowledge', 'Divine Feminine', 'Subconscious', 'Silence'],
    reversedKeywords: ['Secrets', 'Disconnected Intuition', 'Superficiality', 'Repressed Feelings'],
    uprightMeaning: 'Look inward beyond the noise. Answers lie in quiet reflection and honoring subtle inner knowings.',
    reversedMeaning: 'Ignoring quiet intuition or keeping secrets that create inner friction.',
    symbolism: 'Seated between black and white pillars Boaz and Jachin, veil of pomegranates, crescent moon at feet.'
  },
  {
    id: 'empress',
    name: 'The Empress',
    number: 3,
    suit: 'major',
    arcana: 'major',
    element: 'Earth',
    archetype: 'The Nurturing Mother',
    uprightKeywords: ['Abundance', 'Sensuality', 'Nurturing', 'Nature', 'Creativity'],
    reversedKeywords: ['Creative Block', 'Dependence', 'Neglect', 'Over-extension'],
    uprightMeaning: 'A period of rich fertility, creative flowering, and abundance rooted in self-care and nature.',
    reversedMeaning: 'Neglecting your emotional or physical reservoir while giving too much to others.',
    symbolism: 'Throne amidst wheat fields and waterfall, crown of twelve stars, heart-shaped shield with Venus symbol.'
  },
  {
    id: 'emperor',
    name: 'The Emperor',
    number: 4,
    suit: 'major',
    arcana: 'major',
    element: 'Fire',
    archetype: 'The Architect of Order',
    uprightKeywords: ['Authority', 'Structure', 'Foundations', 'Leadership', 'Discipline'],
    reversedKeywords: ['Tyranny', 'Rigidity', 'Lack of Control', 'Chaos'],
    uprightMeaning: 'Establishing order, firm boundaries, and structured strategy to bring stability to your goals.',
    reversedMeaning: 'Over-controlling rigidity or struggling with discipline and chaotic boundaries.',
    symbolism: 'Stone throne adorned with ram heads, scepter and orb in hand, mountain backdrop symbolizing strength.'
  },
  {
    id: 'hierophant',
    name: 'The Hierophant',
    number: 5,
    suit: 'major',
    arcana: 'major',
    element: 'Earth',
    archetype: 'The Sacred Teacher',
    uprightKeywords: ['Tradition', 'Spiritual Wisdom', 'Mentorship', 'Conformity', 'Institutions'],
    reversedKeywords: ['Rebellion', 'Personal Beliefs', 'Unconventional Paths', 'Dogma'],
    uprightMeaning: 'Seeking guidance from tradition, structured study, or respected mentors who honor lineage.',
    reversedMeaning: 'Questioning established rules to forge your own authentic personal code.',
    symbolism: 'Triple crown and papal cross, two acolytes kneeling at the keys of wisdom.'
  },
  {
    id: 'lovers',
    name: 'The Lovers',
    number: 6,
    suit: 'major',
    arcana: 'major',
    element: 'Air',
    archetype: 'The Divine Union',
    uprightKeywords: ['Love', 'Harmony', 'Core Values', 'Choice', 'Alignment'],
    reversedKeywords: ['Disharmony', 'Misalignment', 'Conflict of Values', 'Indecision'],
    uprightMeaning: 'Deep harmony born from alignment with your highest personal values and reciprocal trust.',
    reversedMeaning: 'Inner value mismatch or disharmony in choices that pull you away from your truth.',
    symbolism: 'Archangel Raphael extending blessings over two figures before the Tree of Knowledge and Tree of Life.'
  },
  {
    id: 'chariot',
    name: 'The Chariot',
    number: 7,
    suit: 'major',
    arcana: 'major',
    element: 'Water',
    archetype: 'The Triumphant Warrior',
    uprightKeywords: ['Willpower', 'Determination', 'Focus', 'Victory', 'Self-Mastery'],
    reversedKeywords: ['Lack of Direction', 'Aggression', 'Loss of Control', 'Obstacles'],
    uprightMeaning: 'Harnessing opposing internal forces with disciplined focus to reach a defined destination.',
    reversedMeaning: 'Pulled in conflicting directions due to unguided emotional momentum.',
    symbolism: 'Warrior seated in a star-canopied chariot pulled by black and white sphinxes.'
  },
  {
    id: 'strength',
    name: 'Strength',
    number: 8,
    suit: 'major',
    arcana: 'major',
    element: 'Fire',
    archetype: 'The Gentle Tamer',
    uprightKeywords: ['Courage', 'Compassion', 'Patience', 'Soft Power', 'Endurance'],
    reversedKeywords: ['Self-Doubt', 'Raw Emotion', 'Impatience', 'Weakened Resolve'],
    uprightMeaning: 'true power is quiet, patient, and compassionate—overcoming friction through gentle grace.',
    reversedMeaning: 'Frustration or self-doubt wearing down your emotional resilience.',
    symbolism: 'A serene figure calmly soothing a roaring lion under the infinity symbol.'
  },
  {
    id: 'hermit',
    name: 'The Hermit',
    number: 9,
    suit: 'major',
    arcana: 'major',
    element: 'Earth',
    archetype: 'The Wise Seeker',
    uprightKeywords: ['Soul-Searching', 'Solitude', 'Inner Guidance', 'Wisdom', 'Retreat'],
    reversedKeywords: ['Isolation', 'Loneliness', 'Withdrawal', 'Ignoring Wisdom'],
    uprightMeaning: 'Stepping back from external noise to light your own lantern of inner clarity.',
    reversedMeaning: 'Unhealthy isolation or fear of facing truth in quiet contemplation.',
    symbolism: 'Cloaked figure atop a mountain peak holding a lantern containing a six-pointed star.'
  },
  {
    id: 'wheel_of_fortune',
    name: 'Wheel of Fortune',
    number: 10,
    suit: 'major',
    arcana: 'major',
    element: 'Fire',
    archetype: 'The Weaver of Cycles',
    uprightKeywords: ['Cycles', 'Destiny', 'Turning Point', 'Karma', 'Inevitable Change'],
    reversedKeywords: ['Bad Luck', 'Resisting Change', 'Setbacks', 'Breaking Cycles'],
    uprightMeaning: 'Life is in constant motion. Embrace the turning wheel with adaptability and perspective.',
    reversedMeaning: 'Clinging tightly to past momentum while resisting natural life shifts.',
    symbolism: 'The wheel with Hebrew letters TARO/ROTA surrounded by Four Elemental Creatures.'
  },
  {
    id: 'justice',
    name: 'Justice',
    number: 11,
    suit: 'major',
    arcana: 'major',
    element: 'Air',
    archetype: 'The Truth Bearer',
    uprightKeywords: ['Clarity', 'Truth', 'Fairness', 'Cause and Effect', 'Accountability'],
    reversedKeywords: ['Unfairness', 'Dishonesty', 'Lack of Accountability', 'Bias'],
    uprightMeaning: 'Actions yield proportional results. Seek radical honesty and balanced objectivity.',
    reversedMeaning: 'Avoiding personal responsibility or feeling unsettled by unfair circumstances.',
    symbolism: 'Seated figure holding upright sword of truth in right hand and balanced scales in left hand.'
  },
  {
    id: 'hanged_man',
    name: 'The Hanged Man',
    number: 12,
    suit: 'major',
    arcana: 'major',
    element: 'Water',
    archetype: 'The Surrendered Sage',
    uprightKeywords: ['Surrender', 'New Perspective', 'Pause', 'Letting Go', 'Enlightenment'],
    reversedKeywords: ['Stagnation', 'Resistance', 'Martyrdom', 'Futile Delay'],
    uprightMeaning: 'Surrendering control clears the vision. Pausing reveals unexpected, transformative insights.',
    reversedMeaning: 'Struggling against necessary pause or playing the martyr without true surrender.',
    symbolism: 'Figure suspended upside down by one leg from T-shaped wooden cross with halo of enlightenment.'
  },
  {
    id: 'death',
    name: 'Death',
    number: 13,
    suit: 'major',
    arcana: 'major',
    element: 'Water',
    archetype: 'The Great Transformer',
    uprightKeywords: ['Transformation', 'Endings', 'Transition', 'Rebirth', 'Clearing Away'],
    reversedKeywords: ['Resistance to Change', 'Stagnation', 'Fear of Letting Go', 'Decay'],
    uprightMeaning: 'Closing one chapter completely to make fertile soil for new growth. Necessary release.',
    reversedMeaning: 'Holding onto outworn habits or situations long past their natural lifespan.',
    symbolism: 'Armored skeleton rider carrying black banner with white rose, sun rising between twin towers.'
  },
  {
    id: 'temperance',
    name: 'Temperance',
    number: 14,
    suit: 'major',
    arcana: 'major',
    element: 'Fire',
    archetype: 'The Alchemical Balancer',
    uprightKeywords: ['Balance', 'Moderation', 'Patience', 'Purpose', 'Synthesis'],
    reversedKeywords: ['Imbalance', 'Excess', 'Discord', 'Extremes'],
    uprightMeaning: 'Blending opposites with patient care. Finding middle ground through composure.',
    reversedMeaning: 'Overindulgence or emotional turbulence caused by extreme reactions.',
    symbolism: 'Angel with one foot on water and one on land, pouring liquid continuously between two chalices.'
  },
  {
    id: 'devil',
    name: 'The Devil',
    number: 15,
    suit: 'major',
    arcana: 'major',
    element: 'Earth',
    archetype: 'The Shadow Mirror',
    uprightKeywords: ['Shadow Self', 'Attachment', 'Illusion of Restraint', 'Materialism', 'Unconscious Patterns'],
    reversedKeywords: ['Freedom', 'Releasing Chains', 'Reclaiming Agency', 'Breaking Free'],
    uprightMeaning: 'Recognizing self-imposed chains and unconscious habits that diminish your freedom.',
    reversedMeaning: 'Breaking free from toxic patterns and reclaiming conscious control.',
    symbolism: 'Horned satyr figure on pedestal with loose chains around two standing humans who could slip them off.'
  },
  {
    id: 'tower',
    name: 'The Tower',
    number: 16,
    suit: 'major',
    arcana: 'major',
    element: 'Fire',
    archetype: 'The Lightning Revelation',
    uprightKeywords: ['Sudden Awakening', 'Breakthrough', 'Truth Unveiled', 'Shaking Foundations'],
    reversedKeywords: ['Avoiding Crisis', 'Delaying Breakthrough', 'Fear of Suffering'],
    uprightMeaning: 'False structures crumble under sudden lightning flashes of truth, leaving authentic bedrock.',
    reversedMeaning: 'Proprolonging an unstable situation to avoid necessary reorganization.',
    symbolism: 'Lightning striking a stone tower on a rocky summit, crown falling as flames burst from windows.'
  },
  {
    id: 'star',
    name: 'The Star',
    number: 17,
    suit: 'major',
    arcana: 'major',
    element: 'Air',
    archetype: 'The Beacon of Hope',
    uprightKeywords: ['Hope', 'Inspiration', 'Renewed Faith', 'Serenity', 'Healing'],
    reversedKeywords: ['Despair', 'Discouragement', 'Lack of Faith', 'Disconnection'],
    uprightMeaning: 'Calm after storm. Soft starlight pours healing renewal and spiritual hope into your heart.',
    reversedMeaning: 'Feeling temporarily cynical or disconnected from your inner vision.',
    symbolism: 'Figure kneeling at water edge pouring from twin urns under a brilliant seven-pointed gold star.'
  },
  {
    id: 'moon',
    name: 'The Moon',
    number: 18,
    suit: 'major',
    arcana: 'major',
    element: 'Water',
    archetype: 'The Realm of Dreams',
    uprightKeywords: ['Illusion', 'Subconscious Mind', 'Dreams', 'Uncertainty', 'Mystery'],
    reversedKeywords: ['Release of Fear', 'Clarity Returning', 'Unveiling Deception'],
    uprightMeaning: 'Navigating shadows where things are not as they appear. Trusting inner compass through fog.',
    reversedMeaning: 'Confusion dissipating as hidden truths come to light.',
    symbolism: 'Full moon drops dew between two towers, dog and wolf howling as crayfish emerges from pool.'
  },
  {
    id: 'sun',
    name: 'The Sun',
    number: 19,
    suit: 'major',
    arcana: 'major',
    element: 'Fire',
    archetype: 'The Radiant Radiant',
    uprightKeywords: ['Joy', 'Vitality', 'Clarity', 'Success', 'Authenticity'],
    reversedKeywords: ['Temporary Cloudiness', 'Dimmed Enthusiasm', 'Overly Optimistic'],
    uprightMeaning: 'Unfiltered warmth, clarity, and genuine joy. Celebrating pure self-expression.',
    reversedMeaning: 'Sunlight is present but momentarily veiled by passing self-doubt.',
    symbolism: 'Golden sun with human face beaming over sunflowers, child riding white horse with red banner.'
  },
  {
    id: 'judgement',
    name: 'Judgement',
    number: 20,
    suit: 'major',
    arcana: 'major',
    element: 'Fire',
    archetype: 'The Sacred Calling',
    uprightKeywords: ['Reckoning', 'Awakening', 'Higher Calling', 'Forgiveness', 'Absolution'],
    reversedKeywords: ['Self-Criticism', 'Regret', 'Ignoring Calling', 'Harsh Judgment'],
    uprightMeaning: 'Hearing the trumpet call to rise above old narratives and embrace higher purpose.',
    reversedMeaning: 'Harsh internal criticism or hesitating to accept forgiveness and move forward.',
    symbolism: 'Archangel Gabriel blowing trumpet from clouds as figures rise with open arms from tombs.'
  },
  {
    id: 'world',
    name: 'The World',
    number: 21,
    suit: 'major',
    arcana: 'major',
    element: 'Earth',
    archetype: 'The Cosmic Whole',
    uprightKeywords: ['Completion', 'Integration', 'Wholeness', 'Fulfillment', 'Travel'],
    reversedKeywords: ['Incompletion', 'Lack of Closure', 'Shortcuts', 'Delayed Success'],
    uprightMeaning: 'Harmonious completion of a grand cycle. Stepping into full integration.',
    reversedMeaning: 'Near the finish line but missing one key final piece of inner closure.',
    symbolism: 'Dancing figure wrapped in purple wreath surrounded by Cherub, Eagle, Lion, and Bull.'
  }
];

export const MINOR_ARCANA_SAMPLE: TarotCard[] = [
  // CUPS
  {
    id: 'ace_cups',
    name: 'Ace of Cups',
    number: 1,
    suit: 'cups',
    arcana: 'minor',
    element: 'Water',
    uprightKeywords: ['Emotional Abundance', 'New Love', 'Compassion', 'Intuition'],
    reversedKeywords: ['Emotional Drain', 'Blocked Feelings', 'Self-Love Needed'],
    uprightMeaning: 'An overflowing chalice of genuine feeling, empathy, and spiritual connection.',
    reversedMeaning: 'Emotional reservoir feels depleted; time to pour back into your own cup.',
    symbolism: 'Chalice overflowing with five streams of water into a lily pond.'
  },
  {
    id: 'three_cups',
    name: 'Three of Cups',
    number: 3,
    suit: 'cups',
    arcana: 'minor',
    element: 'Water',
    uprightKeywords: ['Community', 'Celebration', 'Friendship', 'Collaboration'],
    reversedKeywords: ['Isolation', 'Group Tension', 'Overindulgence'],
    uprightMeaning: 'Joyful gathering of kindred spirits celebrating shared creative or emotional harvests.',
    reversedMeaning: 'Feeling out of sync with your social circle or needing solitary rest.',
    symbolism: 'Three maidens lifting golden chalices in celebratory dance among flowers.'
  },
  {
    id: 'eight_cups',
    name: 'Eight of Cups',
    number: 8,
    suit: 'cups',
    arcana: 'minor',
    element: 'Water',
    uprightKeywords: ['Walking Away', 'Deeper Purpose', 'Leaving the Past', 'Search for Truth'],
    reversedKeywords: ['Clinging to Past', 'Fear of Change', 'Stagnation'],
    uprightMeaning: 'Choosing to walk away from what is good enough in pursuit of what is truly fulfilling.',
    reversedMeaning: 'Hesitating to step away from a familiar scenario even when growth has ceased.',
    symbolism: 'Cloaked figure walking toward mountains under moonlit sky leaving eight stacked cups.'
  },
  {
    id: 'queen_cups',
    name: 'Queen of Cups',
    number: 13,
    suit: 'cups',
    arcana: 'minor',
    element: 'Water',
    uprightKeywords: ['Emotional Maturity', 'Compassion', 'Intuitive Sanctuary', 'Serenity'],
    reversedKeywords: ['Emotional Turbulence', 'Co-dependency', 'Overwhelmed'],
    uprightMeaning: 'A deeply grounded heart that holds safe space for intuitive wisdom and calm guidance.',
    reversedMeaning: 'Boundary exhaustion from taking on emotions that are not yours to carry.',
    symbolism: 'Queen holding ornate handled cup by the edge of a calm ocean.'
  },

  // WANDS
  {
    id: 'ace_wands',
    name: 'Ace of Wands',
    number: 1,
    suit: 'wands',
    arcana: 'minor',
    element: 'Fire',
    uprightKeywords: ['Inspiration', 'Spark of Creation', 'Passion', 'Potential'],
    reversedKeywords: ['Delays', 'Lack of Passion', 'Creative Block'],
    uprightMeaning: 'A sudden burst of creative energy and passion urging you to launch new ideas.',
    reversedMeaning: 'Spark is present but needs clear intention before taking off.',
    symbolism: 'Hand emerging from clouds holding a sprouting wooden wand.'
  },
  {
    id: 'six_wands',
    name: 'Six of Wands',
    number: 6,
    suit: 'wands',
    arcana: 'minor',
    element: 'Fire',
    uprightKeywords: ['Recognition', 'Victory', 'Pride', 'Progress'],
    reversedKeywords: ['Ego Trap', 'Need for Validation', 'Delayed Praise'],
    uprightMeaning: 'Public acknowledgement and internal pride for a milestone achieved through effort.',
    reversedMeaning: 'Seeking external applause rather than quiet internal self-approval.',
    symbolism: 'Rider crowned with laurel wreath riding through cheering crowd.'
  },
  {
    id: 'ten_wands',
    name: 'Ten of Wands',
    number: 10,
    suit: 'wands',
    arcana: 'minor',
    element: 'Fire',
    uprightKeywords: ['Burden', 'Responsibility', 'Overwhelmed', 'Final Stretch'],
    reversedKeywords: ['Delegation', 'Releasing Weight', 'Collapse'],
    uprightMeaning: 'Carrying heavy responsibilities. You are close to the threshold, but delegation is vital.',
    reversedMeaning: 'Dropping unneeded burdens to lighten your spirit.',
    symbolism: 'Figure bending forward carrying ten heavy wands toward a distant town.'
  },
  {
    id: 'king_wands',
    name: 'King of Wands',
    number: 14,
    suit: 'wands',
    arcana: 'minor',
    element: 'Fire',
    uprightKeywords: ['Visionary Leader', 'Charisma', 'Bold Action', 'Entrepreneurship'],
    reversedKeywords: ['Impatience', 'Dominating Control', 'Impulsivity'],
    uprightMeaning: 'Leading with magnetic vision, bold passion, and decisive creative authority.',
    reversedMeaning: 'Unfocused fire or pushing agenda without listening to collaborators.',
    symbolism: 'King seated on throne decorated with salamanders and lions holding a flowering wand.'
  },

  // SWORDS
  {
    id: 'ace_swords',
    name: 'Ace of Swords',
    number: 1,
    suit: 'swords',
    arcana: 'minor',
    element: 'Air',
    uprightKeywords: ['Mental Clarity', 'Breakthrough', 'Truth', 'Sharp Focus'],
    reversedKeywords: ['Confusion', 'Miscommunication', 'Hostile Thoughts'],
    uprightMeaning: 'A double-edged blade of truth cutting cleanly through mental clutter and confusion.',
    reversedMeaning: 'Overthinking or clouded judgement making decisions difficult.',
    symbolism: 'Hand holding upright sword crowned with palm branch and olive branch.'
  },
  {
    id: 'three_swords',
    name: 'Three of Swords',
    number: 3,
    suit: 'swords',
    arcana: 'minor',
    element: 'Air',
    uprightKeywords: ['Heartbreak', 'Grief', 'Emotional Release', 'Truth Hurts'],
    reversedKeywords: ['Healing', 'Forgiveness', 'Releasing Pain'],
    uprightMeaning: 'A painful realization or grief that breaks open the heart so it can heal cleanly.',
    reversedMeaning: 'Beginning the active process of emotional recovery and forgiveness.',
    symbolism: 'Heart pierced by three swords under rain-swept gray storm clouds.'
  },
  {
    id: 'six_swords',
    name: 'Six of Swords',
    number: 6,
    suit: 'swords',
    arcana: 'minor',
    element: 'Air',
    uprightKeywords: ['Transition', 'Calmer Waters', 'Leaving Turbulence', 'Mental Relief'],
    reversedKeywords: ['Unresolved Baggage', 'Resisting Shift', 'Stuck in Storm'],
    uprightMeaning: 'Moving away from turbulent mental shores toward quiet, peaceful horizon.',
    reversedMeaning: 'Carrying mental friction along into new environments without releasing old story.',
    symbolism: 'Ferryman rowing boat carrying cloaked passengers across choppy water into smooth sea.'
  },
  {
    id: 'king_swords',
    name: 'King of Swords',
    number: 14,
    suit: 'swords',
    arcana: 'minor',
    element: 'Air',
    uprightKeywords: ['Intellectual Authority', 'Truth', 'Objectivity', 'Ethical Standards'],
    reversedKeywords: ['Harshness', 'Dogmatic Logic', 'Cynicism'],
    uprightMeaning: 'Guided by calm reason, intellectual clarity, and unwavering ethical discernment.',
    reversedMeaning: 'Cold detachment or using sharp logic without heart compassion.',
    symbolism: 'King seated on stone throne holding upright sword under clear skies.'
  },

  // PENTACLES
  {
    id: 'ace_pentacles',
    name: 'Ace of Pentacles',
    number: 1,
    suit: 'pentacles',
    arcana: 'minor',
    element: 'Earth',
    uprightKeywords: ['Tangible Opportunity', 'Prosperity', 'Grounded Start', 'Security'],
    reversedKeywords: ['Missed Chance', 'Financial Instability', 'Poor Planning'],
    uprightMeaning: 'A solid, tangible opportunity planting seed for material security and practical growth.',
    reversedMeaning: 'A grounded offer delayed or needing careful financial review.',
    symbolism: 'Hand offering golden coin over lush garden archway leading to mountains.'
  },
  {
    id: 'three_pentacles',
    name: 'Three of Pentacles',
    number: 3,
    suit: 'pentacles',
    arcana: 'minor',
    element: 'Earth',
    uprightKeywords: ['Mastery', 'Collaboration', 'Craftsmanship', 'Teamwork'],
    reversedKeywords: ['Misalignment', 'Lack of Teamwork', 'Sloppy Work'],
    uprightMeaning: 'Combining individual expertise with fellow craftspeople to build something enduring.',
    reversedMeaning: 'Friction in group effort or uncoordinated roles.',
    symbolism: 'Architect, stonemason, and priest consulting plans inside cathedral sanctuary.'
  },
  {
    id: 'seven_pentacles',
    name: 'Seven of Pentacles',
    number: 7,
    suit: 'pentacles',
    arcana: 'minor',
    element: 'Earth',
    uprightKeywords: ['Patience', 'Long-term Investment', 'Assessment', 'Harvest Preparation'],
    reversedKeywords: ['Impatience', 'Lack of Results', 'Wasted Effort'],
    uprightMeaning: 'Pausing to assess the garden you have cultivated. Trusting the timing of growth.',
    reversedMeaning: 'Frustration that harvest is taking longer than wished; resist pulling roots up early.',
    symbolism: 'Gardener leaning on hoe looking at vine bearing seven golden pentacles.'
  },
  {
    id: 'king_pentacles',
    name: 'King of Pentacles',
    number: 14,
    suit: 'pentacles',
    arcana: 'minor',
    element: 'Earth',
    uprightKeywords: ['Wealth Mastery', 'Security', 'Grounded Stewardship', 'Abundance'],
    reversedKeywords: ['Greed', 'Materialism', 'Risk Aversion'],
    uprightMeaning: 'Creating lasting prosperity and security through patient stewardship and practical mastery.',
    reversedMeaning: 'Over-indexing on material metrics at the expense of spiritual peace.',
    symbolism: 'King crowned with grapevines seated on throne surrounded by lush castle gardens.'
  }
];

export const FULL_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA_SAMPLE];

export const SPREADS: SpreadDefinition[] = [
  {
    id: 'single_draw',
    title: 'Daily Focus',
    subtitle: 'Single Card Reflection',
    description: 'A focused, single-card mirror to anchor your day or clarify a singular question.',
    cardCount: 1,
    positions: [
      { name: 'Core Focus', description: 'The primary theme, energy, or lesson inviting your attention.' }
    ],
    recommendedFor: 'Daily intention, quick check-in, or single point of focus.',
    badge: 'Popular'
  },
  {
    id: 'three_card_time',
    title: 'Past, Present, Future',
    subtitle: 'Temporal Continuum',
    description: 'Examines the arc of time—where you came from, where you stand now, and where momentum is heading.',
    cardCount: 3,
    positions: [
      { name: '1. Past Foundation', description: 'Root conditions and events that shaped current circumstances.' },
      { name: '2. Present Reality', description: 'Immediate landscape, present mindset, and active energy.' },
      { name: '3. Emerging Horizon', description: 'Natural trajectory and future potential if momentum continues.' }
    ],
    recommendedFor: 'Understanding life transitions and unfolding situations.',
    badge: 'Classic'
  },
  {
    id: 'three_card_mind',
    title: 'Mind, Body, Spirit',
    subtitle: 'Holistic Self Alignment',
    description: 'A tripartite check-in evaluating mental thoughts, physical realities, and intuitive soul state.',
    cardCount: 3,
    positions: [
      { name: '1. Mind', description: 'Current thoughts, mental clarity, or intellectual patterns.' },
      { name: '2. Body / Earth', description: 'Physical energy, health, practical routine, and environment.' },
      { name: '3. Spirit / Soul', description: 'Deeper intuitive calling, emotional core, and spiritual posture.' }
    ],
    recommendedFor: 'Self-care checks, burnout prevention, and personal alignment.'
  },
  {
    id: 'crossroads',
    title: 'Crossroads & Decision',
    subtitle: 'Evaluating Two Paths',
    description: 'Brings symbolic clarity when facing a choice between two distinct directions or options.',
    cardCount: 3,
    positions: [
      { name: '1. Path A Energy', description: 'Nature, potential, and lessons of the first option.' },
      { name: '2. Path B Energy', description: 'Nature, potential, and lessons of the second option.' },
      { name: '3. Core Synthesis', description: 'Unifying wisdom, underlying value, or decision anchor.' }
    ],
    recommendedFor: 'Career crossroads, difficult choices, and fork-in-the-road moments.'
  },
  {
    id: 'relationship',
    title: 'Relational Mirror',
    subtitle: 'Interpersonal Dynamics',
    description: 'Explores the energetic connection, shared bridge, and growth trajectory between two people.',
    cardCount: 5,
    positions: [
      { name: '1. Your Posture', description: 'Your perspective, desires, and emotional stance.' },
      { name: '2. Other Person / Environment', description: 'Their perspective, energy, or external context.' },
      { name: '3. Shared Bridge', description: 'The active dynamic or energetic connection between you.' },
      { name: '4. Underlying Challenge', description: 'Hidden friction, unspoken expectation, or obstacle.' },
      { name: '5. Highest Potential', description: 'Path toward mutual understanding, growth, or resolution.' }
    ],
    recommendedFor: 'Romantic partners, deep friendships, or creative collaborators.'
  },
  {
    id: 'celtic_cross',
    title: 'Celtic Cross',
    subtitle: 'Deep Comprehensive Exploration',
    description: 'The iconic 10-card deep dive uncovering root causes, conscious goals, unconscious drivers, and complete context.',
    cardCount: 10,
    positions: [
      { name: '1. Core Heart', description: 'The central situation or question.' },
      { name: '2. The Crossing', description: 'Immediate obstacle, challenge, or catalyst.' },
      { name: '3. The Root', description: 'Unconscious foundation or deep origin.' },
      { name: '4. The Recent Past', description: 'Energy that is passing away.' },
      { name: '5. The Crown', description: 'Conscious goal, aspiration, or best outcome.' },
      { name: '6. Immediate Future', description: 'Next unfolding phase.' },
      { name: '7. Self Stance', description: 'Your internal attitude, power, and perception.' },
      { name: '8. Environment', description: 'External influences, family, or social forces.' },
      { name: '9. Hopes & Fears', description: 'Deepest emotional anticipations or anxieties.' },
      { name: '10. Final Synthesis', description: 'Culmination of forces and symbolic wisdom.' }
    ],
    recommendedFor: 'Major life decisions, deep introspection, and annual reflections.',
    badge: 'Deepest'
  }
];

export const MOODS: { type: MoodType; label: string; icon: string; description: string }[] = [
  { type: 'seeking_clarity', label: 'Seeking Clarity', icon: '✨', description: 'Sorting through confusion to find focus.' },
  { type: 'curious', label: 'Curious & Open', icon: '🌌', description: 'Exploring possibilities with a playful heart.' },
  { type: 'contemplative', label: 'Contemplative', icon: '🕯️', description: 'In quiet reflection, looking inward.' },
  { type: 'anxious', label: 'Anxious / Uneasy', icon: '🌧️', description: 'Seeking grounding reassurance and gentle perspective.' },
  { type: 'hopeful', label: 'Hopeful & Inspired', icon: '🌅', description: 'Ready to build upon positive momentum.' },
  { type: 'facing_change', label: 'Facing Transition', icon: '🍂', description: 'Navigating shift, endings, or new thresholds.' },
  { type: 'heartbroken', label: 'Healing & Processing', icon: '🩹', description: 'Tending to sensitive feelings with compassion.' },
  { type: 'peaceful', label: 'Grounded & Peaceful', icon: '🌿', description: 'Stepping in from a balanced, serene space.' }
];

export function getRandomCards(count: number): { card: TarotCard; orientation: 'upright' | 'reversed' }[] {
  const shuffled = [...FULL_DECK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    card,
    orientation: Math.random() >= 0.5 ? 'upright' : 'reversed'
  }));
}
