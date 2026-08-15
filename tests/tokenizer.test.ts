import { describe, expect, it } from 'vitest'
import { tokenize } from '../src/language/tokenizer'

describe('tokenize', () => {
  it('tokenizes a tihai block', () => {
    const tokens = tokenize('tihai { dha ge na }')
    expect(tokens.map((token) => token.type)).toEqual([
      'WORD', 'LBRACE', 'WORD', 'WORD', 'WORD', 'RBRACE', 'EOF',
    ])
  })

  it('ignores comments', () => {
    const tokens = tokenize('# hello\ntaal teentaal')
    expect(tokens.filter((token) => token.type === 'WORD').map((token) => token.value)).toEqual(['taal', 'teentaal'])
  })

  it('tracks line numbers', () => {
    const tokens = tokenize('dha\nna')
    expect(tokens.find((token) => token.value === 'na')?.line).toBe(2)
  })
})
