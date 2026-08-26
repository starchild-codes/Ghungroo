import { useEffect, useMemo, useRef, useState } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { ErrorConsole } from './components/ErrorConsole'
import { RhythmTimeline } from './components/RhythmTimeline'
import { Toolbar } from './components/Toolbar'
import { EXAMPLES } from './examples/programs'
import { runGhungroo, type EvaluationResult } from './language'
import { startPlayback, type PlaybackHandle } from './rhythm/playback'

export default function App() {
  const [selectedExample, setSelectedExample] = useState(1)
  const [source, setSource] = useState(() => {
    const shared = new URLSearchParams(window.location.hash.slice(1)).get('code')
    if (!shared) return EXAMPLES[1].source
    return shared
  })
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [activeEvent, setActiveEvent] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const playback = useRef<PlaybackHandle | null>(null)

  const currentExample = useMemo(() => EXAMPLES[selectedExample], [selectedExample])

  const stop = () => {
    playback.current?.stop()
    playback.current = null
    setActiveEvent(null)
  }

  const run = () => {
    stop()
    try {
      const next = runGhungroo(source)
      setResult(next)
      setError(null)
      return next
    } catch (caught) {
      setResult(null)
      setError(caught instanceof Error ? caught : new Error(String(caught)))
      return null
    }
  }

  const play = () => {
    const next = run()
    if (!next || next.events.length === 0) return
    playback.current = startPlayback({
      totalEvents: next.events.length,
      bpm: next.bpm,
      taalMatras: next.taal.matras,
      onBeat: setActiveEvent,
      onDone: stop,
    })
  }

  const selectExample = (index: number) => {
    stop()
    setSelectedExample(index)
    setSource(EXAMPLES[index].source)
    setResult(null)
    setError(null)
  }

  const share = async () => {
    const url = new URL(window.location.href)
    url.hash = new URLSearchParams({ code: source }).toString()
    try {
      await navigator.clipboard.writeText(url.toString())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setError(new Error('Could not copy the link. Your composition is still in the address bar.'))
      window.location.hash = url.hash
    }
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault()
        run()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    run()
    return stop
    // Run the initial example exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="brand-mark" aria-hidden="true">घु</div>
        <div>
          <p className="kicker">A tiny programming language for Kathak rhythm</p>
          <h1>Ghungroo</h1>
          <p className="hero-copy">Taal is the clock. Bols are events. A tihai is repetition with somewhere to be.</p>
        </div>
      </header>

      <Toolbar
        examples={EXAMPLES}
        selectedExample={selectedExample}
        onSelectExample={selectExample}
        onRun={run}
        onPlay={play}
        onStop={stop}
        onShare={share}
        canPlay={source.trim().length > 0}
        copied={copied}
      />

      <section className="workspace">
        <div className="editor-panel panel">
          <div className="panel-heading">
            <span>composition.ghungroo <kbd>Ctrl / ⌘ + Enter</kbd></span>
            <span className="muted">{currentExample.description}</span>
          </div>
          <CodeEditor value={source} onChange={setSource} />
        </div>

        <div className="visualizer-panel panel">
          <RhythmTimeline result={result} activeEvent={activeEvent} />
        </div>
      </section>

      <ErrorConsole error={error} result={result} />

      <footer>
        <span>v0.1 · made because rhythm already behaves suspiciously like code.</span>
      </footer>
    </main>
  )
}
