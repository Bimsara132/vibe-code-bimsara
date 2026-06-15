'use client'

import {
  chatInputSliceActions,
  eventBus,
  RemoteEvents,
  selectNumberOfActiveChatMessages,
} from '@iblai/iblai-js/web-utils'
import type { Dispatch } from '@reduxjs/toolkit'

import { iblaiStore } from '@/store/iblai-store'

const CHAT_ROOT = '#vibe-custom-chat'

function didSendStart(messageCountBefore: number) {
  const state = iblaiStore.getState()
  return selectNumberOfActiveChatMessages(state) > messageCountBefore
}

export function isSdkChatInputMounted() {
  return Boolean(findChatTextarea())
}

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

function submitViaDom(message: string) {
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

function trySubmit(
  dispatch: Dispatch,
  message: string,
  messageCountBefore: number,
  emitEvent: boolean,
) {
  if (didSendStart(messageCountBefore)) {
    return true
  }

  dispatch(chatInputSliceActions.setTextareaInput(message))

  if (emitEvent) {
    eventBus.emit(RemoteEvents.sendChatMessage, {
      content: message,
      visible: true,
    })
  }

  if (didSendStart(messageCountBefore)) {
    return true
  }

  submitViaDom(message)
  return didSendStart(messageCountBefore)
}

export function submitSdkChatMessage(dispatch: Dispatch, message: string): boolean {
  const trimmed = message.trim()
  if (!trimmed) return false

  const messageCountBefore = selectNumberOfActiveChatMessages(iblaiStore.getState())
  return trySubmit(dispatch, trimmed, messageCountBefore, true)
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
  const trimmed = message.trim()
  if (!trimmed) return () => {}

  const messageCountBefore = selectNumberOfActiveChatMessages(iblaiStore.getState())
  let eventEmitted = false

  const attempt = () => {
    if (didSendStart(messageCountBefore)) {
      return true
    }

    const shouldEmit = !eventEmitted
    if (shouldEmit) {
      eventEmitted = true
    }

    return trySubmit(dispatch, trimmed, messageCountBefore, shouldEmit)
  }

  if (attempt()) {
    options?.onSuccess?.()
    return () => {}
  }

  const intervalMs = options?.intervalMs ?? 200
  const timeoutMs = options?.timeoutMs ?? 30000

  const interval = window.setInterval(() => {
    if (attempt()) {
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
