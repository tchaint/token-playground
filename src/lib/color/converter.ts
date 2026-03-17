import { converter, formatHex, formatHsl, parse } from 'culori'

const toRgb = converter('rgb')
const toHsl = converter('hsl')

type Oklch = { l: number; c: number; h: number; a: number }

function toCulori(oklch: Oklch) {
  return { mode: 'oklch' as const, l: oklch.l, c: oklch.c, h: oklch.h, alpha: oklch.a < 1 ? oklch.a : undefined }
}

export function oklchToCSS(oklch: Oklch): string {
  const l = +oklch.l.toFixed(4)
  const c = +oklch.c.toFixed(4)
  const h = +oklch.h.toFixed(2)
  return oklch.a < 1
    ? `oklch(${l} ${c} ${h} / ${+oklch.a.toFixed(3)})`
    : `oklch(${l} ${c} ${h})`
}

export function oklchToHex(oklch: Oklch): string {
  return formatHex(toRgb(toCulori(oklch))) ?? '#000000'
}

export function oklchToHSL(oklch: Oklch): string {
  const hsl = toHsl(toCulori(oklch))
  const h = Math.round(hsl.h ?? 0)
  const s = Math.round((hsl.s ?? 0) * 100)
  const l = Math.round((hsl.l ?? 0) * 100)
  return `hsl(${h} ${s}% ${l}%)`
}

export function oklchToRGB(oklch: Oklch): { r: number; g: number; b: number; a: number } {
  const rgb = toRgb(toCulori(oklch))
  return {
    r: Math.round(Math.max(0, Math.min(1, rgb.r)) * 255),
    g: Math.round(Math.max(0, Math.min(1, rgb.g)) * 255),
    b: Math.round(Math.max(0, Math.min(1, rgb.b)) * 255),
    a: oklch.a,
  }
}

export function cssToOklch(css: string): Oklch {
  const toOklch = converter('oklch')
  const parsed = parse(css)
  if (!parsed) throw new Error(`Cannot parse CSS color: "${css}"`)
  const result = toOklch(parsed)
  return {
    l: result.l ?? 0,
    c: result.c ?? 0,
    h: result.h ?? 0,
    a: result.alpha ?? 1,
  }
}

export function formatOklchChannels(oklch: Oklch): string {
  const l = +oklch.l.toFixed(4)
  const c = +oklch.c.toFixed(4)
  const h = +oklch.h.toFixed(2)
  return `${l} ${c} ${h}`
}
