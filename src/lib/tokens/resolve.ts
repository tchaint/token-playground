import type { TokenRef, SemanticTokenMap, ColorScale } from '../types'
import { oklchToCSS } from '../color/converter'
import { SEMANTIC_TOKENS } from './semantic-tokens'
import { CSS_BRIDGE_MAP } from './bridge'

export function resolveTokenRef(ref: TokenRef, scales: ColorScale[]): string | null {
  const scale = scales.find((s) => s.id === ref.scaleId)
  if (!scale) return null
  const step = scale.steps.find((s) => s.index === ref.stepIndex)
  if (!step) return null
  return oklchToCSS(step.oklch)
}

export function resolveAllTokens(
  tokens: SemanticTokenMap,
  scales: ColorScale[],
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const descriptor of SEMANTIC_TOKENS) {
    const ref = tokens[descriptor.key]
    const value = resolveTokenRef(ref, scales)
    if (value !== null) {
      result[descriptor.cssVariable] = value
    }
  }
  return result
}

export function resolveWithBridge(
  tokens: SemanticTokenMap,
  scales: ColorScale[],
): Record<string, string> {
  const resolved = resolveAllTokens(tokens, scales)

  for (const [ourVar, shadcnVars] of Object.entries(CSS_BRIDGE_MAP)) {
    const value = resolved[ourVar]
    if (value === undefined) continue
    const targets = Array.isArray(shadcnVars) ? shadcnVars : [shadcnVars]
    for (const shadcnVar of targets) {
      resolved[shadcnVar] = value
    }
  }

  return resolved
}
