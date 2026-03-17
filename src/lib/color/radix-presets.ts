import {
  gray, grayDark,
  mauve, mauveDark,
  slate, slateDark,
  sage, sageDark,
  olive, oliveDark,
  sand, sandDark,
  gold, goldDark,
  bronze, bronzeDark,
  brown, brownDark,
  yellow, yellowDark,
  amber, amberDark,
  orange, orangeDark,
  tomato, tomatoDark,
  red, redDark,
  ruby, rubyDark,
  crimson, crimsonDark,
  pink, pinkDark,
  plum, plumDark,
  purple, purpleDark,
  violet, violetDark,
  iris, irisDark,
  indigo, indigoDark,
  blue, blueDark,
  cyan, cyanDark,
  teal, tealDark,
  jade, jadeDark,
  green, greenDark,
  grass, grassDark,
  lime, limeDark,
  mint, mintDark,
  sky, skyDark,
} from '@radix-ui/colors'

import type { ColorScale, ColorStep } from '../types'
import { cssToOklch } from './converter'

export const RADIX_SCALE_NAMES: string[] = [
  'gray', 'mauve', 'slate', 'sage', 'olive', 'sand',
  'gold', 'bronze', 'brown',
  'yellow', 'amber', 'orange',
  'tomato', 'red', 'ruby', 'crimson', 'pink', 'plum',
  'purple', 'violet', 'iris', 'indigo',
  'blue', 'cyan', 'teal', 'jade', 'green', 'grass',
  'lime', 'mint', 'sky',
].sort()

type RawScale = Record<string, string>

const RAW_SCALES: Record<string, { light: RawScale; dark: RawScale }> = {
  gray:    { light: gray,    dark: grayDark },
  mauve:   { light: mauve,   dark: mauveDark },
  slate:   { light: slate,   dark: slateDark },
  sage:    { light: sage,    dark: sageDark },
  olive:   { light: olive,   dark: oliveDark },
  sand:    { light: sand,    dark: sandDark },
  gold:    { light: gold,    dark: goldDark },
  bronze:  { light: bronze,  dark: bronzeDark },
  brown:   { light: brown,   dark: brownDark },
  yellow:  { light: yellow,  dark: yellowDark },
  amber:   { light: amber,   dark: amberDark },
  orange:  { light: orange,  dark: orangeDark },
  tomato:  { light: tomato,  dark: tomatoDark },
  red:     { light: red,     dark: redDark },
  ruby:    { light: ruby,    dark: rubyDark },
  crimson: { light: crimson, dark: crimsonDark },
  pink:    { light: pink,    dark: pinkDark },
  plum:    { light: plum,    dark: plumDark },
  purple:  { light: purple,  dark: purpleDark },
  violet:  { light: violet,  dark: violetDark },
  iris:    { light: iris,    dark: irisDark },
  indigo:  { light: indigo,  dark: indigoDark },
  blue:    { light: blue,    dark: blueDark },
  cyan:    { light: cyan,    dark: cyanDark },
  teal:    { light: teal,    dark: tealDark },
  jade:    { light: jade,    dark: jadeDark },
  green:   { light: green,   dark: greenDark },
  grass:   { light: grass,   dark: grassDark },
  lime:    { light: lime,    dark: limeDark },
  mint:    { light: mint,    dark: mintDark },
  sky:     { light: sky,     dark: skyDark },
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function convertRawScale(name: string, mode: 'light' | 'dark', raw: RawScale): ColorScale | null {
  try {
    const steps: ColorStep[] = Array.from({ length: 12 }, (_, i) => {
      const stepIndex = i + 1
      const key = `${name}${stepIndex}`
      const css = raw[key]
      if (!css) throw new Error(`Missing key "${key}" in Radix scale "${name}"`)
      return { index: stepIndex, oklch: cssToOklch(css) }
    })

    return {
      id: `radix-${name}-${mode}`,
      name: `${capitalize(name)} (${mode === 'light' ? 'Light' : 'Dark'})`,
      source: 'radix',
      radixName: name,
      steps,
      createdAt: 0,
      updatedAt: 0,
    }
  } catch (err) {
    console.warn(`[radix-presets] Skipping "${name}" (${mode}):`, err)
    return null
  }
}

function buildScaleMap(mode: 'light' | 'dark'): Record<string, ColorScale> {
  const result: Record<string, ColorScale> = {}
  for (const name of RADIX_SCALE_NAMES) {
    const raw = RAW_SCALES[name]
    if (!raw) {
      console.warn(`[radix-presets] No raw scale data for "${name}" — skipping.`)
      continue
    }
    const scale = convertRawScale(name, mode, raw[mode])
    if (scale) result[name] = scale
  }
  return result
}

export const RADIX_SCALES_LIGHT: Record<string, ColorScale> = buildScaleMap('light')
export const RADIX_SCALES_DARK: Record<string, ColorScale> = buildScaleMap('dark')

export function getRadixScale(name: string, mode: 'light' | 'dark'): ColorScale {
  const map = mode === 'light' ? RADIX_SCALES_LIGHT : RADIX_SCALES_DARK
  const scale = map[name]
  if (!scale) throw new Error(`Radix scale "${name}" (${mode}) not found`)
  return scale
}
