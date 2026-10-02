// Web Audio API Advanced Generative Meditative Soundscape Engine
// Rich, evolving multi-layered atmospheric soundscape featuring:
// - Stereo-panned harmonic pad oscillators with slow analog pitch drift & micro-tremolo
// - Sub-bass grounding fundamental for deep visceral resonance
// - True binaural theta / delta / Schumann resonance brainwave entrainment
// - Multi-harmonic Tibetan & Crystal Singing Bowl physically-modeled overtone strikes
// - Generative spatial crystal harp arpeggios & cascading bell chimes
// - Diaphragmatic breathing LFO filter swells & dual-band cosmic wind noise
// - Stereo feedback delay matrix for cavernous spatial immersion
// - Organic Markov harmonic chord progression engine with dynamic phrase lengths

export type SoundscapePreset = 'sanctuary' | 'cosmic' | 'temple' | 'solfeggio';

export interface SoundscapeState {
  isPlaying: boolean;
  preset: SoundscapePreset;
  volume: number;
}

export interface PresetInfo {
  id: SoundscapePreset;
  title: string;
  subtitle: string;
  rootFreq: string;
  description: string;
}

export const SOUNDSCAPE_PRESETS: PresetInfo[] = [
  {
    id: 'sanctuary',
    title: 'Sacred Sanctuary (432 Hz)',
    subtitle: 'Warm A Major Pentatonic & Heart Theta Beat',
    rootFreq: '432 Hz / 4.5 Hz Theta',
    description: 'Acoustic warm string pads, 4.5Hz theta entrainment, diaphragmatic breath sweeps, and golden crystal bell cascades.'
  },
  {
    id: 'cosmic',
    title: 'Cosmic Starlight (216 Hz)',
    subtitle: 'Obsidian Velvet & Schumann Resonance',
    rootFreq: '216 Hz / 7.83 Hz Earth',
    description: 'Deep celestial drone with 7.83Hz Earth Schumann resonance, spatial harp motifs, and cosmic starlight breezes.'
  },
  {
    id: 'temple',
    title: 'Tibetan Temple OM (136.1 Hz)',
    subtitle: 'Deep Earth OM & Gong Overtone Bowls',
    rootFreq: '136.1 Hz / 3.5 Hz Delta',
    description: 'Ancient Earth C# frequency with sub-bass fundamental, deep delta entrainment, and authentic singing bowl overtones.'
  },
  {
    id: 'solfeggio',
    title: 'Solfeggio Transformation (528 Hz)',
    subtitle: 'Miracle Frequency & Sacred Geometry',
    rootFreq: '528 Hz / 5.28 Hz Wave',
    description: 'Sacred 528Hz renewal frequency, shimmering high-register crystal bowl chimes, and lush spatial delay tails.'
  }
];

interface PresetConfig {
  root: number;
  subFreq: number;
  droneFreqs: number[];
  chimeScale: number[];
  bowlOvertones: number[]; // Overtone multipliers relative to root
  cutoffMin: number;
  cutoffMax: number;
  binauralBeat: number; // Hz (e.g. 4.5 for theta, 7.83 for Schumann)
  chordProgression: number[][]; // Multi-stage chord progression
}

const PRESET_CONFIGS: Record<SoundscapePreset, PresetConfig> = {
  sanctuary: {
    root: 432,
    subFreq: 54, // Deep sub fundamental (A0)
    droneFreqs: [108.0, 162.0, 216.0, 270.0, 324.0, 432.0],
    chimeScale: [432.0, 540.0, 648.0, 720.0, 864.0, 1080.0, 1296.0, 1620.0],
    bowlOvertones: [1.0, 2.76, 5.4, 8.93, 11.2],
    cutoffMin: 220,
    cutoffMax: 880,
    binauralBeat: 4.5, // 4.5 Hz Theta wave
    chordProgression: [
      [108.0, 162.0, 216.0, 270.0], // Sanctuary I (A Major Pentatonic)
      [108.0, 144.0, 216.0, 288.0], // Sanctuary IV (D Major Pentatonic)
      [121.5, 162.0, 243.0, 324.0], // Sanctuary V (E Major Pentatonic)
      [96.0,  144.0, 192.0, 288.0], // Sanctuary vi (F# Minor Pentatonic)
      [108.0, 162.0, 243.0, 324.0], // Sanctuary I add9
    ],
  },
  cosmic: {
    root: 216,
    subFreq: 54, // Deep sub cosmic fundamental
    droneFreqs: [86.4, 129.6, 172.8, 259.2, 345.6, 518.4],
    chimeScale: [345.6, 432.0, 518.4, 691.2, 864.0, 1036.8, 1382.4, 1728.0],
    bowlOvertones: [1.0, 2.81, 5.25, 8.4, 12.1],
    cutoffMin: 180,
    cutoffMax: 720,
    binauralBeat: 7.83, // Schumann Earth Resonance
    chordProgression: [
      [86.4, 129.6, 172.8, 259.2], // Cosmic Starlight I
      [86.4, 115.2, 172.8, 230.4], // Cosmic IV
      [97.2, 129.6, 194.4, 259.2], // Cosmic V
      [76.8, 115.2, 153.6, 230.4], // Cosmic vi
      [108.0, 162.0, 216.0, 324.0], // Deep Space Void
    ],
  },
  temple: {
    root: 136.1, // Earth OM C#
    subFreq: 34.025, // Deep sub OM fundamental
    droneFreqs: [68.05, 136.1, 204.15, 272.2, 408.3, 544.4],
    chimeScale: [272.2, 326.6, 408.3, 544.4, 653.2, 816.6, 1088.8, 1361.0],
    bowlOvertones: [1.0, 2.71, 5.12, 8.15, 11.8],
    cutoffMin: 160,
    cutoffMax: 920,
    binauralBeat: 3.5, // Delta Deep Meditation Beat
    chordProgression: [
      [68.05, 136.1, 204.15, 272.2], // OM Fundamental
      [68.05, 136.1, 181.47, 272.2], // OM Sub-harmonic
      [76.56, 136.1, 204.15, 306.2], // Temple Bell Solstice
      [60.49, 120.98, 181.47, 241.96], // Ancient Sanctum
      [68.05, 153.11, 204.15, 272.2], // OM Overtones
    ],
  },
  solfeggio: {
    root: 528, // Solfeggio Miracle Frequency
    subFreq: 66.0, // Sub octave
    droneFreqs: [132.0, 264.0, 396.0, 528.0, 660.0, 792.0],
    chimeScale: [528.0, 660.0, 792.0, 1056.0, 1320.0, 1584.0, 2112.0],
    bowlOvertones: [1.0, 2.85, 5.5, 9.2, 12.8],
    cutoffMin: 280,
    cutoffMax: 1100,
    binauralBeat: 5.28, // Miracle wave frequency
    chordProgression: [
      [132.0, 264.0, 396.0, 528.0], // Miracle 528Hz Base
      [132.0, 198.0, 396.0, 528.0], // Transformation IV
      [148.5, 297.0, 445.5, 594.0], // Clarity V
      [118.8, 237.6, 356.4, 475.2], // Renewal vi
      [132.0, 264.0, 528.0, 660.0], // Solfeggio Harmonic Peak
    ],
  },
};

interface DroneVoice {
  oscSine: OscillatorNode;
  oscTri: OscillatorNode;
  oscGain: GainNode;
  panner?: StereoPannerNode;
  vibrato: OscillatorNode;
  vibratoGain: GainNode;
  tremolo: OscillatorNode;
  tremoloGain: GainNode;
  panLfo: OscillatorNode;
  panLfoGain: GainNode;
  baseFreq: number;
}

const getInitialVolume = (): number => {
  try {
    const saved = localStorage.getItem('tarot_soundscape_volume');
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }
  return 0.40; // Default 40% meditative listening level
};

class AmbientSoundManager {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentPreset: SoundscapePreset = 'sanctuary';
  private volume: number = getInitialVolume(); // Normalized 0.0 to 1.0
  private readonly MAX_GAIN: number = 0.22;
  private masterGain: GainNode | null = null;
  private delayNodeLeft: DelayNode | null = null;
  private delayNodeRight: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;

  // Synthesis Layers
  private droneVoices: DroneVoice[] = [];
  private subOscillator: OscillatorNode | null = null;
  private subGain: GainNode | null = null;

  // Binaural Beat Oscillators
  private binauralLeftOsc: OscillatorNode | null = null;
  private binauralRightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;

  // Breath & Atmospheric Noise Filters
  private breathLfo: OscillatorNode | null = null;
  private mainFilter: BiquadFilterNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseFilter1: BiquadFilterNode | null = null;
  private noiseFilter2: BiquadFilterNode | null = null;
  private noiseLfo: OscillatorNode | null = null;

  // Timers and State Handles
  private chordIntervalId: ReturnType<typeof setInterval> | null = null;
  private motifTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private bowlTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private currentChordIndex: number = 0;

  private listeners: Set<(state: SoundscapeState) => void> = new Set();

  public subscribe(callback: (state: SoundscapeState) => void) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getState(): SoundscapeState {
    return {
      isPlaying: this.isPlaying,
      preset: this.currentPreset,
      volume: this.volume,
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setPreset(preset: SoundscapePreset) {
    if (this.currentPreset === preset && this.isPlaying) return;
    this.currentPreset = preset;
    if (this.isPlaying) {
      this.stop();
      setTimeout(() => this.start(), 350);
    } else {
      this.notify();
    }
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;
    try {
      localStorage.setItem('tarot_soundscape_volume', String(clamped));
    } catch {
      /* ignore */
    }

    if (this.masterGain && this.audioCtx && this.isPlaying) {
      const now = this.audioCtx.currentTime;
      const targetGain = clamped === 0 ? 0.00001 : clamped * this.MAX_GAIN;
      try {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.08);
      } catch {
        this.masterGain.gain.value = targetGain;
      }
    }
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  public start() {
    try {
      if (!this.audioCtx) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const config = PRESET_CONFIGS[this.currentPreset];

      // Clean up previous nodes and timers
      this.clearAllTimersAndNodes();

      // Master gain node
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, now);
      const targetGain = this.volume === 0 ? 0.00001 : this.volume * this.MAX_GAIN;
      this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 2.5);

      // Main Lowpass Filter for Warmth & Diaphragmatic Breath Sweeps
      this.mainFilter = ctx.createBiquadFilter();
      this.mainFilter.type = 'lowpass';
      this.mainFilter.frequency.setValueAtTime(config.cutoffMin, now);
      this.mainFilter.Q.setValueAtTime(1.4, now);

      this.masterGain.connect(this.mainFilter);

      // --- SPATIAL STEREO DELAY / REVERB MATRIX ---
      if (ctx.createDelay && ctx.createStereoPanner) {
        this.delayNodeLeft = ctx.createDelay();
        this.delayNodeRight = ctx.createDelay();
        this.delayFeedbackGain = ctx.createGain();

        this.delayNodeLeft.delayTime.setValueAtTime(0.48, now); // 480ms cross delay
        this.delayNodeRight.delayTime.setValueAtTime(0.72, now); // 720ms cross delay
        this.delayFeedbackGain.gain.setValueAtTime(0.28, now); // Soft spatial tail

        const delayPannerL = ctx.createStereoPanner();
        const delayPannerR = ctx.createStereoPanner();
        delayPannerL.pan.setValueAtTime(-0.6, now);
        delayPannerR.pan.setValueAtTime(0.6, now);

        // Feedback loop
        this.masterGain.connect(this.delayNodeLeft);
        this.delayNodeLeft.connect(this.delayNodeRight);
        this.delayNodeRight.connect(this.delayFeedbackGain);
        this.delayFeedbackGain.connect(this.delayNodeLeft);

        this.delayNodeLeft.connect(delayPannerL);
        this.delayNodeRight.connect(delayPannerR);

        delayPannerL.connect(ctx.destination);
        delayPannerR.connect(ctx.destination);
      }

      this.mainFilter.connect(ctx.destination);

      // --- 1. SUB-BASS GROUNDING FUNDAMENTAL LAYER ---
      this.subOscillator = ctx.createOscillator();
      this.subGain = ctx.createGain();
      this.subOscillator.type = 'sine';
      this.subOscillator.frequency.setValueAtTime(config.subFreq, now);

      // Sub-bass slow breathing pulse
      const subLfo = ctx.createOscillator();
      const subLfoGain = ctx.createGain();
      subLfo.type = 'sine';
      subLfo.frequency.setValueAtTime(0.06, now); // ~16s cycle
      subLfoGain.gain.setValueAtTime(0.04, now);

      this.subGain.gain.setValueAtTime(0.22, now);
      subLfo.connect(subLfoGain);
      subLfoGain.connect(this.subGain.gain);

      this.subOscillator.connect(this.subGain);
      this.subGain.connect(this.masterGain);

      subLfo.start(now);
      this.subOscillator.start(now);

      // --- 2. BINAURAL BRAINWAVE ENTRAINMENT TONES ---
      if (ctx.createStereoPanner) {
        const binauralBase = config.root / 2; // Mid-register base tone
        const beatFreq = config.binauralBeat;

        this.binauralLeftOsc = ctx.createOscillator();
        this.binauralRightOsc = ctx.createOscillator();
        this.binauralGain = ctx.createGain();

        this.binauralLeftOsc.type = 'sine';
        this.binauralRightOsc.type = 'sine';

        this.binauralLeftOsc.frequency.setValueAtTime(binauralBase, now);
        this.binauralRightOsc.frequency.setValueAtTime(binauralBase + beatFreq, now);

        const leftPanner = ctx.createStereoPanner();
        const rightPanner = ctx.createStereoPanner();
        leftPanner.pan.setValueAtTime(-0.85, now);
        rightPanner.pan.setValueAtTime(0.85, now);

        this.binauralGain.gain.setValueAtTime(0.08, now);

        this.binauralLeftOsc.connect(leftPanner);
        this.binauralRightOsc.connect(rightPanner);

        leftPanner.connect(this.binauralGain);
        rightPanner.connect(this.binauralGain);

        this.binauralGain.connect(this.masterGain);

        this.binauralLeftOsc.start(now);
        this.binauralRightOsc.start(now);
      }

      // --- 3. DYNAMIC STEREO HARMONIC PAD VOICES WITH MICRO-VIBRATO & TREMOLO ---
      this.droneVoices = [];
      const initialChord = config.chordProgression[0];

      initialChord.forEach((freq, idx) => {
        const oscSine = ctx.createOscillator();
        const oscTri = ctx.createOscillator();
        const oscGain = ctx.createGain();

        let panner: StereoPannerNode | undefined;
        if (ctx.createStereoPanner) {
          panner = ctx.createStereoPanner();
          // Spread initial pan from -0.7 to +0.7
          const initialPan = (idx / (initialChord.length - 1)) * 1.4 - 0.7;
          panner.pan.setValueAtTime(initialPan, now);
        }

        // LFO 1: Pitch Vibrato (Analog pitch drift)
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        const vibratoSpeed = 0.04 + idx * 0.02 + Math.random() * 0.03;
        const vibratoDepth = 1.2 + idx * 0.6; // Cents/Hz drift

        vibrato.type = 'sine';
        vibrato.frequency.setValueAtTime(vibratoSpeed, now);
        vibratoGain.gain.setValueAtTime(vibratoDepth, now);

        vibrato.connect(oscSine.frequency);
        vibrato.connect(oscTri.frequency);
        vibrato.start(now);

        // LFO 2: Amplitude Tremolo (Swell modulation)
        const tremolo = ctx.createOscillator();
        const tremoloGain = ctx.createGain();
        const tremoloSpeed = 0.07 + idx * 0.03;

        tremolo.type = 'sine';
        tremolo.frequency.setValueAtTime(tremoloSpeed, now);
        tremoloGain.gain.setValueAtTime(0.05, now); // Gentle tremolo amplitude

        tremolo.connect(oscGain.gain);
        tremolo.start(now);

        // LFO 3: Slow Stereo Pan Swaying
        const panLfo = ctx.createOscillator();
        const panLfoGain = ctx.createGain();
        panLfo.type = 'sine';
        panLfo.frequency.setValueAtTime(0.03 + idx * 0.015, now);
        panLfoGain.gain.setValueAtTime(0.35, now);

        if (panner) {
          panLfo.connect(panLfoGain);
          panLfoGain.connect(panner.pan);
        }
        panLfo.start(now);

        // Waveforms
        oscSine.type = 'sine';
        oscTri.type = idx % 2 === 0 ? 'triangle' : 'sine';

        oscSine.frequency.setValueAtTime(freq, now);
        oscTri.frequency.setValueAtTime(freq * 1.0015, now); // Micro-detune for warmth

        const voiceVol = idx === 0 ? 0.30 : idx === 1 ? 0.22 : idx === 2 ? 0.16 : 0.11;
        oscGain.gain.setValueAtTime(voiceVol, now);

        oscSine.connect(oscGain);
        oscTri.connect(oscGain);

        if (panner) {
          oscGain.connect(panner);
          panner.connect(this.masterGain!);
        } else {
          oscGain.connect(this.masterGain!);
        }

        oscSine.start(now);
        oscTri.start(now);

        this.droneVoices.push({
          oscSine,
          oscTri,
          oscGain,
          panner,
          vibrato,
          vibratoGain,
          tremolo,
          tremoloGain,
          panLfo,
          panLfoGain,
          baseFreq: freq,
        });
      });

      // --- 4. DIAPHRAGMATIC BREATHING LFO (Filter Sweep ~12s Cycle) ---
      this.breathLfo = ctx.createOscillator();
      const breathLfoGain = ctx.createGain();

      this.breathLfo.type = 'sine';
      this.breathLfo.frequency.setValueAtTime(0.083, now); // ~12s breathing cycle (6s in, 6s out)

      const filterRange = config.cutoffMax - config.cutoffMin;
      breathLfoGain.gain.setValueAtTime(filterRange / 2, now);

      this.mainFilter.frequency.setValueAtTime(config.cutoffMin + filterRange / 2, now);
      this.breathLfo.connect(breathLfoGain);
      breathLfoGain.connect(this.mainFilter.frequency);

      this.breathLfo.start(now);

      // --- 5. ORGANIC PINK NOISE (COSMIC WIND / OCEAN TIDES) ---
      const bufferSize = ctx.sampleRate * 5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.02; // Very soft organic background floor
        b6 = white * 0.115926;
      }

      this.noiseNode = ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.noiseFilter1 = ctx.createBiquadFilter();
      this.noiseFilter1.type = 'bandpass';
      this.noiseFilter1.frequency.setValueAtTime(340, now);
      this.noiseFilter1.Q.setValueAtTime(2.2, now);

      // Wind modulation LFO
      this.noiseLfo = ctx.createOscillator();
      const noiseLfoGain = ctx.createGain();
      this.noiseLfo.type = 'sine';
      this.noiseLfo.frequency.setValueAtTime(0.045, now); // Slow wind wave cycle
      noiseLfoGain.gain.setValueAtTime(180, now);

      this.noiseLfo.connect(noiseLfoGain);
      noiseLfoGain.connect(this.noiseFilter1.frequency);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, now);

      this.noiseNode.connect(this.noiseFilter1);
      this.noiseFilter1.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      this.noiseLfo.start(now);
      this.noiseNode.start(now);

      // --- 6. MARKOV HARMONIC CHORD TRANSITION ENGINE ---
      this.currentChordIndex = 0;
      this.chordIntervalId = setInterval(() => {
        if (!this.isPlaying || !this.audioCtx) return;
        this.transitionToNextChord();
      }, 11000);

      // --- 7. GENERATIVE CRYSTAL CHIMES & TIBETAN SINGING BOWLS ---
      this.scheduleRandomMotif();
      this.scheduleSingingBowl();

      this.isPlaying = true;
      this.notify();
    } catch (err) {
      console.warn('Ambient sound playback error:', err);
      this.isPlaying = false;
      this.notify();
    }
  }

  // Smoothly glides drone voice frequencies and pan positions to the next chord stage
  private transitionToNextChord() {
    if (!this.audioCtx || !this.masterGain) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const config = PRESET_CONFIGS[this.currentPreset];

    this.currentChordIndex = (this.currentChordIndex + 1) % config.chordProgression.length;
    const newChord = config.chordProgression[this.currentChordIndex];

    this.droneVoices.forEach((voice, idx) => {
      const targetFreq = newChord[idx % newChord.length];
      if (targetFreq) {
        // Exponential glide over 7 seconds for lush organic movement
        voice.oscSine.frequency.exponentialRampToValueAtTime(targetFreq, now + 7.0);
        voice.oscTri.frequency.exponentialRampToValueAtTime(targetFreq * 1.0015, now + 7.0);
      }
    });
  }

  // Schedules periodic crystal harp motifs or bell chimes
  private scheduleRandomMotif() {
    if (!this.isPlaying) return;

    const delayMs = 3200 + Math.random() * 4500;

    this.motifTimeoutId = setTimeout(() => {
      if (this.isPlaying) {
        const rand = Math.random();
        if (rand < 0.25) {
          this.triggerCrystalCascade();
        } else if (rand < 0.60) {
          this.triggerArpeggioMotif();
        } else {
          this.triggerChime();
        }
        this.scheduleRandomMotif();
      }
    }, delayMs);
  }

  // Schedules deep resonant Tibetan or Crystal Singing Bowl strikes
  private scheduleSingingBowl() {
    if (!this.isPlaying) return;

    const delayMs = 9000 + Math.random() * 8000; // Strikes every ~9-17s

    this.bowlTimeoutId = setTimeout(() => {
      if (this.isPlaying) {
        this.triggerSingingBowl();
        this.scheduleSingingBowl();
      }
    }, delayMs);
  }

  // Physically models a Tibetan or Crystal Singing Bowl strike with overtone partials
  public triggerSingingBowl() {
    if (!this.audioCtx || !this.masterGain) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const config = PRESET_CONFIGS[this.currentPreset];

    const baseFreq = config.root;
    const overtones = config.bowlOvertones;

    overtones.forEach((multiplier, idx) => {
      const partialFreq = baseFreq * multiplier;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(partialFreq, now);

      // Pitch wobble / beating on bowl overtones
      const pitchLfo = ctx.createOscillator();
      const pitchLfoGain = ctx.createGain();
      pitchLfo.type = 'sine';
      pitchLfo.frequency.setValueAtTime(1.8 + idx * 0.4, now); // ~2Hz bowl shimmer
      pitchLfoGain.gain.setValueAtTime(partialFreq * 0.003, now);

      pitchLfo.connect(osc.frequency);
      pitchLfo.start(now);

      // Volume envelope: instant strike, exponential long decay (6s - 10s)
      const partialVol = (0.08 / (idx + 1)) * (0.8 + Math.random() * 0.4);
      const decayTime = 5.5 + (overtones.length - idx) * 1.0;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(partialVol, now + 0.06); // Soft mallet attack
      gain.gain.exponentialRampToValueAtTime(0.00001, now + decayTime);

      let panner: StereoPannerNode | undefined;
      if (ctx.createStereoPanner) {
        panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime((Math.random() - 0.5) * 0.8, now);
      }

      osc.connect(gain);
      if (panner) {
        gain.connect(panner);
        panner.connect(this.masterGain!);
        if (this.delayNodeLeft) panner.connect(this.delayNodeLeft);
      } else {
        gain.connect(this.masterGain!);
        if (this.delayNodeLeft) gain.connect(this.delayNodeLeft);
      }

      osc.start(now);
      osc.stop(now + decayTime + 0.1);
    });
  }

  // Single crystalline chime strike
  public triggerChime() {
    if (!this.audioCtx || !this.masterGain) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const config = PRESET_CONFIGS[this.currentPreset];

    const scale = config.chimeScale;
    const freq = scale[Math.floor(Math.random() * scale.length)];

    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();

    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(freq, now);

    const bellVol = 0.06 + Math.random() * 0.04;
    chimeGain.gain.setValueAtTime(0.0001, now);
    chimeGain.gain.linearRampToValueAtTime(bellVol, now + 0.03);
    chimeGain.gain.exponentialRampToValueAtTime(0.00001, now + 4.8);

    const chimeFilter = ctx.createBiquadFilter();
    chimeFilter.type = 'highpass';
    chimeFilter.frequency.setValueAtTime(260, now);

    let panner: StereoPannerNode | undefined;
    if (ctx.createStereoPanner) {
      panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime((Math.random() - 0.5) * 1.2, now);
    }

    chimeOsc.connect(chimeFilter);
    chimeFilter.connect(chimeGain);

    if (panner) {
      chimeGain.connect(panner);
      panner.connect(this.masterGain);
      if (this.delayNodeLeft) panner.connect(this.delayNodeLeft);
    } else {
      chimeGain.connect(this.masterGain);
      if (this.delayNodeLeft) chimeGain.connect(this.delayNodeLeft);
    }

    chimeOsc.start(now);
    chimeOsc.stop(now + 5.0);
  }

  // 3-note ascending arpeggio motif
  public triggerArpeggioMotif() {
    if (!this.audioCtx || !this.masterGain) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const config = PRESET_CONFIGS[this.currentPreset];
    const scale = config.chimeScale;

    const startIndex = Math.floor(Math.random() * (scale.length - 3));
    const notes = [scale[startIndex], scale[startIndex + 1], scale[startIndex + 2]];

    notes.forEach((freq, i) => {
      if (!this.audioCtx || !this.masterGain) return;
      const noteTime = now + i * 0.38;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      const noteVol = 0.055 - i * 0.008;
      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(noteVol, noteTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.00001, noteTime + 4.0);

      let panner: StereoPannerNode | undefined;
      if (this.audioCtx.createStereoPanner) {
        panner = this.audioCtx.createStereoPanner();
        panner.pan.setValueAtTime(-0.6 + i * 0.6, noteTime);
      }

      osc.connect(gain);
      if (panner) {
        gain.connect(panner);
        panner.connect(this.masterGain!);
        if (this.delayNodeLeft) panner.connect(this.delayNodeLeft);
      } else {
        gain.connect(this.masterGain!);
        if (this.delayNodeLeft) gain.connect(this.delayNodeLeft);
      }

      osc.start(noteTime);
      osc.stop(noteTime + 4.1);
    });
  }

  // Cascading celestial harp shower (5-note rippling waterfall)
  public triggerCrystalCascade() {
    if (!this.audioCtx || !this.masterGain) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const config = PRESET_CONFIGS[this.currentPreset];
    const scale = config.chimeScale;

    // Pick 5 high pentatonic notes
    const available = scale.slice(1);
    const notes: number[] = [];
    for (let i = 0; i < 5; i++) {
      notes.push(available[Math.floor(Math.random() * available.length)]);
    }

    notes.forEach((freq, i) => {
      if (!this.audioCtx || !this.masterGain) return;
      const noteTime = now + i * 0.18; // Fast ripple 180ms delay

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      const vol = 0.045 * (1 - i * 0.12);
      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(vol, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.00001, noteTime + 3.8);

      let panner: StereoPannerNode | undefined;
      if (this.audioCtx.createStereoPanner) {
        panner = this.audioCtx.createStereoPanner();
        panner.pan.setValueAtTime(-0.8 + (i / 4) * 1.6, noteTime); // Sweeps across left to right
      }

      osc.connect(gain);
      if (panner) {
        gain.connect(panner);
        panner.connect(this.masterGain!);
        if (this.delayNodeLeft) panner.connect(this.delayNodeLeft);
      } else {
        gain.connect(this.masterGain!);
        if (this.delayNodeLeft) gain.connect(this.delayNodeLeft);
      }

      osc.start(noteTime);
      osc.stop(noteTime + 4.0);
    });
  }

  private clearAllTimersAndNodes() {
    if (this.chordIntervalId) {
      clearInterval(this.chordIntervalId);
      this.chordIntervalId = null;
    }
    if (this.motifTimeoutId) {
      clearTimeout(this.motifTimeoutId);
      this.motifTimeoutId = null;
    }
    if (this.bowlTimeoutId) {
      clearTimeout(this.bowlTimeoutId);
      this.bowlTimeoutId = null;
    }

    this.droneVoices.forEach((item) => {
      try {
        item.vibrato.stop();
        item.vibrato.disconnect();
        item.tremolo.stop();
        item.tremolo.disconnect();
        item.panLfo.stop();
        item.panLfo.disconnect();
        item.oscSine.stop();
        item.oscSine.disconnect();
        item.oscTri.stop();
        item.oscTri.disconnect();
      } catch {
        /* ignore */
      }
    });
    this.droneVoices = [];

    if (this.subOscillator) {
      try {
        this.subOscillator.stop();
        this.subOscillator.disconnect();
      } catch {
        /* ignore */
      }
      this.subOscillator = null;
    }

    if (this.binauralLeftOsc) {
      try {
        this.binauralLeftOsc.stop();
        this.binauralLeftOsc.disconnect();
        this.binauralRightOsc?.stop();
        this.binauralRightOsc?.disconnect();
      } catch {
        /* ignore */
      }
      this.binauralLeftOsc = null;
      this.binauralRightOsc = null;
    }

    if (this.breathLfo) {
      try {
        this.breathLfo.stop();
        this.breathLfo.disconnect();
      } catch {
        /* ignore */
      }
      this.breathLfo = null;
    }

    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
        this.noiseLfo?.stop();
        this.noiseLfo?.disconnect();
      } catch {
        /* ignore */
      }
      this.noiseNode = null;
      this.noiseLfo = null;
    }
  }

  public stop() {
    if (!this.audioCtx || !this.isPlaying) return;

    try {
      const now = this.audioCtx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
      }

      setTimeout(() => {
        this.clearAllTimersAndNodes();
      }, 1200);

      this.isPlaying = false;
      this.notify();
    } catch (err) {
      console.warn('Error stopping ambient sound:', err);
      this.isPlaying = false;
      this.notify();
    }
  }
}

export const ambientSound = new AmbientSoundManager();
