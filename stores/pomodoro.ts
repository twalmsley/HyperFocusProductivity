import { defineStore } from 'pinia'

export const usePomodoroStore = defineStore('pomodoro', {
  state: () => ({
    lastSessionUpdate: Date.now()
  }),
  actions: {
    notifySessionUpdate() {
      this.lastSessionUpdate = Date.now()
    }
  }
}) 