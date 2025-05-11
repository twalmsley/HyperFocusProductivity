<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-primary">FocusHub</h1>
        </div>

        <!-- Navigation -->
        <div class="hidden md:flex space-x-8">
          <a href="#" class="text-text dark:text-white hover:text-primary transition-colors">Features</a>
          <a href="#" class="text-text dark:text-white hover:text-primary transition-colors">Pricing</a>
          <a href="#" class="text-text dark:text-white hover:text-primary transition-colors">About</a>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <button class="text-text dark:text-white hover:text-primary transition-colors">Login</button>
          <button class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
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