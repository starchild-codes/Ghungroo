import { describe, expect, it } from 'vitest'
import { runGhungroo } from '../src/language'
import { EmptyTihaiError, UnknownTaalError } from '../src/language/errors'

describe('evaluate', () => {
  it('uses Teentaal by default', () => {
    expect(runGhungroo('dha').taal.matras).toBe(16)
  })

  it('expands a tihai exactly three times', () => {
    const result = runGhungroo('tihai { dha na }')
    expect(result.events.map((event) => event.bol)).toEqual(['dha', 'na', 'dha', 'na', 'dha', 'na'])
    expect(result.events.map((event) => event.tihaiPart)).toEqual([1, 1, 2, 2, 3, 3])
  })

  it('detects a return to sam', () => {
    const result = runGhungroo('taal teentaal\ntukra { dha ge }\ntihai { dha ge na ti na }\nsam!')
    expect(result.events).toHaveLength(17)
    expect(result.resolutionMatra).toBe(1)
    expect(result.onSam).toBe(true)
  })

  it('detects a missed sam', () => {
    const result = runGhungroo('taal teentaal\ntihai { dha ge na }\nsam!')
    expect(result.resolutionMatra).toBe(9)
    expect(result.onSam).toBe(false)
  })

  it('supports Jhaptaal', () => {
    expect(runGhungroo('taal jhaptaal\ndha').taal.divisions).toEqual([2, 3, 2, 3])
  })

  it('supports Ektaal', () => {
    expect(runGhungroo('taal ektaal\ndha').taal.matras).toBe(12)
  })

  it('rejects unknown taals', () => {
    expect(() => runGhungroo('taal mysterious\ndha')).toThrow(UnknownTaalError)
  })

  it('rejects an empty tihai', () => {
    expect(() => runGhungroo('tihai { }')).toThrow(EmptyTihaiError)
  })

  it('warns but does not reject unfamiliar bols', () => {
    const result = runGhungroo('krang')
    expect(result.events[0].bol).toBe('krang')
    expect(result.warnings[0]).toContain('krang')
  })
})
