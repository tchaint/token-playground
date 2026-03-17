import type { ColorStep, ScaleGeneratorSettings } from '../types'

const STEP_COUNT = 12

function gaussian(x: number, mean: number, sigma: number): number {
  return Math.exp(-0.5 * ((x - mean) / sigma) ** 2)
}

export function generateScale(settings: ScaleGeneratorSettings): ColorStep[] {
  const { baseHue, baseChroma, lightnessRange, chromaCurve } = settings
  const mean = settings.gaussianMean ?? 0.6
  const sigma = settings.gaussianSigma ?? 0.2

  return Array.from({ length: STEP_COUNT }, (_, i) => {
    const index = i + 1 // 1–12
    // Step 1 = lightest (max), step 12 = darkest (min)
    const t = i / (STEP_COUNT - 1) // 0 at step 1, 1 at step 12
    const l = lightnessRange.max - t * (lightnessRange.max - lightnessRange.min)

    let c: number
    if (chromaCurve === 'gaussian') {
      // Normalize lightness to 0–1 range for the gaussian, then apply
      const lNorm = l // l is already 0–1
      c = baseChroma * gaussian(lNorm, mean, sigma)
    } else {
      // 'linear' and 'manual' both use constant chroma
      c = baseChroma
    }

    return {
      index,
      oklch: { l, c, h: baseHue, a: 1 },
    }
  })
}

export function defaultGeneratorSettings(): ScaleGeneratorSettings {
  return {
    baseHue: 250,
    baseChroma: 0.15,
    lightnessRange: { min: 0.20, max: 0.97 },
    chromaCurve: 'gaussian',
    gaussianMean: 0.6,
    gaussianSigma: 0.2,
  }
}
