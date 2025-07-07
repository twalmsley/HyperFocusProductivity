<template>
  <div class="border-t border-gray-200 pt-8">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-medium text-red-900">Delete All Data</h3>
        <p class="text-sm text-gray-600 mt-1">
          Permanently delete all your data and account
        </p>
      </div>
    </div>

    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h4 class="text-sm font-medium text-red-900">Danger Zone</h4>
          <p class="text-xs text-red-700 mt-1">
            This action will permanently delete all your data including tasks, projects, journal entries, and account information. This cannot be undone.
          </p>
        </div>
        <button
          @click="showDeleteModal = true"
          :disabled="isDeleting"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Icon
            v-if="isDeleting"
            name="lucide:loader-2"
            class="animate-spin -ml-1 mr-2 h-4 w-4"
          />
          <Icon
            v-else
            name="lucide:trash-2"
            class="-ml-1 mr-2 h-4 w-4"
          />
          {{ isDeleting ? 'Deleting...' : 'Delete All Data' }}
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showDeleteModal = false"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <Icon
              name="lucide:alert-triangle"
              class="h-6 w-6 text-red-600"
            />
          </div>
          <div class="mt-4 text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Delete All Data
            </h3>
            <p class="text-sm text-gray-600 mb-6">
              This action will permanently delete all your data and cannot be undone. Please confirm that you understand the consequences.
            </p>

            <!-- Confirmation Checkboxes -->
            <div class="space-y-4 text-left">
              <div class="flex items-start">
                <input
                  id="dataDownloaded"
                  v-model="confirmations.dataDownloaded"
                  type="checkbox"
                  class="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label for="dataDownloaded" class="ml-2 text-sm text-gray-700">
                  I have downloaded my data using the export feature above
                </label>
              </div>
              
              <div class="flex items-start">
                <input
                  id="permanentDeletion"
                  v-model="confirmations.permanentDeletion"
                  type="checkbox"
                  class="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label for="permanentDeletion" class="ml-2 text-sm text-gray-700">
                  I understand that this deletion is permanent and cannot be undone
                </label>
              </div>

              <div class="flex items-start">
                <input
                  id="accountDeletion"
                  v-model="confirmations.accountDeletion"
                  type="checkbox"
                  class="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label for="accountDeletion" class="ml-2 text-sm text-gray-700">
                  I want to delete my account and all associated data
                </label>
              </div>
            </div>

            <!-- Final Confirmation -->
            <div class="mt-6">
              <div class="flex items-start">
                <input
                  id="finalConfirmation"
                  v-model="confirmations.finalConfirmation"
                  type="checkbox"
                  class="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label for="finalConfirmation" class="ml-2 text-sm text-gray-700">
                  I confirm that I want to proceed with the deletion
                </label>
              </div>
            </div>

            <!-- Error Message -->
            <div
              v-if="deleteError"
              class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <div class="flex">
                <Icon
                  name="lucide:alert-circle"
                  class="h-5 w-5 text-red-400"
                />
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-800">
                    Deletion failed
                  </p>
                  <p class="text-sm text-red-700 mt-1">
                    {{ deleteError }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showDeleteModal = false"
              :disabled="isDeleting"
              class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              @click="deleteData"
              :disabled="!canDelete || isDeleting"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete All Data' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)

const confirmations = ref({
  dataDownloaded: false,
  permanentDeletion: false,
  accountDeletion: false,
  finalConfirmation: false
})

// Check if all confirmations are checked
const canDelete = computed(() => {
  return Object.values(confirmations.value).every(confirmation => confirmation === true)
})

async function deleteData() {
  if (!canDelete.value) return

  isDeleting.value = true
  deleteError.value = null

  try {
    const response = await $fetch('/api/delete-data', {
      method: 'POST'
    })

    // Redirect to home page after successful deletion
    await navigateTo('/')
    
  } catch (error) {
    console.error('Delete failed:', error)
    deleteError.value = error instanceof Error ? error.message : 'Failed to delete data. Please try again.'
  } finally {
    isDeleting.value = false
  }
}

// Reset confirmations when modal is closed
watch(showDeleteModal, (newValue) => {
  if (!newValue) {
    confirmations.value = {
      dataDownloaded: false,
      permanentDeletion: false,
      accountDeletion: false,
      finalConfirmation: false
    }
    deleteError.value = null
  }
})
</script> 