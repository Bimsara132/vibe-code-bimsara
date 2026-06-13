export const MODERN_UI_CANVAS_DIRECTIVE = `Build this in Canvas as a working interactive prototype with a modern product UI:
- Clean layout, clear visual hierarchy, and generous whitespace
- Responsive, mobile-first design with polished hover, focus, and active states
- Contemporary patterns: cards, subtle borders, soft shadows, 8px rounded corners
- Accessible contrast, readable typography, and consistent spacing scale
- Production-quality components that feel like a current SaaS or consumer app
- Use Tailwind-style utility classes and semantic HTML where applicable`

export function buildPromptWithCanvas(prompt: string, useCanvas: boolean) {
  const trimmed = prompt.trim()
  if (!trimmed) return trimmed
  if (!useCanvas) return trimmed

  return `${trimmed}\n\n${MODERN_UI_CANVAS_DIRECTIVE}`
}
