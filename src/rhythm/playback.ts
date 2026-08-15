import { beatDurationMs } from './timing'

export interface PlaybackHandle {
  stop: () => void
}

function click(accented: boolean) {
  const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextCtor) return

  const context = new AudioContextCtor()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = accented ? 520 : 360
  gain.gain.setValueAtTime(0.12, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.06)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.07)
  oscillator.addEventListener('ended', () => context.close())
}

export function startPlayback(options: {
  totalEvents: number
  bpm: number
  taalMatras: number
  onBeat: (eventIndex: number) => void
  onDone: () => void
}): PlaybackHandle {
  const duration = beatDurationMs(options.bpm)
  let index = 0
  let timer: number | undefined
  let stopped = false

  const tick = () => {
    if (stopped) return
    if (index >= options.totalEvents) {
      options.onDone()
      return
    }

    options.onBeat(index)
    click(index % options.taalMatras === 0)
    index += 1
    timer = window.setTimeout(tick, duration)
  }

  tick()

  return {
    stop: () => {
      stopped = true
      if (timer !== undefined) window.clearTimeout(timer)
    },
  }
}
