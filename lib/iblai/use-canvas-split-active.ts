'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { selectCurrentStreamingArtifact } from '@iblai/iblai-js/web-utils'

const CANVAS_SPLIT_SELECTORS = [
  '.chat-main-content-area > .relative.flex.flex-1.overflow-hidden',
  '.chat-main-content-area > div.relative.flex-1',
]

function isCanvasDomActive(root: Element) {
  for (const selector of CANVAS_SPLIT_SELECTORS) {
    if (root.querySelector(selector)) return true
  }

  const main = root.querySelector('.chat-main-content-area')
  if (!main) return false

  for (const child of Array.from(main.children)) {
    const element = child as HTMLElement
    if (element.style.display === 'none') continue
    if (
      element.classList.contains('relative') &&
      element.classList.contains('flex-1') &&
      element.classList.contains('overflow-hidden')
    ) {
      return true
    }
  }

  return false
}

/**
 * True when the SDK canvas split (chat + preview) is open.
 * Uses SDK window events for immediate detection, with DOM observation as fallback.
 */
export function useCanvasSplitActive(rootSelector = '#vibe-custom-chat') {
  const streamingArtifact = useSelector(selectCurrentStreamingArtifact)
  const [eventActive, setEventActive] = useState(false)
  const [domActive, setDomActive] = useState(false)

  useEffect(() => {
    const onOpen = () => setEventActive(true)
    const onClose = () => setEventActive(false)

    window.addEventListener('artifact-stream-start', onOpen)
    window.addEventListener('canvas-active', onOpen)
    window.addEventListener('canvas-integration-active', onOpen)
    window.addEventListener('canvas-inactive', onClose)
    window.addEventListener('canvas-integration-inactive', onClose)

    return () => {
      window.removeEventListener('artifact-stream-start', onOpen)
      window.removeEventListener('canvas-active', onOpen)
      window.removeEventListener('canvas-integration-active', onOpen)
      window.removeEventListener('canvas-inactive', onClose)
      window.removeEventListener('canvas-integration-inactive', onClose)
    }
  }, [])

  useEffect(() => {
    const root = document.querySelector(rootSelector)
    if (!root) {
      setDomActive(false)
      return
    }

    const check = () => setDomActive(isCanvasDomActive(root))

    check()

    const observer = new MutationObserver(check)
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    return () => observer.disconnect()
  }, [rootSelector])

  return domActive || eventActive || Boolean(streamingArtifact)
}
