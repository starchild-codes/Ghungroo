import type { EvaluationResult } from '../language/evaluator'

interface RhythmTimelineProps {
  result: EvaluationResult | null
  activeEvent: number | null
}

export function RhythmTimeline({ result, activeEvent }: RhythmTimelineProps) {
  if (!result) {
    return <div className="empty-state">Run a composition to see its rhythm.</div>
  }

  const { taal } = result
  const cycles = Math.max(1, Math.ceil(result.events.length / taal.matras))
  const dividerAfter = new Set<number>()
  let running = 0
  for (const size of taal.divisions.slice(0, -1)) {
    running += size
    dividerAfter.add(running)
  }

  return (
    <div className="timeline-wrap">
      <div className="taal-header">
        <div>
          <span className="eyebrow">{taal.displayName}</span>
          <h2>{taal.matras} matras · {result.laya} · {result.bpm} BPM</h2>
        </div>
        <div className="legend">
          <span>● tali</span>
          <span>○ khali</span>
          <span>◆ sam</span>
        </div>
      </div>

      {Array.from({ length: cycles }, (_, cycleIndex) => (
        <div className="cycle" key={cycleIndex}>
          <div className="cycle-label">Avartan {cycleIndex + 1}</div>
          <div className="beat-grid" style={{ gridTemplateColumns: `repeat(${taal.matras}, minmax(54px, 1fr))` }}>
            {Array.from({ length: taal.matras }, (_, matraIndex) => {
              const matra = matraIndex + 1
              const eventIndex = cycleIndex * taal.matras + matraIndex
              const event = result.events[eventIndex]
              const marker = matra === 1 ? '◆' : taal.tali.includes(matra) ? '●' : taal.khali.includes(matra) ? '○' : ''
              const classNames = [
                'beat-cell',
                eventIndex === activeEvent ? 'active' : '',
                dividerAfter.has(matra) ? 'division-end' : '',
                event?.source === 'tihai' ? `tihai-${event.tihaiPart}` : '',
              ].filter(Boolean).join(' ')

              return (
                <div className={classNames} key={matra}>
                  <div className="beat-meta"><span>{matra}</span><span>{marker}</span></div>
                  <div className="bol">{event?.bol ?? '·'}</div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
