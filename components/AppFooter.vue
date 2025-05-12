<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="col-span-1 md:col-span-2">
          <h2 class="text-2xl font-bold text-[var(--primary)] mb-4">FocusHub</h2>
          <p class="text-[var(--text-secondary)] mb-4">
            Your personal productivity companion. Stay focused, track progress, and achieve more.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/features" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Features</NuxtLink></li>
            <li><NuxtLink to="/pricing" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Pricing</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">About</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Contact Us</NuxtLink></li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-4">Legal</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/privacy" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/cookies" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Cookie Policy</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-200 mt-8 pt-8 text-center">
        <p class="text-[var(--text-secondary)]">
          © {{ new Date().getFullYear() }} FocusHub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Component logic can be added here
</script> 