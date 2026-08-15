# Ghungroo language reference — v0.1

Ghungroo is a tiny domain-specific language for experimenting with the cyclic structure of Kathak rhythm.
It is intentionally small. v0.1 models one bol as one rhythmic event and does not attempt to encode the full expressive or pedagogical vocabulary of Kathak.

## Taal

```ghungroo
taal teentaal
```

Supported in v0.1:

| Name | Matras | Vibhag | Tali | Khali |
|---|---:|---|---|---|
| `teentaal` | 16 | 4 + 4 + 4 + 4 | 1, 5, 13 | 9 |
| `jhaptaal` | 10 | 2 + 3 + 2 + 3 | 1, 3, 8 | 6 |
| `ektaal` | 12 | 2 + 2 + 2 + 2 + 2 + 2 | 1, 5, 9, 11 | 3, 7 |

## Laya

```ghungroo
laya madhya
```

Interface presets:
- `vilambit` — 60 BPM
- `madhya` — 92 BPM
- `drut` — 132 BPM

These are playback presets, not claims that Kathak tempo practice can be reduced to three canonical BPM values.

## Bols

A whitespace-separated word is treated as a bol. Unknown bols are allowed and produce a warning rather than an error.

```ghungroo
dha dhin dhin dha
```

## Named phrases

v0.1 recognizes the following block names:

- `tatkaar`
- `tukra`
- `toda`
- `paran`
- `amad`

They currently label provenance for visualization; they do not impose different rhythmic semantics.

```ghungroo
tatkaar {
  ta thai thai tat
  aa thai thai tat
}
```

## Tihai

A `tihai` repeats its bol sequence exactly three times.

```ghungroo
tihai {
  dha ge na
}
```

## Sam assertion

`sam!` asks the evaluator to check whether the final rhythmic event resolves on matra 1 of the selected taal.

```ghungroo
sam!
```

If the composition misses:

```text
SamResolutionError: composition resolves on matra 9. Sam has declined your invitation.
```

## Comments

Lines or suffixes beginning with `#` are ignored.

```ghungroo
# hello, rhythm
taal teentaal
```

## Explicit non-goals for v0.1

Ghungroo does not claim to formalize Kathak as a whole. It currently does not model subdivisions, rests, tempo transitions, footwork technique, gharana-specific practice, choreography, abhinaya, or musical accompaniment. Those omissions are intentional: the project is a playful language-design experiment, not authoritative notation software.
