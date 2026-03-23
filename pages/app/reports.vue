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
            <p class="text-sm text-gray-600 mb-4">Select a report and complete any required parameters to generate it.</p>

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
                  Type: {{ getReportTypeLabel(report.reportType) }}
                </p>
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
        <div v-if="requiresProjectSelection">
          <label for="report-project" class="block text-sm font-medium text-gray-700">Project</label>
          <select
            id="report-project"
            v-model="runForm.projectId"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          >
            <option value="" disabled>Select a project</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div v-if="requiresDateRange">
          <label for="report-start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            id="report-start-date"
            v-model="runForm.startDate"
            type="date"
            :max="todayDateString"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          >
        </div>

        <div v-if="requiresDateRange">
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
          Type: {{ getReportTypeLabel(activeReport.reportType) }}
        </p>
        <p class="text-sm text-gray-600">
          Period: {{ formatDate(activeReport.startDate) }} to {{ formatDate(activeReport.endDate) }}
        </p>
        <p class="text-sm text-gray-600">
          Created: {{ formatDateTime(activeReport.createdAt) }}
        </p>

        <div v-if="statePieData || projectPieData" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-if="statePieData"
            class="border rounded-md p-4 bg-gray-50"
          >
            <h4 class="font-medium text-gray-900 mb-3">Task State Distribution</h4>
            <div class="flex items-center gap-6">
              <div
                class="h-28 w-28 rounded-full border border-gray-200"
                :style="statePieStyle"
              />
              <div class="space-y-2 text-sm">
                <p class="flex items-center gap-2">
                  <span class="inline-block h-3 w-3 rounded-sm bg-slate-400" />
                  Planned: {{ statePieData.planned }}
                </p>
                <p class="flex items-center gap-2">
                  <span class="inline-block h-3 w-3 rounded-sm bg-blue-500" />
                  In-progress: {{ statePieData.inProgress }}
                </p>
                <p class="flex items-center gap-2">
                  <span class="inline-block h-3 w-3 rounded-sm bg-emerald-500" />
                  Completed: {{ statePieData.completed }}
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="projectPieData"
            class="border rounded-md p-4 bg-gray-50"
          >
            <h4 class="font-medium text-gray-900 mb-3">Tasks per Project</h4>
            <div class="flex items-start gap-6">
              <div
                class="h-28 w-28 rounded-full border border-gray-200 shrink-0"
                :style="projectPieStyle"
              />
              <div class="space-y-2 text-sm max-h-32 overflow-y-auto pr-1">
                <p
                  v-for="item in projectPieData.items"
                  :key="item.projectName"
                  class="flex items-center gap-2"
                >
                  <span class="inline-block h-3 w-3 rounded-sm" :style="{ backgroundColor: item.color }" />
                  {{ item.projectName }}: {{ item.count }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="trackersActivityData"
          class="border rounded-md p-4 bg-gray-50"
        >
          <h4 class="font-medium text-gray-900 mb-3">Tracker Activity</h4>
          <div class="overflow-x-auto">
            <div :style="{ minWidth: `${trackerActivityMinWidthPx}px` }">
              <div class="flex items-center text-xs text-gray-500 mb-2">
                <div class="w-56 shrink-0" />
                <div
                  class="grid"
                  :style="{
                    gridTemplateColumns: `repeat(${trackersActivityDates.length}, minmax(0, 1fr))`,
                    gap: trackerGridGapPx
                  }"
                >
                  <span v-for="day in trackersActivityDates" :key="day.key" class="text-center text-[10px]">
                    {{ day.showLabel ? day.label : '' }}
                  </span>
                </div>
              </div>

              <div class="space-y-2">
                <div
                  v-for="stat in trackersActivityData"
                  :key="stat.trackerName"
                  class="flex items-center"
                >
                  <div class="w-56 pr-3">
                    <p class="text-sm font-medium text-gray-900">{{ stat.trackerName }}</p>
                    <p class="text-xs text-gray-600">
                      {{ stat.percentage }}% ({{ stat.completedDays }}/{{ stat.totalDays }} days)
                    </p>
                    <div
                      class="h-2 rounded mt-1"
                      :style="{ backgroundColor: getProgressBandColor(stat.percentage) }"
                    />
                  </div>
                  <div
                    class="grid flex-1"
                    :style="{
                      gridTemplateColumns: `repeat(${trackersActivityDates.length}, minmax(0, 1fr))`,
                      gap: trackerGridGapPx
                    }"
                  >
                    <div
                      v-for="day in trackersActivityDates"
                      :key="`${stat.trackerName}-${day.key}`"
                      class="rounded-sm"
                      :class="getActivityCellClass(stat, day.key)"
                      :style="{ width: `${trackerCellSizePx}px`, height: `${trackerCellSizePx}px` }"
                      :title="`${stat.trackerName} - ${day.key}`"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
import type { Project } from '~/types/project'

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
  {
    id: 'DETAILED_PROJECT',
    name: 'Detailed Project Report',
    description: 'Detailed list of all tasks for one selected project, grouped by state.',
  },
  {
    id: 'DETAILED_ALL_PROJECTS',
    name: 'Detailed All Projects Tasks Report',
    description: 'Detailed project task breakdown across all projects for a selected date range.',
  },
  {
    id: 'TRACKERS_ACTIVITY',
    name: 'Trackers Activity Report',
    description: 'GitHub-style activity chart and completion statistics for each tracker.',
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
const projects = ref<Project[]>([])

const today = new Date()
const defaultStartDate = subDays(today, 6)
const todayDateString = formatDateInput(today)

const runForm = ref({
  startDate: formatDateInput(defaultStartDate),
  endDate: formatDateInput(today),
  projectId: '',
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

const requiresProjectSelection = computed(() => selectedReportType.value === 'DETAILED_PROJECT')
const requiresDateRange = computed(() => selectedReportType.value !== 'DETAILED_PROJECT')
const maxDaysForSelectedReport = computed(() => selectedReportType.value === 'TRACKERS_ACTIVITY' ? 90 : 31)

const validationMessage = computed(() => {
  if (requiresProjectSelection.value && !runForm.value.projectId) {
    return 'Project selection is required for detailed project report.'
  }

  if (!requiresDateRange.value) {
    return ''
  }

  if (!parsedStartDate.value || !parsedEndDate.value) {
    return 'Start date and end date are required for this report.'
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
  if (daysInPeriod > maxDaysForSelectedReport.value) {
    return `Report period cannot exceed ${maxDaysForSelectedReport.value} days.`
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

interface TrackerActivityStat {
  trackerName: string
  completedDays: number
  totalDays: number
  percentage: number
  completedDateSet: Set<string>
}

const trackersActivityData = computed(() => {
  if (activeReport.value?.reportType !== 'TRACKERS_ACTIVITY' || !activeReport.value.markdownContent) {
    return null
  }

  const stats: TrackerActivityStat[] = []
  const regex = /- Tracker stats: (.+)\|(\d+)\|(\d+)\|(\d+)\|([^\n]*)/g
  let match: RegExpExecArray | null = regex.exec(activeReport.value.markdownContent)
  while (match) {
    const completedDateSet = new Set(
      match[5]
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0),
    )
    stats.push({
      trackerName: match[1],
      completedDays: Number(match[2]),
      totalDays: Number(match[3]),
      percentage: Number(match[4]),
      completedDateSet,
    })
    match = regex.exec(activeReport.value.markdownContent)
  }

  return stats
})

const trackersActivityDates = computed(() => {
  if (!activeReport.value || activeReport.value.reportType !== 'TRACKERS_ACTIVITY') {
    return []
  }
  const start = new Date(activeReport.value.startDate)
  const end = new Date(activeReport.value.endDate)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  const dates: Array<{ key: string; label: string; showLabel: boolean }> = []
  const cursor = new Date(start)
  let index = 0
  while (cursor <= end) {
    const key = formatDateInput(cursor)
    const isMonthBoundary = cursor.getDate() === 1
    const isWeeklyTick = index % 7 === 0
    dates.push({
      key,
      label: `${cursor.getDate()}`,
      showLabel: isMonthBoundary || isWeeklyTick,
    })
    cursor.setDate(cursor.getDate() + 1)
    index += 1
  }
  return dates
})

const trackerCellSizePx = computed(() => trackersActivityDates.value.length > 62 ? 8 : 12)
const trackerGridGapPx = computed(() => `${trackersActivityDates.value.length > 62 ? 2 : 4}px`)
const trackerActivityMinWidthPx = computed(() => {
  const chartWidth = trackersActivityDates.value.length * (trackerCellSizePx.value + Number.parseInt(trackerGridGapPx.value, 10))
  return Math.max(768, chartWidth + 260)
})

const statePieData = computed(() => {
  if (!activeReport.value || !['DETAILED_PROJECT', 'DETAILED_ALL_PROJECTS'].includes(activeReport.value.reportType)) {
    return null
  }
  if (!activeReport.value.markdownContent) {
    return null
  }

  const planned = Number(activeReport.value.markdownContent.match(/- Planned tasks: (\d+)/)?.[1] || 0)
  const inProgress = Number(activeReport.value.markdownContent.match(/- In-progress tasks: (\d+)/)?.[1] || 0)
  const completed = Number(activeReport.value.markdownContent.match(/- Completed tasks: (\d+)/)?.[1] || 0)
  const total = planned + inProgress + completed

  if (total === 0) {
    return null
  }

  return {
    planned,
    inProgress,
    completed,
    total,
  }
})

const detailedProjectPieStyle = computed(() => {
  const data = statePieData.value
  if (!data) {
    return {}
  }

  const plannedPct = (data.planned / data.total) * 100
  const inProgressPct = (data.inProgress / data.total) * 100
  const completedPct = (data.completed / data.total) * 100

  return {
    background: `conic-gradient(#94a3b8 0% ${plannedPct}%, #3b82f6 ${plannedPct}% ${plannedPct + inProgressPct}%, #10b981 ${plannedPct + inProgressPct}% ${plannedPct + inProgressPct + completedPct}%)`,
  }
})

const projectPiePalette = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16', '#f97316']

const projectPieData = computed(() => {
  if (activeReport.value?.reportType !== 'DETAILED_ALL_PROJECTS' || !activeReport.value.markdownContent) {
    return null
  }

  const projectCounts: Array<{ projectName: string; count: number }> = []
  const regex = /- Project tasks: (.+) = (\d+)/g
  let match: RegExpExecArray | null = regex.exec(activeReport.value.markdownContent)
  while (match) {
    projectCounts.push({
      projectName: match[1],
      count: Number(match[2]),
    })
    match = regex.exec(activeReport.value.markdownContent)
  }

  const total = projectCounts.reduce((sum, item) => sum + item.count, 0)
  if (total === 0) {
    return null
  }

  return {
    items: projectCounts.map((item, index) => ({
      ...item,
      color: projectPiePalette[index % projectPiePalette.length],
    })),
    total,
  }
})

const projectPieStyle = computed(() => {
  const data = projectPieData.value
  if (!data) {
    return {}
  }

  let current = 0
  const segments = data.items.map((item) => {
    const start = current
    current += (item.count / data.total) * 100
    return `${item.color} ${start}% ${current}%`
  })

  return {
    background: `conic-gradient(${segments.join(', ')})`,
  }
})

const statePieStyle = detailedProjectPieStyle

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

function getReportTypeLabel(reportType: ReportType): string {
  if (reportType === 'DETAILED_PROJECT') return 'Detailed Project'
  if (reportType === 'DETAILED_ALL_PROJECTS') return 'Detailed All Projects'
  if (reportType === 'TRACKERS_ACTIVITY') return 'Trackers Activity'
  return 'Activity Summary'
}

function getProgressBandColor(percentage: number): string {
  const clamped = Math.max(0, Math.min(100, percentage))
  const band = Math.floor(clamped / 5) * 5
  const hue = (band / 100) * 120
  return `hsl(${hue}, 85%, 45%)`
}

function getActivityCellClass(stat: TrackerActivityStat, dayKey: string): string {
  return stat.completedDateSet.has(dayKey) ? 'bg-emerald-500' : 'bg-gray-200'
}

function openRunModal(reportType: ReportType) {
  selectedReportType.value = reportType
  runForm.value.projectId = ''
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

async function fetchProjects() {
  try {
    projects.value = await $fetch<Project[]>('/api/projects')
  } catch (error) {
    console.error('Failed to fetch projects for reports:', error)
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
        ...(requiresDateRange.value
          ? {
            startDate: runForm.value.startDate,
            endDate: runForm.value.endDate,
          }
          : {}),
        ...(requiresProjectSelection.value
          ? {
            projectId: runForm.value.projectId,
          }
          : {}),
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
  await Promise.all([fetchReports(), fetchProjects()])
})
</script>
