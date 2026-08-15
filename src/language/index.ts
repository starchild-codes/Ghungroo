import { tokenize } from './tokenizer'
import { parse } from './parser'
import { evaluate } from './evaluator'

export function runGhungroo(source: string) {
  return evaluate(parse(tokenize(source)))
}

export * from './ast'
export * from './errors'
export * from './evaluator'
export * from './parser'
export * from './tokenizer'
