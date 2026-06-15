const VOICE_ROOTS = ['#sdk-voice-host', '#main-content']

function queryInVoiceRoots(selector: string) {
  for (const root of VOICE_ROOTS) {
    const match = document.querySelector(`${root} ${selector}`)
    if (match) return match
  }
  return null
}

function findSdkVoiceInputButton() {
  return queryInVoiceRoots('button[aria-label="Voice input"]') as HTMLButtonElement | null
}

function findSdkVoiceCallButton() {
  for (const root of VOICE_ROOTS) {
    const buttons = document.querySelectorAll(`${root} button`)
    for (const button of buttons) {
      const srOnly = button.querySelector('.sr-only')
      if (srOnly?.textContent?.trim() === 'Voice call') {
        return button as HTMLButtonElement
      }
    }
  }

  return null
}

export function triggerSdkVoiceInput(): boolean {
  const button = findSdkVoiceInputButton()
  if (!button || button.disabled) return false
  button.click()
  return true
}

export function triggerSdkVoiceCall(): boolean {
  const button = findSdkVoiceCallButton()
  if (!button || button.disabled) return false
  button.click()
  return true
}

function withRetry(
  action: () => boolean,
  options?: { intervalMs?: number; timeoutMs?: number },
) {
  if (action()) return () => {}

  const intervalMs = options?.intervalMs ?? 200
  const timeoutMs = options?.timeoutMs ?? 30000

  const interval = window.setInterval(() => {
    if (action()) {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, intervalMs)

  const timeout = window.setTimeout(() => {
    window.clearInterval(interval)
  }, timeoutMs)

  return () => {
    window.clearInterval(interval)
    window.clearTimeout(timeout)
  }
}

export function triggerSdkVoiceInputWithRetry(options?: {
  intervalMs?: number
  timeoutMs?: number
}) {
  return withRetry(triggerSdkVoiceInput, options)
}

export function triggerSdkVoiceCallWithRetry(options?: {
  intervalMs?: number
  timeoutMs?: number
}) {
  return withRetry(triggerSdkVoiceCall, options)
}
