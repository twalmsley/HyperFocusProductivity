import { ref } from 'vue'

const lastSessionUpdate = ref(Date.now())

export function usePomodoroEvents() {
  function notifySessionUpdate() {
    lastSessionUpdate.value = Date.now()
  }

  return {
    lastSessionUpdate,
    notifySessionUpdate
  }
} 