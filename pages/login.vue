<template>
  <div class="min-h-screen bg-[var(--background)]">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-md mx-auto bg-[var(--card-background)] rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-6">Login to Your Existing Account, Or Sign Up for a New Account</h1>

        <button v-for="provider in providers" :key="provider?.id" @click="signIn(provider?.id)"
          class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-3 px-8 rounded-lg transition-colors">
          Sign in with {{ provider?.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' }
})

const { signIn, getProviders } = useAuth()
const providers = await getProviders()

</script>