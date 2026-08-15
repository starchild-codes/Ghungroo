export interface ExampleProgram {
  name: string
  description: string
  source: string
}

export const EXAMPLES: ExampleProgram[] = [
  {
    name: 'Tatkaar 101',
    description: 'A simple tatkaar phrase in Teentaal.',
    source: `# Ghungroo v0.1\ntaal teentaal\nlaya madhya\n\ntatkaar {\n  ta thai thai tat\n  aa thai thai tat\n}`,
  },
  {
    name: 'Land on Sam',
    description: 'Two opening bols + a five-bol tihai = 17 events, so the final bol returns to sam.',
    source: `taal teentaal\nlaya madhya\n\ntukra { dha ge }\n\ntihai {\n  dha ge na ti na\n}\n\nsam!`,
  },
  {
    name: 'Sam Is Disappointed',
    description: 'An intentionally broken resolution.',
    source: `taal teentaal\n\ntihai {\n  dha ge na\n}\n\nsam!`,
  },
]
