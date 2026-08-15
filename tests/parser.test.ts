import { describe, expect, it } from 'vitest'
import { tokenize } from '../src/language/tokenizer'
import { parse } from '../src/language/parser'
import { GhungrooSyntaxError } from '../src/language/errors'

describe('parse', () => {
  it('builds an AST for declarations and tihai', () => {
    const program = parse(tokenize('taal teentaal\nlaya madhya\ntihai { dha ge na }\nsam!'))
    expect(program.statements.map((statement) => statement.type)).toEqual([
      'TaalDeclaration', 'LayaDeclaration', 'Tihai', 'SamAssertion',
    ])
  })

  it('parses a named Kathak block', () => {
    const program = parse(tokenize('tatkaar { ta thai thai tat }'))
    expect(program.statements[0]).toMatchObject({
      type: 'NamedBlock',
      name: 'tatkaar',
      bols: ['ta', 'thai', 'thai', 'tat'],
    })
  })

  it('rejects an unclosed phrase', () => {
    expect(() => parse(tokenize('tihai { dha ge na'))).toThrow(GhungrooSyntaxError)
  })
})
