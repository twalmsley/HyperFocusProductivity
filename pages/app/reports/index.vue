<template>
  <AppNavHeader />
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-center items-center mb-8">
      <h1 class="text-3xl font-bold">Reports</h1>
    </div>

    <!-- Available Reports -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Available Reports</h2>
      <div class="space-y-2">
        <button
          @click="showDatePicker = true"
          class="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-[var(--primary)] transition-colors flex items-center justify-between"
        >
          <div>
            <span class="font-medium">Activity Report</span>
            <p class="text-sm text-gray-500 mt-1">
              Summary of tasks, cyclic tasks, journal entries, and tracker activity for a selected period.
            </p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          @click="showProjectSelect = true"
          class="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-[var(--primary)] transition-colors flex items-center justify-between"
        >
          <div>
            <span class="font-medium">Detailed Project Report</span>
            <p class="text-sm text-gray-500 mt-1">
              Detailed breakdown of all tasks in a project, grouped by status with a visual overview chart.
            </p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Previous Reports -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold mb-4">Previous Reports</h2>

      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
      </div>

      <div v-else-if="reports.length === 0" class="text-center py-8 text-gray-500">
        No reports generated yet. Select a report type above to get started.
      </div>

      <div v-else class="divide-y divide-gray-200">
        <button
          v-for="report in reports"
          :key="report.id"
          @click="viewReport(report.id)"
          class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
        >
          <div>
            <span class="font-medium">{{ report.title }}</span>
            <p class="text-sm text-gray-500 mt-1">
              Generated {{ formatCreatedAt(report.createdAt) }}
            </p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Date Picker Modal -->
    <ReportDatePickerModal
      :show="showDatePicker"
      @cancel="showDatePicker = false"
      @run="handleRunActivityReport"
    />

    <!-- Project Select Modal -->
    <ProjectSelectModal
      :show="showProjectSelect"
      @cancel="showProjectSelect = false"
      @run="handleRunProjectReport"
    />

    <!-- Report Viewer Modal -->
    <ReportViewerModal
      :show="showViewer"
      :title="viewerTitle"
      :markdown="viewerMarkdown"
      @dismiss="showViewer = false"
    />

    <!-- Generating Overlay -->
    <div v-if="isGenerating" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)] mb-4"></div>
        <p class="text-gray-700">Generating report...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import ReportDatePickerModal from '~/components/reports/ReportDatePickerModal.vue'
import ProjectSelectModal from '~/components/reports/ProjectSelectModal.vue'
import ReportViewerModal from '~/components/reports/ReportViewerModal.vue'

interface ReportSummary {
  id: string
  reportType: string
  title: string
  startDate: string
  endDate: string
  createdAt: string
}

interface ReportFull {
  id: string
  reportType: string
  title: string
  markdown: string
  startDate: string
  endDate: string
  createdAt: string
}

const reports = ref<ReportSummary[]>([])
const isLoading = ref(true)
const isGenerating = ref(false)
const showDatePicker = ref(false)
const showProjectSelect = ref(false)
const showViewer = ref(false)
const viewerTitle = ref('')
const viewerMarkdown = ref('')

function formatCreatedAt(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy \'at\' h:mm a')
}

async function fetchReports() {
  try {
    reports.value = await $fetch<ReportSummary[]>('/api/reports')
  } catch (error: any) {
    console.error('Failed to fetch reports:', error)
    if (error.statusCode === 401) {
      navigateTo('/login')
    }
  } finally {
    isLoading.value = false
  }
}

function showGeneratedReport(report: ReportFull) {
  reports.value.unshift({
    id: report.id,
    reportType: report.reportType,
    title: report.title,
    startDate: report.startDate,
    endDate: report.endDate,
    createdAt: report.createdAt
  })
  viewerTitle.value = report.title
  viewerMarkdown.value = report.markdown
  showViewer.value = true
}

async function handleRunActivityReport(payload: { startDate: string; endDate: string }) {
  showDatePicker.value = false
  isGenerating.value = true

  try {
    const report = await $fetch<ReportFull>('/api/reports/generate', {
      method: 'POST',
      body: {
        reportType: 'activity',
        startDate: payload.startDate,
        endDate: payload.endDate
      }
    })
    showGeneratedReport(report)
  } catch (error: any) {
    console.error('Failed to generate report:', error)
    alert(error.data?.message || 'Failed to generate report. Please try again.')
  } finally {
    isGenerating.value = false
  }
}

async function handleRunProjectReport(payload: { projectId: string }) {
  showProjectSelect.value = false
  isGenerating.value = true

  try {
    const report = await $fetch<ReportFull>('/api/reports/generate', {
      method: 'POST',
      body: {
        reportType: 'detailed-project',
        projectId: payload.projectId
      }
    })
    showGeneratedReport(report)
  } catch (error: any) {
    console.error('Failed to generate report:', error)
    alert(error.data?.message || 'Failed to generate report. Please try again.')
  } finally {
    isGenerating.value = false
  }
}

async function viewReport(id: string) {
  isGenerating.value = true
  try {
    const report = await $fetch<ReportFull>(`/api/reports/${id}`)
    viewerTitle.value = report.title
    viewerMarkdown.value = report.markdown
    showViewer.value = true
  } catch (error: any) {
    console.error('Failed to fetch report:', error)
    alert('Failed to load report. Please try again.')
  } finally {
    isGenerating.value = false
  }
}

onMounted(() => {
  fetchReports()
})
</script>
