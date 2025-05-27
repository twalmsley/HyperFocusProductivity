<template>
  <div class="p-4 rounded-lg shadow-sm mb-4 transition-colors duration-300"
    :style="{
      backgroundColor: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
      color: textColor
    }">
    <div class="flex justify-between items-center">
        <div>
            Workload
        </div>
      <div>
        <span class="font-semibold">{{ totalTasks }}</span> tasks
      </div>
      <div>
        <span class="font-semibold">{{ totalPomodoros }}</span> total pomodoros
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Task {
  estimatedPomodoros: number | null;
}

const props = defineProps<{
  tasks: Task[]
}>()

const totalTasks = computed(() => props.tasks.length)

const totalPomodoros = computed(() => {
  return props.tasks.reduce((total, task) => {
    return total + (task.estimatedPomodoros || 0)
  }, 0)
})

const bgColor = computed(() => {
  // Normalize the pomodoro count to a value between 0 and 1
  const normalizedCount = Math.min(totalPomodoros.value, 16) / 16

  // Blue (0, 0, 255) to Red (255, 0, 0)
  return {
    r: Math.round(255 * normalizedCount),
    g: 0,
    b: Math.round(255 * (1 - normalizedCount))
  }
})

// Calculate relative luminance using the sRGB coefficients
const calculateLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

const textColor = computed(() => {
  const luminance = calculateLuminance(bgColor.value.r, bgColor.value.g, bgColor.value.b)
  // Use white text for dark backgrounds (luminance < 0.5) and black text for light backgrounds
  return luminance < 0.5 ? 'white' : 'rgb(17, 24, 39)' // rgb(17, 24, 39) is a dark gray that's easier on the eyes than pure black
})
</script> 