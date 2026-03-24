import { useSettingsStore } from '@stores/settingsStore'
import type { AmbientSound } from '@/types'

interface AmbientState {
  source: AudioBufferSourceNode
  gainNode: GainNode
  lfo?: OscillatorNode
}

let audioCtx: AudioContext | null = null
let current: AmbientState | null = null
let previewTimeout: ReturnType<typeof setTimeout> | null = null

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

function buildGraph(ctx: AudioContext, type: Exclude<AmbientSound, 'none'>, volume: number): AmbientState {
  stopInternal()

  const source = ctx.createBufferSource()
  source.buffer = createNoiseBuf(ctx)
  source.loop = true

  const gain = ctx.createGain()
  let lfo: OscillatorNode | undefined

  if (type === 'brown-noise') {
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 180
    f.Q.value = 0.5
    source.connect(f)
    f.connect(gain)
    gain.gain.value = volume * 1.4
  } else if (type === 'white-noise') {
    source.connect(gain)
    gain.gain.value = volume * 0.6
  } else if (type === 'rain') {
    const hi = ctx.createBiquadFilter()
    hi.type = 'highpass'
    hi.frequency.value = 1200
    const lo = ctx.createBiquadFilter()
    lo.type = 'lowpass'
    lo.frequency.value = 9000
    source.connect(hi)
    hi.connect(lo)
    lo.connect(gain)
    gain.gain.value = volume * 0.9
  } else if (type === 'ocean') {
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 700
    source.connect(f)
    f.connect(gain)

    // LFO for wave motion
    lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.12
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = volume * 0.35
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)
    gain.gain.value = volume * 0.55
    lfo.start()
  }

  gain.connect(ctx.destination)
  source.start()

  return { source, gainNode: gain, lfo }
}

function stopInternal(): void {
  if (current) {
    try { current.source.stop() } catch {}
    try { current.lfo?.stop() } catch {}
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
    current = buildGraph(ctx, sound.ambientSound, sound.ambientVolume / 100)
  },

  stop(): void {
    if (previewTimeout) { clearTimeout(previewTimeout); previewTimeout = null }
    stopInternal()
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
