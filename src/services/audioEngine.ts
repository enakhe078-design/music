import { EQ_FREQUENCIES } from '../data/tracks';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private pannerNode: StereoPannerNode | null = null;
  private masterGain: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  // Ambient sound generators (Web Audio procedural synthesis)
  private ambientGains: Map<string, GainNode> = new Map();
  private ambientSources: Map<string, AudioNode[]> = new Map();

  // Synthetic procedural backup generator for zero-failure music playback
  private synthInterval: number | null = null;
  private synthGain: GainNode | null = null;
  private isSynthesizing = false;

  private isInitialized = false;

  public init(audioEl: HTMLAudioElement) {
    if (this.isInitialized && this.audioElement === audioEl) return;
    this.audioElement = audioEl;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;

      // Stereo Panner
      if (this.ctx.createStereoPanner) {
        this.pannerNode = this.ctx.createStereoPanner();
        this.pannerNode.pan.value = 0;
      }

      // Analyser Node for Visualizers
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.82;

      // 10-band Graphic EQ Filters
      this.eqFilters = EQ_FREQUENCIES.map((freq, index) => {
        const filter = this.ctx!.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === EQ_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Connect EQ chain in series
      for (let i = 0; i < this.eqFilters.length - 1; i++) {
        this.eqFilters[i].connect(this.eqFilters[i + 1]);
      }

      // Connect source element if CORS allows
      try {
        this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
        if (this.eqFilters.length > 0) {
          this.sourceNode.connect(this.eqFilters[0]);
          const lastFilter = this.eqFilters[this.eqFilters.length - 1];
          if (this.pannerNode) {
            lastFilter.connect(this.pannerNode);
            this.pannerNode.connect(this.masterGain);
          } else {
            lastFilter.connect(this.masterGain);
          }
        } else {
          this.sourceNode.connect(this.masterGain);
        }
      } catch (e) {
        console.warn('MediaElementSource initialization warning (using direct route):', e);
      }

      this.masterGain.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);

      this.isInitialized = true;
    } catch (err) {
      console.warn('Web Audio Context initialization warning:', err);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEQBand(bandIndex: number, gainDb: number) {
    if (this.eqFilters[bandIndex] && this.ctx) {
      this.eqFilters[bandIndex].gain.setTargetAtTime(gainDb, this.ctx.currentTime, 0.05);
    }
  }

  public applyEQPreset(bands: number[]) {
    bands.forEach((val, idx) => {
      this.setEQBand(idx, val);
    });
  }

  public setPanner(panValue: number) {
    if (this.pannerNode && this.ctx) {
      this.pannerNode.pan.setTargetAtTime(Math.max(-1, Math.min(1, panValue)), this.ctx.currentTime, 0.05);
    }
  }

  public setMasterGain(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public getFrequencyData(dataArray: Uint8Array<ArrayBuffer>): void {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(dataArray);
    } else {
      dataArray.fill(0);
    }
  }

  public getTimeDomainData(dataArray: Uint8Array<ArrayBuffer>): void {
    if (this.analyserNode) {
      this.analyserNode.getByteTimeDomainData(dataArray);
    } else {
      dataArray.fill(128);
    }
  }

  // ==========================================
  // PROCEDURAL AMBIENT SOUND GENERATION
  // ==========================================
  public toggleAmbientSound(type: string, enabled: boolean, volume: number = 0.5) {
    if (!this.ctx) return;
    this.resume();

    if (!enabled) {
      this.stopAmbientSound(type);
      return;
    }

    if (this.ambientSources.has(type)) {
      this.setAmbientVolume(type, volume);
      return;
    }

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(this.masterGain || this.ctx.destination);
    this.ambientGains.set(type, gainNode);

    const activeNodes: AudioNode[] = [];

    if (type === 'rain') {
      // Synthesized pink noise with bandpass for gentle rain
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
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
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1400;

      noise.connect(filter);
      filter.connect(gainNode);
      noise.start();
      activeNodes.push(noise, filter);
    } else if (type === 'vinyl') {
      // Lo-fi vinyl crackle & pops
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Sparse impulse spikes
        if (Math.random() < 0.0008) {
          data[i] = (Math.random() * 2 - 1) * 0.8;
        } else {
          data[i] = (Math.random() * 2 - 1) * 0.008; // mild tape hiss
        }
      }
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const hp = this.ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 800;

      source.connect(hp);
      hp.connect(gainNode);
      source.start();
      activeNodes.push(source, hp);
    } else if (type === 'cafe') {
      // Warm brownian room ambience with gentle low-mid murmur
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + (0.02 * white)) / 1.02;
        last = data[i];
        data[i] *= 2.5;
      }
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 450;
      filter.Q.value = 0.8;

      source.connect(filter);
      filter.connect(gainNode);
      source.start();
      activeNodes.push(source, filter);
    } else if (type === 'fire') {
      // Campfire crackle
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        if (Math.random() < 0.0015) {
          data[i] = (Math.random() * 2 - 1) * (0.4 + Math.random() * 0.6);
        } else {
          data[i] = (Math.random() * 2 - 1) * 0.004;
        }
      }
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 2200;

      source.connect(lp);
      lp.connect(gainNode);
      source.start();
      activeNodes.push(source, lp);
    } else if (type === 'thunder') {
      // Low sub-bass rumbling drone
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 45;

      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.2;
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 15;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(gainNode);
      osc.start();
      activeNodes.push(osc, lfo, lfoGain);
    }

    this.ambientSources.set(type, activeNodes);
  }

  public setAmbientVolume(type: string, volume: number) {
    const gainNode = this.ambientGains.get(type);
    if (gainNode && this.ctx) {
      gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public stopAmbientSound(type: string) {
    const nodes = this.ambientSources.get(type);
    if (nodes) {
      nodes.forEach(node => {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          try {
            (node as AudioScheduledSourceNode).stop();
          } catch {
            // ignore
          }
        }
        try {
          node.disconnect();
        } catch {
          // ignore
        }
      });
      this.ambientSources.delete(type);
    }
    const gainNode = this.ambientGains.get(type);
    if (gainNode) {
      gainNode.disconnect();
      this.ambientGains.delete(type);
    }
  }

  public stopAllAmbience() {
    Array.from(this.ambientSources.keys()).forEach(type => {
      this.stopAmbientSound(type);
    });
  }

  // ==========================================
  // PROCEDURAL SYNTHESIZER MUSIC ENGINE FALLBACK
  // Ensures audio always plays seamlessly even offline
  // ==========================================
  public startProceduralLoFi(genre: string = 'lofi') {
    if (this.isSynthesizing || !this.ctx) return;
    this.resume();
    this.isSynthesizing = true;

    this.synthGain = this.ctx.createGain();
    this.synthGain.gain.value = 0.35;
    this.synthGain.connect(this.masterGain || this.ctx.destination);

    // Chords progression for lo-fi chill (Dmaj7 -> Bm7 -> Gmaj7 -> A7)
    const chords = [
      [293.66, 369.99, 440.0, 554.37], // Dmaj7
      [246.94, 293.66, 369.99, 440.0], // Bm7
      [196.00, 246.94, 293.66, 369.99], // Gmaj7
      [220.00, 277.18, 329.63, 392.00]  // A7
    ];
    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.ctx || !this.synthGain || !this.isSynthesizing) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq) => {
        if (!this.ctx || !this.synthGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = genre === 'synthwave' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(genre === 'synthwave' ? 2400 : 900, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.synthGain);

        osc.start(now);
        osc.stop(now + 4);
      });
    };

    playChordStep();
    this.synthInterval = window.setInterval(playChordStep, 4000);
  }

  public stopProceduralLoFi() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.synthGain) {
      this.synthGain.disconnect();
      this.synthGain = null;
    }
    this.isSynthesizing = false;
  }
}

export const audioEngine = new AudioEngine();
