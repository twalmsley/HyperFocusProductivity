<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="col-span-1 md:col-span-2">
          <h2 class="text-2xl font-bold text-primary mb-4">FocusHub</h2>
          <p class="text-muted dark:text-gray-300 mb-4">
            Your personal productivity companion. Stay focused, track progress, and achieve more.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold text-text dark:text-white mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-muted dark:text-gray-300 hover:text-primary transition-colors">Features</a></li>
            <li><a href="#" class="text-muted dark:text-gray-300 hover:text-primary transition-colors">Pricing</a></li>
            <li><a href="#" class="text-muted dark:text-gray-300 hover:text-primary transition-colors">About</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h3 class="text-lg font-semibold text-text dark:text-white mb-4">Legal</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-muted dark:text-gray-300 hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="text-muted dark:text-gray-300 hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" class="text-muted dark:text-gray-300 hover:text-primary transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
        <p class="text-muted dark:text-gray-300">
          © {{ new Date().getFullYear() }} FocusHub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Component logic can be added here
</script> 