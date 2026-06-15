'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import {
  useCreateMentorMemoryMutation,
  useDeleteMentorMemoryMutation,
  useGetMemoryCategoriesAdminQuery,
  useGetMentorMemoriesListQuery,
  useUpdateMentorMemoryMutation,
} from '@iblai/iblai-js/data-layer'
import { useUsername } from '@iblai/iblai-js/web-utils'
import {
  Archive,
  LoaderCircle,
  PenLine,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

type MemoryItem = {
  id: number
  content: string
  category: { id: number; name: string; slug: string }
  createdAt: string
}

function formatTimestamp(dateStr: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

type MemoryMenuPanelProps = {
  mentorId: string
  tenantKey: string
  username: string
  onClose: () => void
}

function MemoryMenuPanel({
  mentorId,
  tenantKey,
  username,
  onClose,
}: MemoryMenuPanelProps) {
  const [page, setPage] = useState(1)
  const [accumulated, setAccumulated] = useState<MemoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddingMemory, setIsAddingMemory] = useState(false)
  const [editingMemoryId, setEditingMemoryId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editCategorySlug, setEditCategorySlug] = useState('')
  const [newMemory, setNewMemory] = useState({ content: '', categorySlug: '' })
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data: response, isFetching } = useGetMentorMemoriesListQuery(
    {
      org: tenantKey,
      userId: username,
      mentorId,
      params: { page, page_size: PAGE_SIZE, my_memory: true },
    },
    { skip: !tenantKey || !username || !mentorId },
  )

  const { data: adminCategories } = useGetMemoryCategoriesAdminQuery(
    { org: tenantKey, mentorId },
    { skip: !tenantKey || !mentorId },
  )

  const [deleteMentorMemory] = useDeleteMentorMemoryMutation()
  const [updateMentorMemory, { isLoading: isUpdating }] =
    useUpdateMentorMemoryMutation()
  const [createMentorMemory, { isLoading: isCreating }] =
    useCreateMentorMemoryMutation()

  useEffect(() => {
    if (!response?.results) return
    const next = response.results.map((memory) => ({
      id: memory.id,
      content: memory.content,
      category: {
        id: memory.category.id,
        name: memory.category.name,
        slug: memory.category.slug,
      },
      createdAt: memory.created_at,
    }))

    if (page === 1) {
      setAccumulated(next)
      return
    }

    setAccumulated((prev) => {
      const seen = new Set(prev.map((item) => item.id))
      const merged = next.filter((item) => !seen.has(item.id))
      return merged.length > 0 ? [...prev, ...merged] : prev
    })
  }, [page, response])

  const categories =
    adminCategories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })) ?? []

  const filteredMemories = accumulated.filter(
    (memory) =>
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const isInitialLoading = isFetching && accumulated.length === 0
  const hasMore = Boolean(response?.next)

  const resetPagination = () => {
    setPage(1)
    setAccumulated([])
  }

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || isFetching) return
    const element = event.currentTarget
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 80) {
      setPage((current) => current + 1)
    }
  }

  const handleDeleteMemory = async (memoryId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setDeletingId(memoryId)
    try {
      await deleteMentorMemory({
        org: tenantKey,
        userId: username,
        mentorId,
        memoryId,
      }).unwrap()
      resetPagination()
      toast.success('Memory deleted')
    } catch {
      toast.error('Failed to delete memory')
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddMemory = async () => {
    if (!newMemory.content.trim()) return
    try {
      await createMentorMemory({
        org: tenantKey,
        userId: username,
        mentorId,
        data: {
          category_slug: newMemory.categorySlug || 'general',
          content: newMemory.content.trim(),
        },
      }).unwrap()
      setNewMemory({ content: '', categorySlug: '' })
      setIsAddingMemory(false)
      resetPagination()
      toast.success('Memory created')
    } catch {
      toast.error('Failed to create memory')
    }
  }

  const startEdit = (memory: MemoryItem, event: React.MouseEvent) => {
    event.stopPropagation()
    setEditingMemoryId(memory.id)
    setEditContent(memory.content)
    setEditCategorySlug(memory.category.slug)
  }

  const handleSaveEdit = async () => {
    if (!editingMemoryId) return
    const original = accumulated.find((memory) => memory.id === editingMemoryId)
    try {
      await updateMentorMemory({
        org: tenantKey,
        userId: username,
        mentorId,
        memoryId: editingMemoryId,
        data: {
          content: editContent,
          ...(original && editCategorySlug !== original.category.slug
            ? { category_slug: editCategorySlug }
            : {}),
        },
      }).unwrap()
      setEditingMemoryId(null)
      setEditContent('')
      setEditCategorySlug('')
      resetPagination()
      toast.success('Memory updated')
    } catch {
      toast.error('Failed to update memory')
    }
  }

  return (
    <div className="w-96 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-100 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Your Memory</h3>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6 rounded-full hover:bg-[#38A1E5] hover:text-white"
              onClick={() => setIsAddingMemory(true)}
              aria-label="Add memory"
            >
              <Plus className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6 rounded-full hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close memory panel"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-8 rounded-md border border-gray-300 pl-10 text-sm"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Your saved memories for this agent
        </p>
      </div>

      {isAddingMemory && (
        <div className="border-b border-gray-100 bg-gray-50 p-4">
          <h4 className="mb-3 font-medium text-gray-900">Add New Memory</h4>
          <div className="space-y-3">
            <Textarea
              placeholder="Memory content..."
              value={newMemory.content}
              onChange={(event) =>
                setNewMemory((current) => ({
                  ...current,
                  content: event.target.value,
                }))
              }
              className="min-h-[60px] resize-none rounded-md border border-gray-300 text-sm"
            />
            {categories.length > 0 && (
              <select
                value={newMemory.categorySlug}
                onChange={(event) =>
                  setNewMemory((current) => ({
                    ...current,
                    categorySlug: event.target.value,
                  }))
                }
                className="h-8 w-full rounded-md border border-gray-300 px-2 text-sm text-gray-700"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleAddMemory}
                disabled={!newMemory.content.trim() || isCreating}
                className="bg-[#38A1E5] text-white hover:bg-[#2891D5]"
              >
                {isCreating ? (
                  <LoaderCircle className="mr-1 size-3 animate-spin" />
                ) : null}
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingMemory(false)
                  setNewMemory({ content: '', categorySlug: '' })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-80 overflow-y-auto"
      >
        {isInitialLoading ? (
          <div className="flex items-center justify-center p-8">
            <LoaderCircle className="size-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {filteredMemories.map((memory) => {
              const isEditing = editingMemoryId === memory.id
              return (
                <div
                  key={memory.id}
                  className="border-b border-gray-50 p-3 transition-colors last:border-b-0 hover:bg-gray-50"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        className="min-h-[60px] resize-none rounded-md border border-gray-300 text-sm"
                        placeholder="Memory content..."
                      />
                      {categories.length > 0 && (
                        <select
                          value={editCategorySlug}
                          onChange={(event) =>
                            setEditCategorySlug(event.target.value)
                          }
                          className="h-8 w-full rounded-md border border-gray-300 px-2 text-sm text-gray-700"
                        >
                          {categories.map((category) => (
                            <option key={category.slug} value={category.slug}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={!editContent.trim() || isUpdating}
                          className="bg-[#38A1E5] text-white hover:bg-[#2891D5]"
                        >
                          {isUpdating ? (
                            <LoaderCircle className="mr-1 size-3 animate-spin" />
                          ) : null}
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingMemoryId(null)
                            setEditContent('')
                            setEditCategorySlug('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                          {memory.category.name}
                        </span>
                        <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                          {memory.content}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {formatTimestamp(memory.createdAt)}
                        </p>
                      </div>
                      <div className="ml-2 flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-full hover:bg-blue-100"
                          onClick={(event) => startEdit(memory, event)}
                          aria-label="Edit memory"
                        >
                          <PenLine className="size-3 text-blue-500" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-full hover:bg-red-100"
                          disabled={deletingId === memory.id}
                          onClick={(event) => handleDeleteMemory(memory.id, event)}
                          aria-label="Delete memory"
                        >
                          {deletingId === memory.id ? (
                            <LoaderCircle className="size-3 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="size-3 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {filteredMemories.length === 0 && !isInitialLoading && (
              <div className="p-4 text-center text-sm text-gray-500">
                {searchQuery
                  ? 'No memories found matching your search.'
                  : 'No memories yet.'}
              </div>
            )}
            {isFetching && accumulated.length > 0 && (
              <div className="flex items-center justify-center p-3">
                <LoaderCircle className="size-4 animate-spin text-gray-400" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

type MemoryPopoverProps = {
  mentorId?: string
  tenantKey?: string
  chipButtonClass: (active: boolean) => string
}

export function MemoryPopover({
  mentorId,
  tenantKey = '',
  chipButtonClass,
}: MemoryPopoverProps) {
  const username = useUsername() ?? ''
  const [open, setOpen] = useState(false)
  const [panelStyle, setPanelStyle] = useState<{ top: number; left: number } | null>(
    null,
  )
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const canOpen = Boolean(mentorId && tenantKey && username)

  useEffect(() => {
    if (!open || !triggerRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      setPanelStyle({
        top: rect.top + window.scrollY - 8,
        left: rect.left + window.scrollX,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  if (!canOpen) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={chipButtonClass(false)}
        disabled
        aria-label="Memory unavailable"
      >
        <Archive className="size-3.5 text-gray-400 md:size-4" />
        Memory
      </Button>
    )
  }

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="sm"
        className={chipButtonClass(open)}
        aria-label="Memory"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Archive
          className={cn(
            'size-3.5 md:size-4',
            open ? 'text-ibl' : 'text-gray-600',
          )}
        />
        Memory
      </Button>

      {open &&
        panelStyle &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-[260] -translate-y-full"
            style={{ top: panelStyle.top, left: panelStyle.left }}
          >
            <MemoryMenuPanel
              mentorId={mentorId!}
              tenantKey={tenantKey}
              username={username}
              onClose={() => setOpen(false)}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
