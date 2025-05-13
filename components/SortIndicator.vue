<template>
  <span class="inline-flex ml-1">
    <svg 
      v-if="active" 
      class="w-3 h-3" 
      fill="currentColor" 
      viewBox="0 0 20 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path v-if="direction === 'asc'" d="M5 15l5-5 5 5H5z"></path>
      <path v-else d="M5 5l5 5 5-5H5z"></path>
    </svg>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean;
  direction: 'asc' | 'desc';
}>();
</script> 