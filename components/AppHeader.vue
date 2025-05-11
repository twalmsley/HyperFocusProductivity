<template>
  <header class="bg-[var(--nav-background)] shadow-sm">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-[var(--primary)]">FocusHub</h1>
        </div>

        <!-- Navigation -->
        <div class="hidden md:flex space-x-8">
          <a href="#" class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors">Features</a>
          <a href="#" class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors">Pricing</a>
          <a href="#" class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors">About</a>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <button class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors">Login</button>
          <button class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// Component logic can be added here
</script> 