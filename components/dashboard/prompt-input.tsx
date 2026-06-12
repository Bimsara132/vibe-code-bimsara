'use client'

import type React from 'react'
import { useRef, useState } from 'react'

import { Archive, FileText, Plus, X } from 'lucide-react'

import { VoiceControls } from '@/components/chat-input/voice-controls'
import { CanvasIcon } from '@/components/icons/canvas-icon'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

function chipButtonClass(active: boolean) {
  return cn(
    'h-7 gap-1 rounded-lg px-1.5 text-xs transition-all duration-200 md:h-8 md:gap-1.5 md:px-2 md:text-sm',
    active
      ? 'border border-ibl-soft-border bg-ibl-soft text-ibl'
      : 'text-gray-600 hover:border hover:border-ibl-soft-border hover:bg-ibl-soft',
  )
}

export function PromptInput() {
  const [inputValue, setInputValue] = useState('')
  const [selectedToolType, setSelectedToolType] = useState('')
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [fileAddedNotification, setFileAddedNotification] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    setInputValue('')
    if (selectedToolType !== 'Canvas') {
      setSelectedToolType('')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(false)

    if (e.dataTransfer.files?.length) {
      const count = e.dataTransfer.files.length
      setFileAddedNotification(`${count} file${count > 1 ? 's' : ''} added`)
      setTimeout(() => setFileAddedNotification(null), 3000)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const count = e.target.files.length
      setFileAddedNotification(`${count} file${count > 1 ? 's' : ''} added`)
      setTimeout(() => setFileAddedNotification(null), 3000)
    }
  }

  const triggerFileInput = () => {
    inputRef.current?.click()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="relative w-full rounded-[10px] bg-white shadow-sm">
        {isDraggingFile && (
          <div className="pointer-events-none absolute inset-0 z-10 rounded-[10px] border-2 border-dashed border-ibl bg-ibl-soft/60" />
        )}

        {fileAddedNotification && (
          <div className="absolute top-0 right-0 left-0 -mt-10 flex items-center gap-2 rounded-[10px] bg-blue-50 p-2 text-xs text-blue-600">
            <FileText className="size-3" />
            <span className="truncate">{fileAddedNotification}</span>
          </div>
        )}

        <div className="relative flex h-[104px] flex-col overflow-hidden rounded-[10px] bg-ibl-surface">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            className="min-h-0 flex-1 resize-none rounded-none rounded-t-[10px] border-0 border-none bg-transparent px-4 pt-3 pb-0 text-sm shadow-none placeholder:text-gray-400 focus-visible:ring-0 md:text-base"
          />

          <div className="flex shrink-0 items-center justify-between rounded-b-[10px] border-0 pl-1.5 pr-2 pt-1.5 pb-2 md:pl-2 md:pr-3 md:pt-2 md:pb-3">
            <div className="relative flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pr-1.5 md:gap-1.5 md:pr-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 rounded-lg text-gray-600 hover:border hover:border-ibl-soft-border hover:bg-ibl-soft md:size-8"
                aria-label="Add attachment"
                onClick={triggerFileInput}
              >
                <Plus className="size-3.5 md:size-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={chipButtonClass(selectedToolType === 'Canvas')}
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedToolType((prev) =>
                    prev === 'Canvas' ? '' : 'Canvas',
                  )
                }}
              >
                <CanvasIcon
                  className={cn(
                    'size-3.5 md:size-4',
                    selectedToolType === 'Canvas'
                      ? 'text-ibl'
                      : 'text-gray-600',
                  )}
                />
                Canvas
                {selectedToolType === 'Canvas' && (
                  <X
                    className="ml-0.5 size-2.5 cursor-pointer md:ml-1 md:size-3"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedToolType('')
                    }}
                  />
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={chipButtonClass(selectedToolType === 'Memory')}
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedToolType((prev) =>
                    prev === 'Memory' ? '' : 'Memory',
                  )
                }}
              >
                <Archive
                  className={cn(
                    'size-3.5 md:size-4',
                    selectedToolType === 'Memory'
                      ? 'text-ibl'
                      : 'text-gray-600',
                  )}
                />
                Memory
                {selectedToolType === 'Memory' && (
                  <X
                    className="ml-0.5 size-2.5 cursor-pointer md:ml-1 md:size-3"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedToolType('')
                    }}
                  />
                )}
              </Button>
            </div>

            <VoiceControls
              isRecording={isRecording}
              onVoiceInput={() => setIsRecording((prev) => !prev)}
              onPhoneCallClick={() => setIsRecording(true)}
            />
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          multiple
        />
      </div>
    </form>
  )
}
