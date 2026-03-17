import { wcagContrast, converter, parse } from 'culori'
import { APCAcontrast, sRGBtoY } from 'apca-w3'

const toRgb = converter('rgb')

export function wcagContrastRatio(fg: string, bg: string): number {
  return wcagContrast(fg, bg)
}

export function apcaContrast(fg: string, bg: string): number {
  const fgParsed = parse(fg)
  const bgParsed = parse(bg)
  if (!fgParsed || !bgParsed) throw new Error(`Cannot parse color: "${!fgParsed ? fg : bg}"`)

  const fgRgb = toRgb(fgParsed)
  const bgRgb = toRgb(bgParsed)

  const fgY = sRGBtoY([fgRgb.r * 255, fgRgb.g * 255, fgRgb.b * 255])
  const bgY = sRGBtoY([bgRgb.r * 255, bgRgb.g * 255, bgRgb.b * 255])

  return APCAcontrast(fgY, bgY) as number
}

export function contrastLevel(ratio: number): 'pass' | 'large-only' | 'fail' {
  if (ratio >= 4.5) return 'pass'
  if (ratio >= 3.0) return 'large-only'
  return 'fail'
}
