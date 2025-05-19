export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (error: any) => {
    if (error.statusCode === 403 && error.data?.redirect) {
      navigateTo(error.data.redirect)
    }
  })
}) 