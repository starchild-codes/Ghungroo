export type TokenType =
  | 'WORD'
  | 'LBRACE'
  | 'RBRACE'
  | 'BANG'
  | 'NEWLINE'
  | 'EOF'

export interface Token {
  type: TokenType
  value: string
  line: number
  column: number
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = []
  let line = 1
  let column = 1
  let i = 0

  const push = (type: TokenType, value: string, tokenLine = line, tokenColumn = column) => {
    tokens.push({ type, value, line: tokenLine, column: tokenColumn })
  }

  while (i < source.length) {
    const char = source[i]

    if (char === ' ' || char === '\t' || char === '\r') {
      i += 1
      column += 1
      continue
    }

    if (char === '\n') {
      push('NEWLINE', '\n')
      i += 1
      line += 1
      column = 1
      continue
    }

    if (char === '#') {
      while (i < source.length && source[i] !== '\n') {
        i += 1
        column += 1
      }
      continue
    }

    if (char === '{') {
      push('LBRACE', char)
      i += 1
      column += 1
      continue
    }

    if (char === '}') {
      push('RBRACE', char)
      i += 1
      column += 1
      continue
    }

    if (char === '!') {
      push('BANG', char)
      i += 1
      column += 1
      continue
    }

    const startLine = line
    const startColumn = column
    let value = ''
    while (i < source.length && !/[\s{}!#]/u.test(source[i])) {
      value += source[i]
      i += 1
      column += 1
    }

    if (value) {
      push('WORD', value, startLine, startColumn)
      continue
    }

    throw new Error(`Unexpected character "${char}" at ${line}:${column}`)
  }

  push('EOF', '', line, column)
  return tokens
}
