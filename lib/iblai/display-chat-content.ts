import { MODERN_UI_CANVAS_DIRECTIVE } from '@/lib/iblai/build-canvas-prompt'

export function displayChatContent(content: string) {
  const trimmed = content.trim()
  if (!trimmed) return trimmed

  const directiveSuffix = `\n\n${MODERN_UI_CANVAS_DIRECTIVE}`
  if (trimmed.endsWith(MODERN_UI_CANVAS_DIRECTIVE)) {
    return trimmed.slice(0, -directiveSuffix.length).trim()
  }

  return trimmed
}
