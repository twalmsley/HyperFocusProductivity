<template>
  <div 
    class="rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
    :class="{
      'bg-white': !task.project?.color,
      'text-white': task.project?.color && isDarkColor(task.project.color),
      'text-gray-900': task.project?.color && !isDarkColor(task.project.color)
    }"
    :style="task.project?.color ? { backgroundColor: task.project.color } : {}"
  >
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 
            class="text-lg font-medium"
            :class="{
              'text-gray-900': !task.project?.color,
              'text-white': task.project?.color && isDarkColor(task.project.color),
              'text-gray-900': task.project?.color && !isDarkColor(task.project.color)
            }"
          >{{ task.title }}</h3>
          <svg v-if="task.repeatType" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" title="Recurring task"
            :class="{
              'text-blue-500': !task.project?.color,
              'text-white': task.project?.color && isDarkColor(task.project.color),
              'text-blue-600': task.project?.color && !isDarkColor(task.project.color)
            }">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        
        <!-- Project Badge -->
        <div v-if="task.project" class="flex items-center gap-2 mb-2">
          <div 
            v-if="task.project.color" 
            class="w-3 h-3 rounded-full flex-shrink-0 border-2"
            :class="{
              'border-white': isDarkColor(task.project.color),
              'border-gray-900': !isDarkColor(task.project.color)
            }"
            :style="{ backgroundColor: task.project.color }"
          ></div>
          <span 
            class="text-sm"
            :class="{
              'text-gray-600': !task.project?.color,
              'text-white/90': task.project?.color && isDarkColor(task.project.color),
              'text-gray-700': task.project?.color && !isDarkColor(task.project.color)
            }"
          >{{ task.project.name }}</span>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-3">
          <span class="px-2 py-1 text-xs rounded-full" :class="{
            'bg-yellow-100 text-yellow-800': task.status === 'BACKLOG' && !task.project?.color,
            'bg-blue-100 text-blue-800': task.status === 'IN_PROGRESS' && !task.project?.color,
            'bg-green-100 text-green-800': task.status === 'DONE' && !task.project?.color,
            'bg-white/20 text-white': task.project?.color && isDarkColor(task.project.color),
            'bg-gray-100 text-gray-800': task.project?.color && !isDarkColor(task.project.color)
          }">
            {{ task.status.replace('_', ' ') }}
          </span>
          
          <span class="px-2 py-1 text-xs rounded-full font-medium" :class="{
            'bg-red-100 text-red-800': task.priority === 'URGENT' && !task.project?.color,
            'bg-orange-100 text-orange-800': task.priority === 'HIGH' && !task.project?.color,
            'bg-yellow-100 text-yellow-800': task.priority === 'MEDIUM' && !task.project?.color,
            'bg-green-100 text-green-800': task.priority === 'LOW' && !task.project?.color,
            'bg-white/20 text-white': task.project?.color && isDarkColor(task.project.color),
            'bg-gray-100 text-gray-800': task.project?.color && !isDarkColor(task.project.color)
          }">
            {{ task.priority }}
          </span>

          <div v-if="task.estimatedPomodoros" class="px-2 py-1 text-xs rounded-full flex items-center"
            :class="{
              'bg-gray-100 text-gray-800': !task.project?.color,
              'bg-white/20 text-white': task.project?.color && isDarkColor(task.project.color),
              'bg-gray-100 text-gray-800': task.project?.color && !isDarkColor(task.project.color)
            }">
            <span :class="{
              'text-green-600 font-medium': task.completedPomodoros && task.completedPomodoros >= task.estimatedPomodoros && !task.project?.color,
              'text-orange-500': task.completedPomodoros && task.completedPomodoros < task.estimatedPomodoros && !task.project?.color,
              'text-gray-500': !task.completedPomodoros && !task.project?.color,
              'text-white': task.project?.color && isDarkColor(task.project.color),
              'text-green-600 font-medium': task.completedPomodoros && task.completedPomodoros >= task.estimatedPomodoros && task.project?.color && !isDarkColor(task.project.color),
              'text-orange-500': task.completedPomodoros && task.completedPomodoros < task.estimatedPomodoros && task.project?.color && !isDarkColor(task.project.color),
              'text-gray-500': !task.completedPomodoros && task.project?.color && !isDarkColor(task.project.color)
            }">
              {{ task.completedPomodoros || 0 }}
            </span>
            <span 
              class="mx-0.5"
              :class="{
                'text-gray-400': !task.project?.color,
                'text-white/70': task.project?.color && isDarkColor(task.project.color),
                'text-gray-400': task.project?.color && !isDarkColor(task.project.color)
              }"
            >/</span>
            <span 
              :class="{
                'text-gray-500': !task.project?.color,
                'text-white/70': task.project?.color && isDarkColor(task.project.color),
                'text-gray-500': task.project?.color && !isDarkColor(task.project.color)
              }"
            >{{ task.estimatedPomodoros }}</span>
            <span class="ml-1">🍅</span>
          </div>

          <span v-if="task.dueDate" class="px-2 py-1 text-xs rounded-full" :class="{
            'bg-red-100 text-red-800': isTaskOverdue(task) && !task.project?.color,
            'bg-gray-100 text-gray-800': !isTaskOverdue(task) && !task.project?.color,
            'bg-red-500/20 text-white': isTaskOverdue(task) && task.project?.color && isDarkColor(task.project.color),
            'bg-white/20 text-white': !isTaskOverdue(task) && task.project?.color && isDarkColor(task.project.color),
            'bg-red-100 text-red-800': isTaskOverdue(task) && task.project?.color && !isDarkColor(task.project.color),
            'bg-gray-100 text-gray-800': !isTaskOverdue(task) && task.project?.color && !isDarkColor(task.project.color)
          }">
            {{ new Date(task.dueDate).toISOString().slice(0, 10) }}
          </span>
        </div>

        <div 
          v-if="task.notes" 
          class="text-sm line-clamp-2 prose prose-sm max-w-none" 
          :class="{
            'text-gray-600': !task.project?.color,
            'text-white/90': task.project?.color && isDarkColor(task.project.color),
            'text-gray-700': task.project?.color && !isDarkColor(task.project.color)
          }"
          v-html="renderMarkdown(task.notes)"
        ></div>
      </div>

      <div class="flex items-center gap-2 ml-4">
        <button
          v-if="task.status === 'IN_PROGRESS' && (!task.estimatedPomodoros || task.completedPomodoros < task.estimatedPomodoros)"
          @click="$emit('start-pomodoro', task)"
          class="hover:text-[var(--primary)]"
          :class="{
            'text-gray-400': !task.project?.color,
            'text-white/70 hover:text-white': task.project?.color && isDarkColor(task.project.color),
            'text-gray-400': task.project?.color && !isDarkColor(task.project.color)
          }"
          title="Start Pomodoro Timer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button @click="$emit('view', task)" 
          class="hover:text-[var(--primary)]" 
          :class="{
            'text-gray-400': !task.project?.color,
            'text-white/70 hover:text-white': task.project?.color && isDarkColor(task.project.color),
            'text-gray-400': task.project?.color && !isDarkColor(task.project.color)
          }"
          title="View Details">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button @click="$emit('edit', task)" 
          class="hover:text-[var(--primary)]" 
          :class="{
            'text-gray-400': !task.project?.color,
            'text-white/70 hover:text-white': task.project?.color && isDarkColor(task.project.color),
            'text-gray-400': task.project?.color && !isDarkColor(task.project.color)
          }"
          title="Edit Task">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        
        <button @click="handleStatusUpdate(task)" 
          class="hover:text-[var(--primary)]"
          :class="{
            'text-gray-400': !task.project?.color,
            'text-white/70 hover:text-white': task.project?.color && isDarkColor(task.project.color),
            'text-gray-400': task.project?.color && !isDarkColor(task.project.color)
          }"
          :title="task.status === 'BACKLOG' ? 'Start Task' : task.status === 'IN_PROGRESS' ? 'Complete Task' : 'Reopen Task'">
          <svg v-if="task.status === 'BACKLOG'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="task.status === 'IN_PROGRESS'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button @click="$emit('delete', task)" 
          class="hover:text-red-600" 
          :class="{
            'text-gray-400': !task.project?.color,
            'text-white/70 hover:text-red-300': task.project?.color && isDarkColor(task.project.color),
            'text-gray-400': task.project?.color && !isDarkColor(task.project.color)
          }"
          title="Delete Task">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          v-if="task.dueDate"
          @click="$emit('extend-due-date', task)" 
          class="hover:text-[var(--primary)]" 
          :class="{
            'text-gray-400': !task.project?.color,
            'text-white/70 hover:text-white': task.project?.color && isDarkColor(task.project.color),
            'text-gray-400': task.project?.color && !isDarkColor(task.project.color)
          }"
          title="Move to next day">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Status Update Confirmation Dialog -->
  <ConfirmDialog
    :show="showStatusConfirmDialog"
    :title="statusConfirmDialogTitle"
    :message="statusConfirmDialogMessage"
    @confirm="confirmStatusUpdate"
    @cancel="cancelStatusUpdate"
  />
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import { isTaskOverdue } from '~/utils/taskUtils'
import { marked } from 'marked'

// Configure marked options for proper markdown rendering
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true     // Enable GitHub Flavored Markdown
})

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  (e: 'update-status', task: Task): void;
  (e: 'view', task: Task): void;
  (e: 'edit', task: Task): void;
  (e: 'delete', task: Task): void;
  (e: 'start-pomodoro', task: Task): void;
  (e: 'extend-due-date', task: Task): void;
}>();

// Status confirmation dialog state
const showStatusConfirmDialog = ref(false);
const statusConfirmDialogTitle = ref('');
const statusConfirmDialogMessage = ref('');
const taskToUpdate = ref<Task | null>(null);

// Function to determine if a color is dark (for text contrast)
function isDarkColor(color: string): boolean {
  // Remove # if present
  const hex = color.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return true if color is dark (luminance < 0.5)
  return luminance < 0.5
}

function renderMarkdown(content: string): string {
  if (!content) return ''
  return marked(content) as string
}

function handleStatusUpdate(task: Task) {
  taskToUpdate.value = task;
  
  if (task.status === 'BACKLOG') {
    statusConfirmDialogTitle.value = 'Start Task';
    statusConfirmDialogMessage.value = 'Are you sure you want to start this task?';
  } else if (task.status === 'IN_PROGRESS') {
    statusConfirmDialogTitle.value = 'Complete Task';
    statusConfirmDialogMessage.value = 'Are you sure you want to mark this task as completed?';
  } else {
    statusConfirmDialogTitle.value = 'Reopen Task';
    statusConfirmDialogMessage.value = 'Are you sure you want to reopen this task?';
  }
  
  showStatusConfirmDialog.value = true;
}

function confirmStatusUpdate() {
  if (taskToUpdate.value) {
    emit('update-status', taskToUpdate.value);
  }
  showStatusConfirmDialog.value = false;
  taskToUpdate.value = null;
}

function cancelStatusUpdate() {
  showStatusConfirmDialog.value = false;
  taskToUpdate.value = null;
}
</script> 