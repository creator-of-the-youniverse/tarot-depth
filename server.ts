import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// System prompt for Tarot interpretations
const TAROT_SYSTEM_INSTRUCTION = `
You are Tarot Depth's AI interpretation assistant—a thoughtful, calm, deeply symbolic, and compassionate mentor focused on personal reflection, mindfulness, self-inquiry, and symbolic wisdom.

CORE RULES:
1. Always frame readings as symbolic, reflective, and interpretive—NEVER as certain, absolute, or prophetic.
2. NEVER claim to predict the future with absolute certainty.
3. NEVER provide medical, legal, financial, or emergency advice. If asked, gently state that tarot is a mirror for personal reflection and redirect to professional resources or inward inquiry.
4. If the question asks for harmful, manipulative, obsessive, or dependency-based guidance (e.g. spying on an ex, forcing someone's will), gently refuse and redirect toward healthy self-reflection, boundary work, and personal agency.
5. If the user asks for very specific deterministic predictions ("Will I pass the exam tomorrow?"), translate it into symbolic possibilities and actionable internal focus (e.g. preparation, calm focus, trusting your study).
6. Tone: Warm, serene, mysterious, highly articulate, elegant, and supportive. Avoid theatrical or exaggerated horror/gloom stereotypes (e.g. do not treat Death or The Tower as literal doom; treat them as transformation and awakening).
7. Disclaimer statement: Keep an underlying stance of entertainment, symbolic guidance, and personal reflection.

MANDATORY STRUCTURED RESPONSE FORMAT:
You MUST structure every reading response into these exact 7 numbered sections with clear Markdown headers:

### 1. Spread Overview
A high-level synthesis of the energetic landscape, underlying atmosphere, and overarching theme of this draw.

### 2. Card-by-Card Meanings
For each card in the spread, list:
- **[Position Name]**: **[Card Name] ([Upright or Reversed])**
  A nuanced breakdown connecting the card's archetype, symbolism, and key keywords directly to its position in the spread.

### 3. Combined Message
How these cards interact, converse, and weave together into a cohesive reflective story or lesson.

### 4. Tensions or Contradictions
Identify any subtle frictions, opposing elements, or internal dualities between the drawn cards (e.g. Fire vs Water, sudden change vs grounded patience).

### 5. Reflection Questions
Provide 3 thought-provoking, deep self-inquiry questions derived from the reading.

### 6. Journaling Prompt
A single, evocative journaling prompt to help the user write in their private Tarot Depth journal.

### 7. Closing Affirmation
A concise (1-2 sentences), grounding, empowering affirmation to close the reflection.
`;

// API Route: Interpret Tarot Spread
app.post('/api/interpret', async (req, res) => {
  try {
    const { question, spreadTitle, spreadType, cards, mood, notes } = req.body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ error: 'Cards array is required.' });
    }

    const ai = getGeminiClient();

    const cardDetailsFormatted = cards.map((c: any, index: number) => {
      return `Position ${index + 1} (${c.positionName || 'Card'}): ${c.name} (${c.orientation?.toUpperCase() || 'UPRIGHT'})
      - Position Description: ${c.positionDescription || 'N/A'}
      - Key Archetype / Keywords: ${c.keywords ? c.keywords.join(', ') : 'N/A'}
      - Symbolism: ${c.symbolism || 'N/A'}`;
    }).join('\n\n');

    const promptText = `
User Inquiry / Topic: "${question || 'General check-in and self-reflection'}"
Spread Type: ${spreadTitle || spreadType}
User Mindset / Mood: ${mood || 'Open'}
User Additional Context: ${notes || 'None provided'}

Cards Drawn in Spread:
${cardDetailsFormatted}

Please generate a deep, elegant, reflective Tarot interpretation following the 7 mandatory sections strictly.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: TAROT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const interpretationText = response.text || 'Unable to generate interpretation at this time.';

    return res.json({
      interpretation: interpretationText,
      spreadTitle,
      question
    });
  } catch (error: any) {
    console.error('Gemini Interpretation API error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate tarot interpretation.'
    });
  }
});

// API Route: Pattern Summary (Synthesize themes across past readings)
app.post('/api/patterns/summary', async (req, res) => {
  try {
    const { readings } = req.body;

    if (!readings || !Array.isArray(readings) || readings.length === 0) {
      return res.status(400).json({ error: 'Readings list is required for pattern summary.' });
    }

    const ai = getGeminiClient();

    const readingsSummary = readings.slice(0, 15).map((r: any, idx: number) => {
      const cardList = r.cards ? r.cards.map((c: any) => `${c.name} (${c.orientation})`).join(', ') : '';
      return `Reading ${idx + 1} (${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}):
- Question: "${r.question}"
- Spread: ${r.spreadTitle || r.spreadType}
- Mood: ${r.mood || 'Unspecified'}
- Cards: ${cardList}`;
    }).join('\n');

    const prompt = `
Analyze these past ${readings.length} tarot reflection sessions for the user:

${readingsSummary}

Provide a thoughtful, serene 3-paragraph summary of recurring symbolic patterns, recurring archetypes, evolving mood trajectories, and suggested gentle practices or questions for their continuing self-growth journey.
Keep the tone warm, deeply reflective, non-judgmental, and insightful.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an insightful Tarot & Symbolic Pattern Analyst. Provide compassionate, pattern-focused synthesis.',
        temperature: 0.6,
      }
    });

    return res.json({
      patternSummary: response.text || 'No recurring patterns detected yet.'
    });
  } catch (error: any) {
    console.error('Pattern Summary API error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate pattern summary.'
    });
  }
});

// API Route: Daily Affirmation (Fresh gold-themed daily affirmation via Gemini 3.6 Flash)
app.get('/api/daily-affirmation', async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const ai = getGeminiClient();

    const prompt = `
Generate a fresh, deeply inspiring, mystical, gold-themed daily affirmation for today (${todayStr}).
Root it in tarot symbolism, inner wisdom, calm clarity, and personal sovereignty.

Requirements:
- Affirmation text: 1 to 2 evocative sentences in the first person ("I am...", "I align...", "I honor...").
- Theme: A 2-4 word poetic title/theme.
- Card Connection: Reference 1-2 major arcana or suit archetypes (e.g., "Inspired by The Star & Wheel of Fortune").
- Reflection Focus: A short 1-sentence actionable grounding exercise or mindfulness focal point for the day.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an articulate, compassionate spiritual guide creating elegant daily affirmations for a gold-accented tarot sanctuary app.',
        temperature: 0.8,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            affirmation: { type: Type.STRING, description: 'The main daily affirmation statement.' },
            theme: { type: Type.STRING, description: 'Theme title of the affirmation.' },
            cardConnection: { type: Type.STRING, description: 'Card archetype connection, e.g. Inspired by The Star' },
            reflectionFocus: { type: Type.STRING, description: 'Short daily mindfulness grounding sentence.' }
          },
          required: ['affirmation', 'theme', 'cardConnection', 'reflectionFocus']
        }
      }
    });

    const jsonStr = response.text ? response.text.trim() : '{}';
    const data = JSON.parse(jsonStr);

    return res.json({
      date: todayStr,
      affirmation: data.affirmation || 'I walk in the golden clarity of my own inner truth, honoring every phase of my growth.',
      theme: data.theme || 'Golden Sovereign Light',
      cardConnection: data.cardConnection || 'Inspired by The Sun',
      reflectionFocus: data.reflectionFocus || 'Pause today to acknowledge the quiet wisdom guiding your steps.'
    });
  } catch (error: any) {
    console.error('Daily Affirmation API error:', error);
    const todayStr = new Date().toISOString().split('T')[0];
    return res.json({
      date: todayStr,
      affirmation: 'I walk in the golden clarity of my own inner truth, honoring every phase of my growth.',
      theme: 'Golden Sovereign Light',
      cardConnection: 'Inspired by The Sun',
      reflectionFocus: 'Pause today to acknowledge the quiet wisdom guiding your steps.'
    });
  }
});

// API Route: Live AI Daily Horoscope
app.post('/api/horoscope/daily', async (req, res) => {
  try {
    const { sign, date } = req.body;
    if (!sign) {
      return res.status(400).json({ error: 'Zodiac sign is required.' });
    }

    const todayStr = date || new Date().toISOString().split('T')[0];
    const ai = getGeminiClient();

    const prompt = `
Generate an exceptionally insightful, eloquent, and deeply psychological daily horoscope reading for the zodiac sign ${sign} on ${todayStr}.
Bridge planetary astrology with tarot archetype wisdom, personal agency, and emotional grounding.

Requirements:
- overallReading: A 2-3 sentence evocative summary of today's cosmic vibe.
- energyScore: Integer between 70 and 99.
- loveInsight: 1-2 sentence guidance on romantic and interpersonal dynamics.
- careerInsight: 1-2 sentence advice on professional and creative momentum.
- spiritInsight: 1-2 sentence grounding advice for inner peace and mindfulness.
- luckyColor: A beautiful poetic color name (e.g. "Imperial Gold", "Celestial Indigo", "Sage Bronze").
- luckyNumbers: Array of 3 numbers.
- tarotArchetypeFocus: Connection to a tarot card archetype (e.g. "The Emperor (Upright) — Grounding personal authority").
- cosmicAdvice: 1 actionable takeaway sentence for the day.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an articulate, compassionate astrologer and tarot mystic. Generate deeply reflective, inspiring daily horoscopes.',
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallReading: { type: Type.STRING },
            energyScore: { type: Type.INTEGER },
            loveInsight: { type: Type.STRING },
            careerInsight: { type: Type.STRING },
            spiritInsight: { type: Type.STRING },
            luckyColor: { type: Type.STRING },
            luckyNumbers: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER }
            },
            tarotArchetypeFocus: { type: Type.STRING },
            cosmicAdvice: { type: Type.STRING }
          },
          required: ['overallReading', 'energyScore', 'loveInsight', 'careerInsight', 'spiritInsight', 'luckyColor', 'luckyNumbers', 'tarotArchetypeFocus', 'cosmicAdvice']
        }
      }
    });

    const jsonStr = response.text ? response.text.trim() : '{}';
    const data = JSON.parse(jsonStr);

    return res.json({
      sign,
      date: todayStr,
      reading: data
    });
  } catch (error: any) {
    console.error('Daily Horoscope API error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate daily horoscope.' });
  }
});

// API Route: Live AI Zodiac Synastry & Compatibility Deep-Dive
app.post('/api/horoscope/synastry', async (req, res) => {
  try {
    const { sign1, sign2 } = req.body;
    if (!sign1 || !sign2) {
      return res.status(400).json({ error: 'Both sign1 and sign2 are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `
Analyze the astrological compatibility and synastry between ${sign1} and ${sign2}.
Synthesize their elemental interaction (Fire, Earth, Air, Water), modality dynamics (Cardinal, Fixed, Mutable), and tarot archetypal meeting point.

Requirements:
- synastryScore: Integer between 65 and 98 representing overall harmony and mutual growth potential.
- headline: A evocative 3-5 word poetic title for their bond (e.g. "Passionate Spark & Grounded Sanctuary").
- romanticChemistry: 2-3 sentences on emotional and romantic synergy.
- intellectualConnection: 2 sentences on communication, mental stimulation, and joint decision making.
- frictionAndWorkarounds: 2 sentences identifying potential points of tension and how to harmoniously navigate them.
- astroTarotSynthesis: 2-3 sentences connecting their respective tarot archetypes into a unified lesson.
- growthKey: A single powerful 1-sentence takeaway for nurturing this relationship.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert astrological synastry counselor and tarot mystic. Provide profound, nuanced relationship compatibility analysis.',
        temperature: 0.75,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            synastryScore: { type: Type.INTEGER },
            headline: { type: Type.STRING },
            romanticChemistry: { type: Type.STRING },
            intellectualConnection: { type: Type.STRING },
            frictionAndWorkarounds: { type: Type.STRING },
            astroTarotSynthesis: { type: Type.STRING },
            growthKey: { type: Type.STRING }
          },
          required: ['synastryScore', 'headline', 'romanticChemistry', 'intellectualConnection', 'frictionAndWorkarounds', 'astroTarotSynthesis', 'growthKey']
        }
      }
    });

    const jsonStr = response.text ? response.text.trim() : '{}';
    const data = JSON.parse(jsonStr);

    return res.json({
      sign1,
      sign2,
      synastry: data
    });
  } catch (error: any) {
    console.error('Synastry API error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate synastry reading.' });
  }
});

async function startServer() {
  // Vite dev middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tarot Depth server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
