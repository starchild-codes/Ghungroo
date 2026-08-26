import type { ExampleProgram } from '../examples/programs'

interface ToolbarProps {
  examples: ExampleProgram[]
  selectedExample: number
  onSelectExample: (index: number) => void
  onRun: () => void
  onPlay: () => void
  onStop: () => void
  onShare: () => void
  canPlay: boolean
  copied: boolean
}

export function Toolbar(props: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="example-control">
        <label htmlFor="example-select">Example</label>
        <select
          id="example-select"
          value={props.selectedExample}
          onChange={(event) => props.onSelectExample(Number(event.target.value))}
        >
          {props.examples.map((example, index) => (
            <option key={example.name} value={index}>{example.name}</option>
          ))}
        </select>
      </div>
      <div className="toolbar-actions">
        <button className="button secondary" onClick={props.onRun}>Run</button>
        <button className="button primary" onClick={props.onPlay} disabled={!props.canPlay}>Play</button>
        <button className="button ghost" onClick={props.onStop}>Stop</button>
        <button className="button ghost" onClick={props.onShare}>{props.copied ? 'Link copied' : 'Share'}</button>
      </div>
    </div>
  )
}
