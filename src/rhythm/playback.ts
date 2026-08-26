import { beatDurationMs } from './timing'

export interface PlaybackHandle {
  stop: () => void
}

function click(context: AudioContext, accented: boolean) {
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
  const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  const context = AudioContextCtor ? new AudioContextCtor() : null

  const finish = () => {
    context?.close()
    options.onDone()
  }

  const tick = () => {
    if (stopped) return
    if (index >= options.totalEvents) {
      finish()
      return
    }

    options.onBeat(index)
    if (context) click(context, index % options.taalMatras === 0)
    index += 1
    timer = window.setTimeout(tick, duration)
  }

  tick()

  return {
    stop: () => {
      stopped = true
      if (timer !== undefined) window.clearTimeout(timer)
      context?.close()
    },
  }
}
