'use client'

import { chatInputSliceActions } from '@iblai/iblai-js/web-utils'
import type { Dispatch } from '@reduxjs/toolkit'

const CHAT_ROOT = '#main-content'

function findChatTextarea() {
  return document.querySelector(
    `${CHAT_ROOT} #chat-input-textarea`,
  ) as HTMLTextAreaElement | null
}

function findChatSubmitButton() {
  return document.querySelector(
    `${CHAT_ROOT} .chat-submit-message-button`,
  ) as HTMLButtonElement | null
}

export function submitSdkChatMessage(dispatch: Dispatch, message: string): boolean {
  dispatch(chatInputSliceActions.setTextareaInput(message))

  const textarea = findChatTextarea()
  if (textarea) {
    textarea.value = message
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
    textarea.dispatchEvent(new Event('change', { bubbles: true }))
  }

  const button = findChatSubmitButton()
  if (button && !button.disabled) {
    button.click()
    return true
  }

  const form = textarea?.closest('form')
  if (form && typeof form.requestSubmit === 'function') {
    form.requestSubmit()
    return true
  }

  return false
}

export function submitSdkChatMessageWithRetry(
  dispatch: Dispatch,
  message: string,
  options?: {
    intervalMs?: number
    timeoutMs?: number
    onSuccess?: () => void
  },
) {
  if (submitSdkChatMessage(dispatch, message)) {
    options?.onSuccess?.()
    return () => {}
  }

  const intervalMs = options?.intervalMs ?? 200
  const timeoutMs = options?.timeoutMs ?? 30000

  const interval = window.setInterval(() => {
    if (submitSdkChatMessage(dispatch, message)) {
      options?.onSuccess?.()
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
