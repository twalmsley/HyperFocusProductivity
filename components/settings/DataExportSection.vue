<template>
  <div class="border-t border-gray-200 pt-8">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-medium text-gray-900">Data Export</h3>
        <p class="text-sm text-gray-600 mt-1">
          Export all your data to CSV files for backup or analysis
        </p>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h4 class="text-sm font-medium text-gray-900">Export All Data</h4>
          <p class="text-xs text-gray-600 mt-1">
            Download CSV files containing your tasks, projects, sessions, journal entries, and more
          </p>
        </div>
        <button
          @click="exportData"
          :disabled="isExporting"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Icon
            v-if="isExporting"
            name="lucide:loader-2"
            class="animate-spin -ml-1 mr-2 h-4 w-4"
          />
          <Icon
            v-else
            name="lucide:download"
            class="-ml-1 mr-2 h-4 w-4"
          />
          {{ isExporting ? 'Exporting...' : 'Export Data' }}
        </button>
      </div>

      <!-- Export Progress -->
      <div v-if="isExporting" class="mt-4">
        <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Preparing your data...</span>
          <span>{{ exportProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${exportProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="exportSuccess"
        class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md"
      >
        <div class="flex">
          <Icon
            name="lucide:check-circle"
            class="h-5 w-5 text-green-400"
          />
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Export completed successfully!
            </p>
            <p class="text-sm text-green-700 mt-1">
              Your data has been downloaded as CSV files.
            </p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="exportError"
        class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
      >
        <div class="flex">
          <Icon
            name="lucide:alert-circle"
            class="h-5 w-5 text-red-400"
          />
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">
              Export failed
            </p>
            <p class="text-sm text-red-700 mt-1">
              {{ exportError }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Summary -->
    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="text-2xl font-bold text-gray-900">{{ dataSummary.tasks }}</div>
        <div class="text-xs text-gray-600">Tasks</div>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="text-2xl font-bold text-gray-900">{{ dataSummary.projects }}</div>
        <div class="text-xs text-gray-600">Projects</div>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="text-2xl font-bold text-gray-900">{{ dataSummary.sessions }}</div>
        <div class="text-xs text-gray-600">Sessions</div>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="text-2xl font-bold text-gray-900">{{ dataSummary.journalEntries }}</div>
        <div class="text-xs text-gray-600">Journal Entries</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserData } from '~/utils/csvExport'
import { convertToCSV, downloadCSV } from '~/utils/csvExport'

const isExporting = ref(false)
const exportSuccess = ref(false)
const exportError = ref<string | null>(null)
const exportProgress = ref(0)

// Mock data summary - in a real app, you might want to fetch this separately
const dataSummary = ref({
  tasks: 0,
  projects: 0,
  sessions: 0,
  journalEntries: 0
})

async function exportData() {
  isExporting.value = true
  exportSuccess.value = false
  exportError.value = null
  exportProgress.value = 0

  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (exportProgress.value < 90) {
        exportProgress.value += 10
      }
    }, 200)

    // Fetch user data
    const userData = await $fetch<UserData>('/api/export-data')
    
    // Update data summary
    dataSummary.value = {
      tasks: userData.tasks.length,
      projects: userData.projects.length,
      sessions: userData.sessions.length,
      journalEntries: userData.journalEntries.length
    }

    // Convert to CSV files
    const csvFiles = convertToCSV(userData)
    
    // Download each file
    csvFiles.forEach(file => {
      downloadCSV(file.filename, file.content)
    })

    clearInterval(progressInterval)
    exportProgress.value = 100
    
    // Show success message
    exportSuccess.value = true
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      exportSuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('Export failed:', error)
    exportError.value = error instanceof Error ? error.message : 'Failed to export data. Please try again.'
    
    // Hide error message after 5 seconds
    setTimeout(() => {
      exportError.value = null
    }, 5000)
  } finally {
    isExporting.value = false
    exportProgress.value = 0
  }
}
</script> 