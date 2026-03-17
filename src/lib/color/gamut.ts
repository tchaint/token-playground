import { displayable, clampChroma, converter } from 'culori'
import type { ColorStep } from '../types'

const toRgb = converter('rgb')

type Oklch = { l: number; c: number; h: number; a: number }

function toCulori(oklch: Oklch) {
  return { mode: 'oklch' as const, l: oklch.l, c: oklch.c, h: oklch.h, alpha: oklch.a < 1 ? oklch.a : undefined }
}

export function isInSRGB(oklch: Oklch): boolean {
  return displayable(toRgb(toCulori(oklch)))
}

export function clampToSRGB(oklch: Oklch): Oklch {
  const clamped = clampChroma(toCulori(oklch), 'oklch')
  return {
    l: clamped.l ?? oklch.l,
    c: clamped.c ?? 0,
    h: clamped.h ?? oklch.h,
    a: oklch.a,
  }
}

export function countOutOfGamut(steps: ColorStep[]): number {
  return steps.filter((step) => !isInSRGB(step.oklch)).length
}
