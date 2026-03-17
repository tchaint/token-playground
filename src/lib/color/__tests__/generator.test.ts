import { describe, it, expect } from 'vitest'
import { generateScale, defaultGeneratorSettings } from '../generator'
import { clampToSRGB, isInSRGB } from '../gamut'

describe('generateScale', () => {
  it('returns exactly 12 steps', () => {
    const steps = generateScale(defaultGeneratorSettings())
    expect(steps).toHaveLength(12)
  })

  it('step indices run from 1 to 12', () => {
    const steps = generateScale(defaultGeneratorSettings())
    expect(steps.map((s) => s.index)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('step 1 has the highest lightness and step 12 has the lowest', () => {
    const steps = generateScale(defaultGeneratorSettings())
    const l1 = steps[0].oklch.l
    const l12 = steps[11].oklch.l
    expect(l1).toBeGreaterThan(l12)
    // Verify against configured range
    const settings = defaultGeneratorSettings()
    expect(l1).toBeCloseTo(settings.lightnessRange.max, 5)
    expect(l12).toBeCloseTo(settings.lightnessRange.min, 5)
  })

  it('lightness is strictly decreasing across all steps', () => {
    const steps = generateScale(defaultGeneratorSettings())
    for (let i = 0; i < steps.length - 1; i++) {
      expect(steps[i].oklch.l).toBeGreaterThan(steps[i + 1].oklch.l)
    }
  })

  it('gaussian distribution: chroma peaks near the configured mean lightness', () => {
    const settings = defaultGeneratorSettings() // mean=0.6, sigma=0.2
    const steps = generateScale(settings)

    // Find the step whose lightness is closest to the gaussian mean (0.6)
    const meanL = settings.gaussianMean!
    const closestToMean = steps.reduce((best, step) =>
      Math.abs(step.oklch.l - meanL) < Math.abs(best.oklch.l - meanL) ? step : best
    )

    // That step should have higher chroma than the extreme steps (1 and 12)
    expect(closestToMean.oklch.c).toBeGreaterThan(steps[0].oklch.c)
    expect(closestToMean.oklch.c).toBeGreaterThan(steps[11].oklch.c)
  })

  it('gaussian peak chroma does not exceed baseChroma', () => {
    const settings = defaultGeneratorSettings()
    const steps = generateScale(settings)
    for (const step of steps) {
      expect(step.oklch.c).toBeLessThanOrEqual(settings.baseChroma + 1e-9)
    }
  })

  it('linear curve uses constant chroma across all steps', () => {
    const settings = { ...defaultGeneratorSettings(), chromaCurve: 'linear' as const }
    const steps = generateScale(settings)
    for (const step of steps) {
      expect(step.oklch.c).toBeCloseTo(settings.baseChroma, 9)
    }
  })

  it('all steps have alpha 1 and the configured hue', () => {
    const settings = defaultGeneratorSettings()
    const steps = generateScale(settings)
    for (const step of steps) {
      expect(step.oklch.a).toBe(1)
      expect(step.oklch.h).toBe(settings.baseHue)
    }
  })
})

describe('clampToSRGB', () => {
  it('returns a color displayable in sRGB', () => {
    // A wide-gamut oklch color that exceeds sRGB
    const outOfGamut = { l: 0.5, c: 0.35, h: 145, a: 1 }
    const clamped = clampToSRGB(outOfGamut)
    expect(isInSRGB(clamped)).toBe(true)
  })

  it('leaves an already-in-gamut color essentially unchanged', () => {
    const inGamut = { l: 0.5, c: 0.02, h: 250, a: 1 }
    const clamped = clampToSRGB(inGamut)
    expect(isInSRGB(clamped)).toBe(true)
    expect(clamped.l).toBeCloseTo(inGamut.l, 3)
    expect(clamped.h).toBeCloseTo(inGamut.h, 3)
  })

  it('preserves alpha', () => {
    const color = { l: 0.5, c: 0.35, h: 145, a: 0.5 }
    const clamped = clampToSRGB(color)
    expect(clamped.a).toBe(0.5)
  })
})
