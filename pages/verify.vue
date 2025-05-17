<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>
      <div v-if="loading" class="text-center">
        <p class="text-gray-600">Verifying your email...</p>
      </div>
      <div v-else-if="error" class="text-center">
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="retryVerification"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
      <div v-else-if="success" class="text-center">
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
const route = useRoute();
const loading = ref(true);
const error = ref('');
const success = ref(false);

const verifyEmail = async () => {
  try {
    const token = route.query.token as string;
    if (!token) {
      throw new Error('No verification token provided');
    }

    const response = await $fetch('/api/auth/verify', {
      method: 'POST',
      body: { token },
    });

    if (response.success) {
      success.value = true;
    } else {
      throw new Error(response.message || 'Failed to verify email');
    }
  } catch (err: any) {
    console.error('Verification error:', err);
    if (err.response?._data?.message) {
      error.value = err.response._data.message;
    } else if (err.message) {
      error.value = err.message;
    } else {
      error.value = 'Failed to verify email. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};

const retryVerification = () => {
  loading.value = true;
  error.value = '';
  verifyEmail();
};

onMounted(() => {
  verifyEmail();
});
</script> 