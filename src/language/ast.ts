export type TaalName = 'teentaal' | 'jhaptaal' | 'ektaal'
export type LayaName = 'vilambit' | 'madhya' | 'drut'
export type BlockName = 'tatkaar' | 'tukra' | 'toda' | 'paran' | 'amad'

export type Statement =
  | { type: 'TaalDeclaration'; name: string }
  | { type: 'LayaDeclaration'; name: string }
  | { type: 'BolSequence'; bols: string[] }
  | { type: 'NamedBlock'; name: string; bols: string[] }
  | { type: 'Tihai'; bols: string[] }
  | { type: 'SamAssertion' }

export interface Program {
  type: 'Program'
  statements: Statement[]
}
