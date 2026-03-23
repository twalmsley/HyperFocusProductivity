<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <div v-if="userSession?.blocked">
        <h2 class="text-xl font-semibold mb-4">Subscription no longer active, please update your payment method</h2>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <p class="text-gray-600 mb-4">Manage your subscription and view your current plan details.</p>
          <NuxtLink
            to="/app/subscription"
            class="inline-block px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]"
          >
            My Subscription
          </NuxtLink>
        </div>
      </div>

      <div v-else>
        <div class="flex justify-center items-center mb-8 relative">
          <h1 class="text-3xl font-bold">Reports</h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-3">Available Reports</h2>
            <p class="text-sm text-gray-600 mb-4">Select a report and choose a date range to generate it.</p>

            <div class="space-y-3">
              <button
                v-for="definition in reportDefinitions"
                :key="definition.id"
                type="button"
                class="w-full text-left border rounded-lg p-4 hover:border-[var(--primary)] hover:bg-blue-50 transition-colors"
                @click="openRunModal(definition.id)"
              >
                <p class="font-medium text-gray-900">{{ definition.name }}</p>
                <p class="text-sm text-gray-600">{{ definition.description }}</p>
              </button>
            </div>
          </section>

          <section class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-xl font-semibold">Previous Reports</h2>
              <button
                type="button"
                class="text-sm text-[var(--primary)] hover:text-[var(--button-hover)]"
                @click="fetchReports"
              >
                Refresh
              </button>
            </div>

            <div v-if="isLoadingReports" class="text-center py-8">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)] mx-auto"></div>
            </div>
            <div v-else-if="reports.length === 0" class="text-sm text-gray-500 py-4">
              No reports generated yet.
            </div>
            <div v-else class="space-y-3 max-h-[26rem] overflow-y-auto pr-1">
              <button
                v-for="report in reports"
                :key="report.id"
                type="button"
                class="w-full text-left border rounded-lg p-3 hover:border-[var(--primary)] hover:bg-blue-50 transition-colors"
                @click="openReport(report.id)"
              >
                <p class="font-medium text-gray-900">{{ report.title }}</p>
                <p class="text-xs text-gray-600">
                  Period: {{ formatDate(report.startDate) }} to {{ formatDate(report.endDate) }}
                </p>
                <p class="text-xs text-gray-600">
                  Created: {{ formatDateTime(report.createdAt) }}
                </p>
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>

    <BaseModal :show="showRunModal" @close="closeRunModal">
      <template #header>
        <h3 class="text-lg font-semibold">Run {{ selectedDefinition?.name }}</h3>
      </template>

      <div class="space-y-4">
        <div>
          <label for="report-start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            id="report-start-date"
            v-model="runForm.startDate"
            type="date"
            :max="todayDateString"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          >
        </div>

        <div>
          <label for="report-end-date" class="block text-sm font-medium text-gray-700">End Date</label>
          <input
            id="report-end-date"
            v-model="runForm.endDate"
            type="date"
            :max="todayDateString"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          >
        </div>

        <p v-if="validationMessage" class="text-sm text-red-600">{{ validationMessage }}</p>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            @click="closeRunModal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-md hover:bg-[var(--button-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canRunReport"
            @click="runReport"
          >
            {{ isRunningReport ? 'Running...' : 'Run Report' }}
          </button>
        </div>
      </div>
    </BaseModal>

    <BaseModal :show="showReportModal" @close="closeReportModal">
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ activeReport?.title || 'Report' }}
        </h3>
      </template>

      <div v-if="isLoadingReportDetail" class="text-center py-8">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)] mx-auto"></div>
      </div>
      <div v-else-if="activeReport" class="space-y-3">
        <p class="text-sm text-gray-600">
          Period: {{ formatDate(activeReport.startDate) }} to {{ formatDate(activeReport.endDate) }}
        </p>
        <p class="text-sm text-gray-600">
          Created: {{ formatDateTime(activeReport.createdAt) }}
        </p>

        <div class="border rounded-md overflow-auto max-h-[68vh] max-w-[90vw]">
          <div
            class="prose prose-sm max-w-none p-4 min-w-[40rem]"
            v-html="renderedReportHtml"
          />
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-md hover:bg-[var(--button-hover)]"
            @click="closeReportModal"
          >
            Dismiss
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { marked } from 'marked'
import { subDays } from 'date-fns'
import DOMPurify from 'dompurify'
import BaseModal from '~/components/BaseModal.vue'
import type { ReportDetail, ReportSummary, ReportType } from '~/types/report'

interface ExtendedSession {
  user?: {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
  }
  blocked?: boolean
}

interface ReportDefinition {
  id: ReportType
  name: string
  description: string
}

const { getSession } = useAuth()
const userSession = await getSession() as ExtendedSession

const reportDefinitions: ReportDefinition[] = [
  {
    id: 'ACTIVITY_SUMMARY',
    name: 'Activity Summary Report',
    description: 'Projects, tasks, cyclic tasks, journal activity, and tracker completion summary.',
  },
]

const showRunModal = ref(false)
const showReportModal = ref(false)
const isRunningReport = ref(false)
const isLoadingReports = ref(false)
const isLoadingReportDetail = ref(false)

const reports = ref<ReportSummary[]>([])
const activeReport = ref<ReportDetail | null>(null)
const selectedReportType = ref<ReportType | null>(null)

const today = new Date()
const defaultStartDate = subDays(today, 6)
const todayDateString = formatDateInput(today)

const runForm = ref({
  startDate: formatDateInput(defaultStartDate),
  endDate: formatDateInput(today),
})

marked.setOptions({
  breaks: true,
  gfm: true,
})

const selectedDefinition = computed(() => {
  return reportDefinitions.find((definition) => definition.id === selectedReportType.value) || null
})

const parsedStartDate = computed(() => toLocalDate(runForm.value.startDate))
const parsedEndDate = computed(() => toLocalDate(runForm.value.endDate))

const validationMessage = computed(() => {
  if (!parsedStartDate.value || !parsedEndDate.value) {
    return 'Start date and end date are required.'
  }

  const startDate = parsedStartDate.value
  const endDate = parsedEndDate.value
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  if (endDate < startDate) {
    return 'End date must be greater than or equal to start date.'
  }

  if (endDate > todayStart) {
    return 'End date cannot be later than today.'
  }

  const daysInPeriod = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  if (daysInPeriod > 31) {
    return 'Report period cannot exceed 31 days.'
  }

  return ''
})

const canRunReport = computed(() => {
  return Boolean(selectedReportType.value) && !validationMessage.value && !isRunningReport.value
})

const renderedReportHtml = computed(() => {
  if (!activeReport.value?.markdownContent) return ''
  return DOMPurify.sanitize(marked(activeReport.value.markdownContent) as string)
})

function toLocalDate(dateInput: string): Date | null {
  if (!dateInput) return null
  const parts = dateInput.split('-').map((part) => Number(part))
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return null
  }
  const [year, month, day] = parts
  return new Date(year, month - 1, day)
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(dateValue: string): string {
  return new Date(dateValue).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(dateValue: string): string {
  return new Date(dateValue).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function openRunModal(reportType: ReportType) {
  selectedReportType.value = reportType
  showRunModal.value = true
}

function closeRunModal() {
  showRunModal.value = false
}

function closeReportModal() {
  showReportModal.value = false
  activeReport.value = null
}

async function fetchReports() {
  try {
    isLoadingReports.value = true
    reports.value = await $fetch<ReportSummary[]>('/api/reports')
  } catch (error) {
    console.error('Failed to fetch reports:', error)
  } finally {
    isLoadingReports.value = false
  }
}

async function runReport() {
  if (!canRunReport.value || !selectedReportType.value) {
    return
  }

  try {
    isRunningReport.value = true
    const report = await $fetch<ReportDetail>('/api/reports', {
      method: 'POST',
      body: {
        reportType: selectedReportType.value,
        startDate: runForm.value.startDate,
        endDate: runForm.value.endDate,
      },
    })

    closeRunModal()
    activeReport.value = report
    showReportModal.value = true
    await fetchReports()
  } catch (error) {
    console.error('Failed to run report:', error)
  } finally {
    isRunningReport.value = false
  }
}

async function openReport(reportId: string) {
  try {
    isLoadingReportDetail.value = true
    showReportModal.value = true
    activeReport.value = await $fetch<ReportDetail>(`/api/reports/${reportId}`)
  } catch (error) {
    console.error('Failed to load report:', error)
    closeReportModal()
  } finally {
    isLoadingReportDetail.value = false
  }
}

onMounted(async () => {
  await fetchReports()
})
</script>
