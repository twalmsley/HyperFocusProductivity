<template>
  <div class="w-full max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Pomodoro Statistics - last 7 days</h2>
    
    <!-- Weekly Summary -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">Weekly Summary</h3>
      <div class="grid grid-cols-3 gap-6">
        <div>
          <div class="text-sm text-gray-500">Total Focus Time</div>
          <div class="text-2xl font-bold">{{ formatDuration(totalFocusTime) }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Total Break Time</div>
          <div class="text-2xl font-bold">{{ formatDuration(totalBreakTime) }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Total Sessions</div>
          <div class="text-2xl font-bold">{{ totalSessions }}</div>
        </div>
      </div>
    </div>

    <!-- Daily Statistics Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Focus Time</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break Time</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Time</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="day in weeklyStats" :key="day.date" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ formatDate(day.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDuration(day.focusTime) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDuration(day.breakTime) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ day.totalSessions }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDuration(day.focusTime + day.breakTime) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePomodoroEvents } from '../composables/usePomodoroEvents'

interface DailyStats {
  date: string
  focusTime: number
  breakTime: number
  totalSessions: number
}

const weeklyStats = ref<DailyStats[]>([])
const totalFocusTime = ref(0)
const totalBreakTime = ref(0)
const totalSessions = ref(0)

const { lastSessionUpdate } = usePomodoroEvents()

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

async function fetchStats() {
  try {
    const response = await fetch('/api/pomodoro/stats')
    const data = await response.json()
    weeklyStats.value = data.weeklyStats
    totalFocusTime.value = data.totalFocusTime
    totalBreakTime.value = data.totalBreakTime
    totalSessions.value = data.totalSessions
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
  }
}

// Watch for session updates
watch(lastSessionUpdate, () => {
  fetchStats()
})

// Fetch stats on component mount
onMounted(() => {
  fetchStats()
})

// Refresh stats every minute
const refreshInterval = setInterval(fetchStats, 60000)

onUnmounted(() => {
  clearInterval(refreshInterval)
})
</script> 