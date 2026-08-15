export interface TaalDefinition {
  name: string
  displayName: string
  matras: number
  divisions: number[]
  tali: number[]
  khali: number[]
}

export const TAALS: Record<string, TaalDefinition> = {
  teentaal: {
    name: 'teentaal',
    displayName: 'Teentaal',
    matras: 16,
    divisions: [4, 4, 4, 4],
    tali: [1, 5, 13],
    khali: [9],
  },
  jhaptaal: {
    name: 'jhaptaal',
    displayName: 'Jhaptaal',
    matras: 10,
    divisions: [2, 3, 2, 3],
    tali: [1, 3, 8],
    khali: [6],
  },
  ektaal: {
    name: 'ektaal',
    displayName: 'Ektaal',
    matras: 12,
    divisions: [2, 2, 2, 2, 2, 2],
    tali: [1, 5, 9, 11],
    khali: [3, 7],
  },
}
