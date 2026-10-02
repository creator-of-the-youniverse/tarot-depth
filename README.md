# Tarot Depth — Sacred Arcana & Symbolic Journal

> **Creator Of The Youniverse**  
> *A quiet sanctuary for archetypal wisdom, introspective reflection, and contemplative journaling.*

---

## 🌟 Overview

**Tarot Depth** is an introspective tarot reading and private journaling progressive web application. Designed around intentionality, psychological depth, and mindful contemplation, Tarot Depth replaces superstitious fortune-telling with introspective symbolic reflection, customized spread geometries, and an evolving multi-layered harmonic soundscape.

---

## ✨ Features

- **Sacred Arcana Deck**: Complete 78-card Rider-Waite-Smith inspired tarot system with upright and reversed interpretations, psychological shadows, guidance prompts, and archetype breakdowns.
- **Procedural Shuffle Animation**: Physically modeled 3D card shuffling with riffle, fan, and cut choreographies prior to drawing.
- **Harmonic Ambient Soundscape Engine**:
  - Web Audio API physically synthesized multi-layered meditative soundscape.
  - 4 harmonic frequency presets:
    - **432 Hz** Sacred Sanctuary (A Major Pentatonic & Heart Theta entrainment)
    - **216 Hz** Cosmic Starlight (Schumann Earth resonance & harp motifs)
    - **136.1 Hz** Tibetan Temple OM (Sub-bass fundamental & Delta brainwave pulse)
    - **528 Hz** Solfeggio Transformation (Miracle renewal frequency)
  - Physically modeled Tibetan Singing Bowls and Crystal Harp cascades.
  - Dedicated Navbar volume control slider with smooth linear audio ramping and persistent memory.
- **Diverse Tarot Spreads & Custom Spread Builder**:
  - Single Card Daily Reflection
  - Past / Present / Future Three-Card Spread
  - 10-Card Celtic Cross & Relationship Mirror Spreads
  - Custom spread geometry designer with user-defined positions and card questions.
- **Private Journal & Archetype Pattern Tracker**:
  - Securely saved reading logs with personal reflections, mood tracking, and tags.
  - Archetype stats and suit distribution analytics.
- **Zodiac & Astrological Synastry**: Daily astrological reflections correlated with tarot archetypes.
- **Progressive Web App (PWA)**: Offline-first design with service worker caching and home screen installability.

---

## 🛠 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Audio Engine**: Native [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (Zero external audio samples; 100% procedural synthesis)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) & Firebase Authentication
- **Server**: Node.js with [Express](https://expressjs.com/) and TSX middleware

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Creator-Of-The-Youniverse/tarot-depth.git

# Navigate to project directory
cd tarot-depth

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev
```

Visit `http://localhost:3000` to enter the sanctuary.

### Building for Production

```bash
# Compile and build the production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🔒 Security & Privacy

- All personal journal notes and readings are scoped strictly to authenticated users via Firestore security rules (`firestore.rules`).
- Ethical disclaimer modal integrated into all readings emphasizing personal agency, psychological reflection, and mindfulness over fatalism.

---

## 📜 License

Created with care for **Creator Of The Youniverse**.
All rights reserved.
