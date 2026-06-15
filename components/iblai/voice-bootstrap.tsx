'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { selectSessionId } from '@iblai/iblai-js/web-utils'

import {
  triggerSdkVoiceCallWithRetry,
  triggerSdkVoiceInputWithRetry,
} from '@/lib/iblai/trigger-sdk-voice'

export function VoiceBootstrap({
  startVoiceCall = false,
  startVoiceRecord = false,
}: {
  startVoiceCall?: boolean
  startVoiceRecord?: boolean
}) {
  const sessionId = useSelector(selectSessionId)
  const voiceCallStartedRef = useRef(false)
  const voiceRecordStartedRef = useRef(false)

  useEffect(() => {
    if (!startVoiceCall || voiceCallStartedRef.current || !sessionId) return

    const cleanup = triggerSdkVoiceCallWithRetry()
    voiceCallStartedRef.current = true

    return cleanup
  }, [sessionId, startVoiceCall])

  useEffect(() => {
    if (!startVoiceRecord || voiceRecordStartedRef.current || !sessionId) return

    const cleanup = triggerSdkVoiceInputWithRetry()
    voiceRecordStartedRef.current = true

    return cleanup
  }, [sessionId, startVoiceRecord])

  return null
}
