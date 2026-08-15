import type { EvaluationResult } from '../language/evaluator'

interface ErrorConsoleProps {
  error: Error | null
  result: EvaluationResult | null
}

export function ErrorConsole({ error, result }: ErrorConsoleProps) {
  if (error) {
    return (
      <div className="console error-console">
        <strong>{error.name}</strong>
        <span>{error.message}</span>
      </div>
    )
  }

  if (!result) {
    return <div className="console"><span>Ghungroo is listening.</span></div>
  }

  let message = `${result.events.length} rhythmic events parsed.`
  let className = 'console'

  if (result.samAsserted) {
    if (result.onSam) {
      message = '✓ Sam reached. The final bol resolves on matra 1.'
      className += ' success-console'
    } else {
      message = `SamResolutionError: composition resolves on matra ${result.resolutionMatra}. Sam has declined your invitation.`
      className += ' warning-console'
    }
  }

  return (
    <div className={className}>
      <span>{message}</span>
      {result.warnings.map((warning) => <small key={warning}>Warning: {warning}</small>)}
    </div>
  )
}
