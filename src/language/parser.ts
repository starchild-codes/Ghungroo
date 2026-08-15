import type { Program, Statement } from './ast'
import type { Token } from './tokenizer'
import { GhungrooSyntaxError } from './errors'

const blockNames = new Set(['tatkaar', 'tukra', 'toda', 'paran', 'amad'])

export function parse(tokens: Token[]): Program {
  let current = 0

  const peek = () => tokens[current]
  const advance = () => tokens[current++]
  const skipNewlines = () => {
    while (peek().type === 'NEWLINE') advance()
  }

  const expect = (type: Token['type'], message: string) => {
    const token = peek()
    if (token.type !== type) {
      throw new GhungrooSyntaxError(`${message} at ${token.line}:${token.column}.`)
    }
    return advance()
  }

  const readLineWords = (): string[] => {
    const words: string[] = []
    while (!['NEWLINE', 'EOF', 'RBRACE'].includes(peek().type)) {
      if (peek().type !== 'WORD') {
        const token = peek()
        throw new GhungrooSyntaxError(`Unexpected "${token.value}" at ${token.line}:${token.column}.`)
      }
      words.push(advance().value)
    }
    return words
  }

  const readBlockBols = (): string[] => {
    expect('LBRACE', 'Expected "{" to open the phrase')
    const bols: string[] = []
    while (peek().type !== 'RBRACE') {
      if (peek().type === 'EOF') {
        throw new GhungrooSyntaxError('Expected "}" after phrase. Even rhythmic structures need closure')
      }
      if (peek().type === 'NEWLINE') {
        advance()
        continue
      }
      if (peek().type !== 'WORD') {
        const token = peek()
        throw new GhungrooSyntaxError(`Unexpected token "${token.value}" inside phrase`)
      }
      bols.push(advance().value)
    }
    expect('RBRACE', 'Expected "}" after phrase')
    return bols
  }

  const statements: Statement[] = []
  skipNewlines()

  while (peek().type !== 'EOF') {
    const token = expect('WORD', 'Expected a declaration, phrase, or bol')

    if (token.value === 'taal') {
      const name = expect('WORD', 'Expected a taal name after "taal"').value
      statements.push({ type: 'TaalDeclaration', name })
      readLineWords()
    } else if (token.value === 'laya') {
      const name = expect('WORD', 'Expected a laya name after "laya"').value
      statements.push({ type: 'LayaDeclaration', name })
      readLineWords()
    } else if (token.value === 'sam') {
      expect('BANG', 'Expected "!" after "sam"')
      statements.push({ type: 'SamAssertion' })
      readLineWords()
    } else if (token.value === 'tihai') {
      const bols = readBlockBols()
      statements.push({ type: 'Tihai', bols })
    } else if (blockNames.has(token.value)) {
      const bols = readBlockBols()
      statements.push({ type: 'NamedBlock', name: token.value, bols })
    } else {
      const bols = [token.value, ...readLineWords()]
      statements.push({ type: 'BolSequence', bols })
    }

    skipNewlines()
  }

  return { type: 'Program', statements }
}
