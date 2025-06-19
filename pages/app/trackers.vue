<template>
  <AppNavHeader />
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">Trackers</h1>
      <button
        @click="openCreateTrackerModal"
        class="bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary)] hover:opacity-90 transition-colors"
      >
        Create Tracker
      </button>
    </div>

    <!-- Date Navigation -->
    <div class="flex items-center justify-between mb-6">
      <button
        @click="navigateDateRange(30)"
        class="p-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
        :disabled="isAtNewestDate"
        :class="{ 'opacity-50 cursor-not-allowed': isAtNewestDate }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Newer Dates</span>
      </button>
      <div class="text-lg font-medium">
        {{ formatDateRange }}
      </div>
      <button
        @click="navigateDateRange(-30)"
        class="p-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
      >
        <span>Older Dates</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="trackers.length === 0" class="text-center py-12 text-gray-500">
      No trackers found. Create your first one!
    </div>

    <!-- Tracker Groups -->
    <div v-else class="space-y-6">
      <div v-for="group in groupedTrackers" :key="group.name" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold">{{ group.name }}</h2>
          <div class="flex items-center space-x-4">
            <button
              @click="openCreateTrackerModal(group.name)"
              class="text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
              title="Add new tracker to this group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button 
              @click="toggleGroup(group.name)"
              class="text-gray-500 hover:text-gray-700 transition-colors"
              :title="isGroupExpanded(group.name) ? 'Collapse group' : 'Expand group'"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6 transform transition-transform duration-200"
                :class="{ 'rotate-180': isGroupExpanded(group.name) }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div v-show="isGroupExpanded(group.name)" class="divide-y divide-gray-200">
            <div v-for="tracker in group.trackers" :key="tracker.id" class="p-4">
              <div class="flex items-center gap-4">
                <h3 class="text-lg font-medium w-48">{{ tracker.name }}</h3>
                <div class="flex-1">
                  <div class="grid grid-cols-30 gap-1">
                    <div
                      v-for="day in 30"
                      :key="day"
                      class="aspect-square rounded cursor-pointer hover:ring-2 hover:ring-[var(--primary)] transition-all relative"
                      :style="getCellStyle(tracker, day)"
                      @click="openValueModal(tracker, day)"
                      :title="getDateTooltip(day)"
                    >
                      <div 
                        class="absolute inset-0 flex items-center justify-center text-xs font-medium"
                        :class="getTextColorClass(tracker, day)"
                      >
                        {{ getTrackerValue(tracker, day) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="editTracker(tracker)"
                    class="text-gray-600 hover:text-[var(--primary)] relative group"
                  >
                    <span class="sr-only">Edit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Edit Tracker
                    </span>
                  </button>
                  <button
                    @click="deleteTracker(tracker)"
                    class="text-gray-600 hover:text-red-600 relative group"
                  >
                    <span class="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Delete Tracker
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Create/Edit Tracker Modal -->
    <CreateEditTrackerModal :show="showCreateTrackerModal" @close="showCreateTrackerModal = false">
      <template #header>
        <h3 class="text-lg font-medium">{{ editingTracker ? 'Edit Tracker' : 'Create Tracker' }}</h3>
      </template>
      <form @submit.prevent="saveTracker" class="space-y-4">
        <div>
          <label for="groupName" class="block text-sm font-medium text-gray-700">Group Name</label>
          <input
            id="groupName"
            v-model="trackerForm.groupName"
            type="text"
            list="groupNames"
            maxlength="200"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <datalist id="groupNames">
            <option v-for="group in groupNames" :key="group" :value="group" />
          </datalist>
        </div>
        <div>
          <label for="trackerName" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            maxlength="200"
            id="trackerName"
            v-model="trackerForm.name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            required
          />
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="showCreateTrackerModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-md hover:bg-[var(--button-hover)]"
          >
            {{ editingTracker ? 'Save' : 'Create' }}
          </button>
        </div>
      </form>
    </CreateEditTrackerModal>

    <!-- Value Selection Modal -->
    <ValueSelectionModal :show="showValueModal" @close="showValueModal = false">
      <template #header>
        <h3 class="text-lg font-medium">Set Value</h3>
      </template>
      <div class="space-y-4">
        <div>
          <label for="value" class="block text-sm font-medium text-gray-700">Value (0-100)</label>
          <input
            type="range"
            id="value"
            v-model.number="valueForm.value"
            min="0"
            max="100"
            step="5"
            class="mt-1 block w-full"
          />
          <div class="text-center mt-2">{{ valueForm.value }}%</div>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="setValueAndSave(100)"
            class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-md hover:bg-[var(--button-hover)]"
          >
            100%
          </button>
          <button
            type="button"
            @click="showValueModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveValue"
            class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-md hover:bg-[var(--button-hover)]"
          >
            Save
          </button>
        </div>
      </div>
    </ValueSelectionModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format, addDays, subDays } from 'date-fns'
import BaseModal from '~/components/BaseModal.vue'
import CreateEditTrackerModal from '~/components/trackers/CreateEditTrackerModal.vue'
import ValueSelectionModal from '~/components/trackers/ValueSelectionModal.vue'

interface Tracker {
  id: string
  name: string
  groupName: string
  entries: TrackerEntry[]
}

interface TrackerEntry {
  id: string
  date: Date
  value: number
}

const trackers = ref<Tracker[]>([])
const startDate = ref(subDays(new Date(), 29))
const showCreateTrackerModal = ref(false)
const showValueModal = ref(false)
const editingTracker = ref<Tracker | null>(null)
const selectedTracker = ref<Tracker | null>(null)
const selectedDay = ref(0)
const isLoading = ref(true)
const groupNames = ref<string[]>([])

// Add state for expanded groups with localStorage persistence
const expandedGroups = ref(new Set<string>())

const trackerForm = ref({
  name: '',
  groupName: ''
})

const valueForm = ref({
  value: 0
})

// Load expanded groups from localStorage
const loadExpandedGroups = () => {
  try {
    const savedGroups = localStorage.getItem('trackersExpandedGroups')
    if (savedGroups) {
      expandedGroups.value = new Set(JSON.parse(savedGroups))
    }
  } catch (error) {
    console.error('Error loading expanded groups from localStorage:', error)
  }
}

// Save expanded groups to localStorage
const saveExpandedGroups = () => {
  try {
    localStorage.setItem('trackersExpandedGroups', JSON.stringify([...expandedGroups.value]))
  } catch (error) {
    console.error('Error saving expanded groups to localStorage:', error)
  }
}

// Group trackers by groupName
const groupedTrackers = computed(() => {
  const groups = {}
  trackers.value.forEach(tracker => {
    if (!groups[tracker.groupName]) {
      groups[tracker.groupName] = {
        name: tracker.groupName,
        trackers: []
      }
    }
    groups[tracker.groupName].trackers.push(tracker)
  })

  // Sort trackers within each group by name
  Object.values(groups).forEach(group => {
    group.trackers.sort((a, b) => a.name.localeCompare(b.name))
  })

  // Sort groups alphabetically by name
  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))
})

const formatDateRange = computed(() => {
  const endDate = addDays(startDate.value, 29)
  return `${format(endDate, 'MMM d, yyyy')} - ${format(startDate.value, 'MMM d, yyyy')}`
})

const isAtNewestDate = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endDate = addDays(startDate.value, 29)
  return endDate >= today
})

const navigateDateRange = (days: number) => {
  // For positive days, we're moving forward in time (newer dates)
  // For negative days, we're moving backward in time (older dates)
  const newStartDate = addDays(startDate.value, days)
  const newEndDate = addDays(newStartDate, 29)
  
  // Don't allow navigating past today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (newEndDate > today) {
    // If we would go past today, adjust to show the most recent 30 days
    startDate.value = subDays(today, 29)
  } else {
    startDate.value = newStartDate
  }
  
  fetchTrackers()
}

const getCellStyle = (tracker: Tracker, day: number) => {
  const date = addDays(startDate.value, 30 - day)
  const entry = tracker.entries.find(e => 
    format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  )
  
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  
  if (!entry) return { 
    backgroundColor: isToday ? '#fff3e0' : '#f3f4f6',
    border: isToday ? '2px solid #f97316' : 'none'
  }
  
  // Calculate the fill percentage (0-100)
  const fillPercentage = entry.value
  
  return {
    background: `linear-gradient(to top, rgb(234, 88, 12) ${fillPercentage}%, ${isToday ? '#fff3e0' : '#f3f4f6'} ${fillPercentage}%)`,
    border: isToday ? '2px solid #f97316' : 'none'
  }
}

const editTracker = (tracker: Tracker) => {
  editingTracker.value = tracker
  trackerForm.value.name = tracker.name
  trackerForm.value.groupName = tracker.groupName
  showCreateTrackerModal.value = true
}

const deleteTracker = async (tracker: Tracker) => {
  if (!confirm('Are you sure you want to delete this tracker?')) return
  
  try {
    await $fetch(`/api/trackers/${tracker.id}`, {
      method: 'DELETE'
    })
    await fetchTrackers()
  } catch (error) {
    console.error('Failed to delete tracker:', error)
  }
}

const openValueModal = (tracker: Tracker, day: number) => {
  selectedTracker.value = tracker
  selectedDay.value = day
  const date = addDays(startDate.value, 30 - day)
  const entry = tracker.entries.find(e => 
    format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  )
  valueForm.value.value = entry?.value || 0
  showValueModal.value = true
}

// Open create modal with group name
const openCreateTrackerModal = (groupName?: string) => {
  editingTracker.value = null
  trackerForm.value = {
    name: '',
    groupName: groupName || ''
  }
  showCreateTrackerModal.value = true
}

const saveTracker = async () => {
  try {
    if (editingTracker.value) {
      await $fetch(`/api/trackers/${editingTracker.value.id}`, {
        method: 'PUT',
        body: trackerForm.value
      })
    } else {
      await $fetch('/api/trackers', {
        method: 'POST',
        body: trackerForm.value
      })
    }
    showCreateTrackerModal.value = false
    editingTracker.value = null
    trackerForm.value = { name: '', groupName: '' }
    await fetchTrackers()
  } catch (error) {
    console.error('Failed to save tracker:', error)
  }
}

const saveValue = async () => {
  if (!selectedTracker.value) return
  
  try {
    const date = addDays(startDate.value, 30 - selectedDay.value)
    await $fetch('/api/tracker-entries', {
      method: 'POST',
      body: {
        trackerId: selectedTracker.value.id,
        date: format(date, 'yyyy-MM-dd'),
        value: Number(valueForm.value.value)
      }
    })
    showValueModal.value = false
    await fetchTrackers()
  } catch (error: any) {
    console.error('Failed to save value:', error)
    if (error.statusCode === 401) {
      navigateTo('/login')
    } else {
      alert('Failed to save value. Please try again.')
    }
  }
}

const setValueAndSave = async (value: number) => {
  valueForm.value.value = value
  await saveValue()
}

// Fetch existing group names
const fetchGroupNames = async () => {
  try {
    const response = await fetch('/api/trackers/groups')
    if (!response.ok) throw new Error('Failed to fetch group names')
    groupNames.value = await response.json()
  } catch (error) {
    console.error('Error fetching group names:', error)
  }
}

const fetchTrackers = async () => {
  try {
    const start = format(startDate.value, 'yyyy-MM-dd')
    const end = format(addDays(startDate.value, 29), 'yyyy-MM-dd')
    const response = await $fetch(`/api/trackers?start=${start}&end=${end}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    trackers.value = response
  } catch (error: any) {
    console.error('Failed to fetch trackers:', error)
    if (error.statusCode === 401) {
      // Redirect to login if unauthorized
      navigateTo('/login')
    } else {
      // Show error message to user
      alert('Failed to fetch trackers. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

const getTrackerValue = (tracker: Tracker, day: number) => {
  const date = addDays(startDate.value, 30 - day)
  const entry = tracker.entries.find(e => 
    format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  )
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  return entry?.value || (isToday ? 'Today' : '')
}

const getTextColorClass = (tracker: Tracker, day: number) => {
  const date = addDays(startDate.value, 30 - day)
  const entry = tracker.entries.find(e => 
    format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  )
  if (!entry) return 'text-gray-400'
  return entry.value > 50 ? 'text-white' : 'text-gray-700'
}

const getDateTooltip = (day: number) => {
  const date = addDays(startDate.value, 30 - day)
  return format(date, 'MMMM d, yyyy')
}

// Toggle group expansion
const toggleGroup = (groupName: string) => {
  if (expandedGroups.value.has(groupName)) {
    expandedGroups.value.delete(groupName)
  } else {
    expandedGroups.value.add(groupName)
  }
  saveExpandedGroups()
}

// Check if group is expanded
const isGroupExpanded = (groupName: string) => {
  return expandedGroups.value.has(groupName)
}

// Initial fetch
onMounted(async () => {
  await fetchTrackers()
  await fetchGroupNames()
  loadExpandedGroups()
})
</script>

<style scoped>
.grid-cols-30 {
  grid-template-columns: repeat(30, minmax(0, 1fr));
}

/* Remove delay for tracker cell tooltips */
.grid-cols-30 > div {
  pointer-events: auto;
}
.grid-cols-30 > div[title] {
  position: relative;
}
.grid-cols-30 > div[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 50;
  margin-bottom: 4px;
}
</style> 