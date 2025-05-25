<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>
      <div v-if="status === 'verifying'" class="text-center">
        <p class="text-gray-600">Verifying your email...</p>
      </div>
      <div v-else-if="status === 'error'" class="text-center">
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="retryVerification"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
      <div v-else-if="status === 'success'" class="text-center">
        <p class="text-green-600">Email verified successfully!</p>
        <NuxtLink
          to="/login"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go to Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const {
  status,
  data,
  lastRefreshedAt,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  signOut
} = useAuth()

definePageMeta({
  auth: false
})

const route = useRoute();
const token = computed(() => route.query.token as string);

const error = ref('');


onMounted(async () => {
  await verifyToken();
});

async function verifyToken() {
  if (!token.value) {
    error.value = 'Verification token is missing';
    return;
  }

  try {
    const response = await $fetch('/api/auth/verify', {
      method: 'POST',
      body: { token: token.value },
      headers: {
      }
    });

    if (response.success) {
    } else {
      error.value = 'Verification failed';
    }
  } catch (e: any) {
    error.value = e.response?._data?.message || 'An error occurred during verification';
  }
}

const retryVerification = () => {
  error.value = '';
  verifyToken();
};
</script> 