export const LAYA_BPM: Record<string, number> = {
  vilambit: 60,
  madhya: 92,
  drut: 132,
}

export function beatDurationMs(bpm: number): number {
  return 60_000 / bpm
}
