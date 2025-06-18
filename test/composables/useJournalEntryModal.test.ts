import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useJournalEntryModal } from '~/composables/useJournalEntryModal'
import type { JournalEntry } from '~/types/journal'

// Mock $fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

describe('useJournalEntryModal', () => {
  let composable: ReturnType<typeof useJournalEntryModal>

  beforeEach(() => {
    vi.clearAllMocks()
    composable = useJournalEntryModal()
  })

  it('initializes with correct default values', () => {
    expect(composable.showModal.value).toBe(false)
    expect(composable.isSaving.value).toBe(false)
  })

  it('opens modal correctly', () => {
    composable.openModal()
    expect(composable.showModal.value).toBe(true)
  })

  it('closes modal correctly', () => {
    composable.openModal()
    expect(composable.showModal.value).toBe(true)
    
    composable.closeModal()
    expect(composable.showModal.value).toBe(false)
  })

  it('creates entry successfully', async () => {
    const entryData: Partial<JournalEntry> = {
      title: 'Test Entry',
      content: 'Test content',
      type: 'DAILY',
      date: '2024-01-01',
      mood: 'HAPPY',
      tags: ['test'],
      templateUsed: 'default'
    }

    const onSuccess = vi.fn()
    mockFetch.mockResolvedValue({ success: true })

    await composable.createEntry(entryData, onSuccess)

    expect(mockFetch).toHaveBeenCalledWith('/api/journal', {
      method: 'POST',
      body: entryData
    })
    expect(composable.showModal.value).toBe(false)
    expect(onSuccess).toHaveBeenCalled()
    expect(composable.isSaving.value).toBe(false)
  })

  it('handles error during entry creation', async () => {
    const entryData: Partial<JournalEntry> = { title: 'Test Entry' }
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    mockFetch.mockRejectedValue(new Error('API Error'))

    await composable.createEntry(entryData)

    expect(consoleSpy).toHaveBeenCalledWith('Error creating journal entry:', expect.any(Error))
    expect(composable.isSaving.value).toBe(false)
    expect(composable.showModal.value).toBe(false)

    consoleSpy.mockRestore()
  })

  it('sets isSaving state correctly during API call', async () => {
    const entryData: Partial<JournalEntry> = { title: 'Test Entry' }
    let resolvePromise: (value: any) => void
    
    mockFetch.mockImplementation(() => new Promise(resolve => {
      resolvePromise = resolve
    }))

    const createPromise = composable.createEntry(entryData)
    
    // Check that isSaving is true during the API call
    expect(composable.isSaving.value).toBe(true)
    
    // Resolve the promise
    resolvePromise!({ success: true })
    await createPromise
    
    // Check that isSaving is false after the API call
    expect(composable.isSaving.value).toBe(false)
  })

  it('does not call onSuccess callback when not provided', async () => {
    const entryData: Partial<JournalEntry> = { title: 'Test Entry' }
    mockFetch.mockResolvedValue({ success: true })

    await composable.createEntry(entryData)

    expect(mockFetch).toHaveBeenCalled()
    expect(composable.showModal.value).toBe(false)
  })
}) 