import { useRef, useCallback } from 'react'
import { useSettingsStore } from '@stores/settingsStore'

function getAudioContext(ref: React.MutableRefObject<AudioContext | null>): AudioContext | null {
  if (!ref.current) {
    try {
      ref.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch {
      return null
    }
  }
  if (ref.current.state === 'suspended') ref.current.resume()
  return ref.current
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  type: OscillatorType,
  duration: number,
  volume: number,
  startOffset = 0,
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startOffset)
  gain.gain.setValueAtTime(0, ctx.currentTime + startOffset)
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startOffset + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration)
  osc.start(ctx.currentTime + startOffset)
  osc.stop(ctx.currentTime + startOffset + duration + 0.01)
}

export function useSound() {
  const { sound } = useSettingsStore()
  const soundRef = useRef(sound)
  soundRef.current = sound

  const ctxRef = useRef<AudioContext | null>(null)
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const playAlert = useCallback(() => {
    const s = soundRef.current
    if (s.alertSound === 'none') return
    const ctx = getAudioContext(ctxRef)
    if (!ctx) return
    const vol = s.volume / 100

    if (s.alertSound === 'bell') {
      playTone(ctx, 880, 'sine', 1.5, vol * 0.8)
      playTone(ctx, 1100, 'sine', 1.2, vol * 0.5, 0.25)
    } else if (s.alertSound === 'digital') {
      playTone(ctx, 1000, 'square', 0.12, vol * 0.25)
      playTone(ctx, 1000, 'square', 0.12, vol * 0.25, 0.2)
      playTone(ctx, 1000, 'square', 0.12, vol * 0.25, 0.4)
    }
  }, [])

  const playTick = useCallback(() => {
    if (!soundRef.current.tickingEnabled) return
    if (tickIntervalRef.current) return

    const tick = () => {
      const s = soundRef.current
      if (!s.tickingEnabled) return
      const ctx = getAudioContext(ctxRef)
      if (!ctx) return
      playTone(ctx, 1200, 'sine', 0.04, (s.tickingVolume / 100) * 0.4)
    }

    tick()
    tickIntervalRef.current = setInterval(tick, 1000)
  }, [])

  const stopTick = useCallback(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current)
      tickIntervalRef.current = null
    }
  }, [])

  return { playAlert, playTick, stopTick, isMuted: sound.alertSound === 'none' }
}
