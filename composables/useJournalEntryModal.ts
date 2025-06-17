import { ref } from 'vue'
import type { JournalEntry } from '~/types/journal'

export function useJournalEntryModal() {
  const showModal = ref(false)
  const isSaving = ref(false)

  function openModal() {
    showModal.value = true
  }

  function closeModal() {
    showModal.value = false
  }

  async function createEntry(entryData: Partial<JournalEntry>, onSuccess?: () => void) {
    try {
      isSaving.value = true
      
      await $fetch('/api/journal', {
        method: 'POST',
        body: {
          title: entryData.title,
          content: entryData.content,
          type: entryData.type,
          date: entryData.date,
          mood: entryData.mood,
          tags: entryData.tags,
          templateUsed: entryData.templateUsed
        }
      })
      
      closeModal()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error creating journal entry:', error)
    } finally {
      isSaving.value = false
    }
  }

  return {
    showModal,
    isSaving,
    openModal,
    closeModal,
    createEntry
  }
} 