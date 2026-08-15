export class GhungrooError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GhungrooError'
  }
}

export class GhungrooSyntaxError extends GhungrooError {
  constructor(message: string) {
    super(message)
    this.name = 'GhungrooSyntaxError'
  }
}

export class UnknownTaalError extends GhungrooError {
  constructor(name: string) {
    super(`Unknown taal "${name}". Confidence is admirable; this taal is not supported yet.`)
    this.name = 'UnknownTaalError'
  }
}

export class UnknownLayaError extends GhungrooError {
  constructor(name: string) {
    super(`Unknown laya "${name}". Try vilambit, madhya, or drut.`)
    this.name = 'UnknownLayaError'
  }
}

export class EmptyTihaiError extends GhungrooError {
  constructor() {
    super('A tihai repeated nothing three times. Philosophically interesting. Rhythmically useless.')
    this.name = 'EmptyTihaiError'
  }
}
