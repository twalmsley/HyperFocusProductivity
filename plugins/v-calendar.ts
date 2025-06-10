import { defineNuxtPlugin } from '#app'
import { setupCalendar } from 'v-calendar'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(setupCalendar, {})
}) 