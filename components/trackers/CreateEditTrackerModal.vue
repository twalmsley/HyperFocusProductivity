<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot></slot>
  </BaseModal>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script> 