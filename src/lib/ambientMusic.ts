import { useSettingsStore } from '@stores/settingsStore'
import type { AmbientSound } from '@/types'

interface AmbientState {
  source: AudioBufferSourceNode | null
  gainNode: GainNode
  extras: AudioScheduledSourceNode[]
  timers: ReturnType<typeof setInterval>[]
}

const MELODIC: AmbientSound[] = ['piano', 'lofi', 'space']

let audioCtx: AudioContext | null = null
let current: AmbientState | null = null
let previewTimeout: ReturnType<typeof setTimeout> | null = null
let muted = false

function getCtx(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch {
      return null
    }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function createNoiseBuf(ctx: AudioContext): AudioBuffer {
  const len = ctx.sampleRate * 4
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const data = buf.getChannelData(c)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + w * 0.0555179
      b1 = 0.99332 * b1 + w * 0.0750759
      b2 = 0.96900 * b2 + w * 0.1538520
      b3 = 0.86650 * b3 + w * 0.3104856
      b4 = 0.55000 * b4 + w * 0.5329522
      b5 = -0.7616 * b5 - w * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) / 7
      b6 = w * 0.115926
    }
  }
  return buf
}

// C major pentatonic across two octaves — always sounds pleasant, never grating
const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]

function buildMelodic(ctx: AudioContext, type: AmbientSound, volume: number): AmbientState {
  const master = ctx.createGain()
  master.gain.value = volume * 1.5
  const warm = ctx.createBiquadFilter()
  warm.type = 'lowpass'
  warm.frequency.value = 2600
  master.connect(warm)
  warm.connect(ctx.destination)

  const extras: AudioScheduledSourceNode[] = []
  const timers: ReturnType<typeof setInterval>[] = []

  // Sustained low pad chord (root-third-fifth)
  const padGain = ctx.createGain()
  padGain.gain.value = type === 'space' ? 0.12 : 0.05
  padGain.connect(master)
  for (const f of [130.81, 164.81, 196.0]) {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = f
    o.connect(padGain)
    o.start()
    extras.push(o)
  }

  const playNote = (freq: number, dur: number, peak: number, wave: OscillatorType) => {
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    o.type = wave
    o.frequency.value = freq
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  if (type === 'piano' || type === 'lofi') {
    timers.push(setInterval(() => {
      if (Math.random() < 0.25) return // occasional rest
      const f = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)]
      playNote(f, 1.6, 0.14, 'triangle')
    }, type === 'lofi' ? 700 : 900))
  }

  if (type === 'lofi') {
    const hatBuf = createNoiseBuf(ctx) // reused for every hi-hat
    const kick = () => {
      const t = ctx.currentTime
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.setValueAtTime(120, t)
      o.frequency.exponentialRampToValueAtTime(45, t + 0.15)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.3, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.2)
    }
    const hat = () => {
      const t = ctx.currentTime
      const nb = ctx.createBufferSource()
      nb.buffer = hatBuf
      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 7000
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.08, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
      nb.connect(hp); hp.connect(g); g.connect(master); nb.start(t); nb.stop(t + 0.06)
    }
    let beat = 0
    timers.push(setInterval(() => {
      if (beat % 2 === 0) kick(); else hat()
      beat++
    }, 400))
  }

  if (type === 'space') {
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.05
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 700
    lfo.connect(lfoGain)
    lfoGain.connect(warm.frequency)
    lfo.start()
    extras.push(lfo)
    timers.push(setInterval(() => {
      if (Math.random() < 0.5) return
      const f = PENTATONIC[4 + Math.floor(Math.random() * 4)] * 2
      playNote(f, 3.5, 0.05, 'sine')
    }, 2500))
  }

  return { source: null, gainNode: master, extras, timers }
}

function buildGraph(ctx: AudioContext, type: Exclude<AmbientSound, 'none'>, volume: number): AmbientState {
  stopInternal()

  if (MELODIC.includes(type)) return buildMelodic(ctx, type, volume)

  const source = ctx.createBufferSource()
  source.buffer = createNoiseBuf(ctx)
  source.loop = true

  const gain = ctx.createGain()
  const extras: AudioScheduledSourceNode[] = []

  const filter = (filterType: BiquadFilterType, freq: number, q = 0.7) => {
    const f = ctx.createBiquadFilter()
    f.type = filterType
    f.frequency.value = freq
    f.Q.value = q
    return f
  }

  // Slow amplitude wobble (waves / gusts)
  const addWobble = (rate: number, depth: number) => {
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = rate
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = depth
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)
    lfo.start()
    extras.push(lfo)
  }

  if (type === 'brown-noise') {
    const f = filter('lowpass', 180, 0.5)
    source.connect(f); f.connect(gain)
    gain.gain.value = volume * 1.4
  } else if (type === 'white-noise') {
    source.connect(gain)
    gain.gain.value = volume * 0.6
  } else if (type === 'rain') {
    const hi = filter('highpass', 1200)
    const lo = filter('lowpass', 9000)
    source.connect(hi); hi.connect(lo); lo.connect(gain)
    gain.gain.value = volume * 0.9
  } else if (type === 'ocean') {
    const f = filter('lowpass', 700)
    source.connect(f); f.connect(gain)
    gain.gain.value = volume * 0.55
    addWobble(0.12, volume * 0.35)
  } else if (type === 'wind') {
    const f = filter('lowpass', 480, 0.8)
    source.connect(f); f.connect(gain)
    gain.gain.value = volume * 0.8
    addWobble(0.08, volume * 0.5)
  } else if (type === 'stream') {
    const hi = filter('highpass', 700)
    const lo = filter('lowpass', 6500)
    source.connect(hi); hi.connect(lo); lo.connect(gain)
    gain.gain.value = volume * 0.8
    addWobble(2.5, volume * 0.12)
  } else if (type === 'fan') {
    const f = filter('lowpass', 340, 1.3)
    source.connect(f); f.connect(gain)
    gain.gain.value = volume * 1.2
  } else if (type === 'drone') {
    // Low meditative tone (perfect fifth) over a faint noise bed
    const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 110
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 164.81
    const og = ctx.createGain(); og.gain.value = 0.18
    o1.connect(og); o2.connect(og); og.connect(gain)
    const f = filter('lowpass', 300)
    const ng = ctx.createGain(); ng.gain.value = 0.25
    source.connect(f); f.connect(ng); ng.connect(gain)
    gain.gain.value = volume
    o1.start(); o2.start()
    extras.push(o1, o2)
  }

  gain.connect(ctx.destination)
  source.start()

  return { source, gainNode: gain, extras, timers: [] }
}

function stopInternal(): void {
  if (current) {
    for (const t of current.timers) clearInterval(t)
    try { current.source?.stop() } catch {}
    for (const node of current.extras) {
      try { node.stop() } catch {}
    }
    try { current.gainNode.disconnect() } catch {}
    current = null
  }
}

export const ambientMusic = {
  play(): void {
    const { sound } = useSettingsStore.getState()
    if (sound.ambientSound === 'none') return
    if (current) return // already playing
    const ctx = getCtx()
    if (!ctx) return
    current = buildGraph(ctx, sound.ambientSound, muted ? 0 : sound.ambientVolume / 100)
  },

  stop(): void {
    if (previewTimeout) { clearTimeout(previewTimeout); previewTimeout = null }
    stopInternal()
  },

  toggleMute(): boolean {
    muted = !muted
    if (current) {
      const { sound } = useSettingsStore.getState()
      const targetVol = muted ? 0 : sound.ambientVolume / 100
      current.gainNode.gain.setTargetAtTime(targetVol, current.gainNode.context.currentTime, 0.1)
    }
    return muted
  },

  isMuted(): boolean {
    return muted
  },

  preview(type: AmbientSound, onEnd?: () => void): void {
    if (previewTimeout) { clearTimeout(previewTimeout); previewTimeout = null }
    if (type === 'none') { stopInternal(); onEnd?.(); return }
    const ctx = getCtx()
    if (!ctx) return
    const { sound } = useSettingsStore.getState()
    const vol = Math.max(sound.ambientVolume / 100, 0.4)
    current = buildGraph(ctx, type, vol)
    previewTimeout = setTimeout(() => {
      stopInternal()
      previewTimeout = null
      onEnd?.()
    }, 6000)
  },

  stopPreview(): void {
    if (previewTimeout) { clearTimeout(previewTimeout); previewTimeout = null }
    stopInternal()
  },

  isPlaying(): boolean {
    return current !== null
  },
}
