import type { Program } from './ast'
import { EmptyTihaiError, UnknownLayaError, UnknownTaalError } from './errors'
import { TAALS, type TaalDefinition } from '../rhythm/taals'
import { LAYA_BPM } from '../rhythm/timing'

export interface RhythmEvent {
  index: number
  bol: string
  matra: number
  cycle: number
  source: 'free' | 'tihai' | string
  tihaiPart?: 1 | 2 | 3
}

export interface EvaluationResult {
  taal: TaalDefinition
  laya: string
  bpm: number
  events: RhythmEvent[]
  samAsserted: boolean
  resolutionMatra: number | null
  onSam: boolean | null
  warnings: string[]
}

const knownBols = new Set([
  'dha', 'dhin', 'ta', 'tin', 'na', 'ge', 'ti', 're', 'kit', 'taka',
  'thai', 'tat', 'aa', 'thei', 'thun', 'ga', 'ka', 'dhage', 'tirakita',
])

export function evaluate(program: Program): EvaluationResult {
  let taal = TAALS.teentaal
  let laya = 'madhya'
  let samAsserted = false
  const expanded: Array<{ bol: string; source: string; tihaiPart?: 1 | 2 | 3 }> = []
  const warnings = new Set<string>()

  const addBols = (bols: string[], source: string, tihaiPart?: 1 | 2 | 3) => {
    for (const bol of bols) {
      expanded.push({ bol, source, tihaiPart })
      if (!knownBols.has(bol.toLowerCase())) {
        warnings.add(`Unfamiliar bol "${bol}". Rendering it anyway.`)
      }
    }
  }

  for (const statement of program.statements) {
    switch (statement.type) {
      case 'TaalDeclaration': {
        const next = TAALS[statement.name.toLowerCase()]
        if (!next) throw new UnknownTaalError(statement.name)
        taal = next
        break
      }
      case 'LayaDeclaration': {
        const name = statement.name.toLowerCase()
        if (!(name in LAYA_BPM)) throw new UnknownLayaError(statement.name)
        laya = name
        break
      }
      case 'BolSequence':
        addBols(statement.bols, 'free')
        break
      case 'NamedBlock':
        addBols(statement.bols, statement.name)
        break
      case 'Tihai':
        if (statement.bols.length === 0) throw new EmptyTihaiError()
        addBols(statement.bols, 'tihai', 1)
        addBols(statement.bols, 'tihai', 2)
        addBols(statement.bols, 'tihai', 3)
        break
      case 'SamAssertion':
        samAsserted = true
        break
    }
  }

  const events: RhythmEvent[] = expanded.map((item, index) => ({
    index,
    bol: item.bol,
    matra: (index % taal.matras) + 1,
    cycle: Math.floor(index / taal.matras) + 1,
    source: item.source,
    tihaiPart: item.tihaiPart,
  }))

  const resolutionMatra = events.length ? events.at(-1)!.matra : null
  const onSam = samAsserted && resolutionMatra !== null ? resolutionMatra === 1 : null

  return {
    taal,
    laya,
    bpm: LAYA_BPM[laya],
    events,
    samAsserted,
    resolutionMatra,
    onSam,
    warnings: [...warnings],
  }
}
