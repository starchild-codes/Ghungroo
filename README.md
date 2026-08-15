# Ghungroo

**A tiny programming language for Kathak rhythm.**

Ghungroo treats a few rhythmic ideas from Kathak as executable structures: **taal is the clock, bols are events, tihai is repetition, and `sam!` is a synchronization assertion.**

```ghungroo
taal teentaal
laya madhya

tukra { dha ge }

tihai {
  dha ge na ti na
}

sam!
```

The browser playground parses the program, expands the tihai, places every bol on a matra, visualizes the taal cycle, and checks whether the final bol returns to sam.

> Ghungroo is not notation software, a dance-learning platform, or an attempt to reduce Kathak to code. It is a small language-design experiment built around one question: **what would Kathak rhythm look like if it had a programming language?**

## Why this exists

Kathak rhythm already contains structures programmers recognize: cycles, repetition, subdivision, synchronization, and resolution. Ghungroo makes that computational resemblance visible without pretending that the art form is exhausted by those structures.

Also, compiler errors are funnier when sam can reject you.

```text
SamResolutionError: composition resolves on matra 9.
Sam has declined your invitation.
```

## v0.1

Ghungroo currently supports:

- `taal teentaal`, `taal jhaptaal`, and `taal ektaal`
- `laya vilambit`, `laya madhya`, and `laya drut`
- free bol sequences
- named `tatkaar`, `tukra`, `toda`, `paran`, and `amad` blocks
- `tihai { ... }`, expanded exactly three times
- `sam!`, which checks final resolution on matra 1
- horizontal taal visualization with tali/khali/sam markers
- animated playback using the Web Audio API
- warnings for unfamiliar bols instead of rejecting them
- deliberately unnecessary error messages

Full syntax: [`docs/LANGUAGE.md`](docs/LANGUAGE.md)

## Architecture

Ghungroo is an interpreter, not a text-replacement gimmick.

```text
.ghungroo source
      ↓
  tokenizer
      ↓
    parser
      ↓
      AST
      ↓
  evaluator
      ↓
rhythm events
      ↓
visualizer + playback
```

The language engine is isolated from the React UI under `src/language/` and `src/rhythm/`.

## Project structure

```text
.
├── .github/workflows/ci.yml
├── docs/
│   └── LANGUAGE.md
├── examples/
│   ├── 01-tatkaar.ghungroo
│   ├── 02-land-on-sam.ghungroo
│   └── 03-sam-is-disappointed.ghungroo
├── src/
│   ├── components/
│   ├── examples/
│   ├── language/
│   │   ├── ast.ts
│   │   ├── errors.ts
│   │   ├── evaluator.ts
│   │   ├── parser.ts
│   │   └── tokenizer.ts
│   ├── rhythm/
│   └── styles/
├── tests/
├── CONTRIBUTING.md
├── ROADMAP.md
└── README.md
```

## Run locally

Requires Node.js 22+.

```bash
git clone https://github.com/starchild-codes/ghungroo.git
cd ghungroo
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Tests

```bash
npm test
```

Run tests and a production build together:

```bash
npm run check
```

The tests cover tokenization, parsing, tihai expansion, taal selection, sam resolution, invalid syntax, unknown taals, empty tihais, and permissive unknown-bol handling.

## Design choices

### One bol = one event

v0.1 intentionally uses a simple event model. Subdivisions and layakari are future language features rather than hidden assumptions.

### Unknown bols are warnings

Kathak vocabulary should not be policed by a tiny hobby interpreter. Ghungroo renders unfamiliar bols and tells you it does not recognize them.

### `sam!` is an assertion

The exclamation mark is deliberate. `sam!` does not insert a beat; it asks the evaluator whether the composition actually resolved there.

### No backend

There are no accounts, analytics, databases, LLM calls, or cloud state. The entire project runs in the browser.

## Roadmap

Ideas such as dugun/tigun/chaugun, rests, circular visualization, custom taals, and a rhythm puzzle mode live in [`ROADMAP.md`](ROADMAP.md).

## License

MIT. See [`LICENSE`](LICENSE).
