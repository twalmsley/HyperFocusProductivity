<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Weekly Stats</h2>
    
    <!-- Weekly Summary -->
    <div class="bg-gray-50 rounded-lg p-4 mb-4">
      <div class="grid grid-cols-1 gap-3">
        <div>
          <div class="text-sm text-gray-500">Total Focus Time</div>
          <div class="text-xl font-bold">{{ formatDuration(totalFocusTime) }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Total Break Time</div>
          <div class="text-xl font-bold">{{ formatDuration(totalBreakTime) }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Total Sessions</div>
          <div class="text-xl font-bold">{{ totalSessions }}</div>
        </div>
      </div>
    </div>

    <!-- Daily Statistics Table -->
    <div class="overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Focus</th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="day in weeklyStats" :key="day.date" class="hover:bg-gray-50">
            <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
              {{ formatDate(day.date) }}
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
              {{ formatDuration(day.focusTime) }}
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
              {{ day.totalSessions }}
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