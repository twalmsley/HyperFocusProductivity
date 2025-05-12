<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
    <!-- About Hero Section -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          About FocusHub
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          We're on a mission to help people achieve more by working smarter, not harder.
        </p>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-[var(--text-primary)] mb-8">Our Story</h2>
          
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p>FocusHub was born out of a simple observation: in today's distraction-filled world, maintaining focus is harder than ever. As productivity enthusiasts ourselves, we found that existing tools were either too complex or too simplistic.</p>
            
            <p class="my-6">Founded in 2022, our small team of developers and productivity experts set out to create a solution that balances powerful features with an intuitive, distraction-free interface. We believe that technology should enhance your productivity, not compete for your attention.</p>
            
            <p>What started as a simple Pomodoro timer has evolved into a comprehensive productivity platform that thousands rely on daily to accomplish their most important work.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Mission -->
    <section class="py-20 bg-[var(--primary-light)]">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-[var(--text-primary)] mb-8">Our Mission</h2>
          
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p>At FocusHub, we believe that everyone deserves to work in a state of flow – that magical condition where you're fully immersed in a task, time seems to disappear, and your best work emerges.</p>
            
            <p class="my-6">Our mission is to help 1 million people achieve more focus time and deeper work by 2025. We're not just building software; we're creating a movement around intentional work and digital wellbeing.</p>
            
            <p>Every feature we build is guided by research in cognitive psychology and productivity science. We're committed to making tools that work with your brain, not against it.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">Meet Our Team</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <!-- Team Member 1 -->
          <div class="text-center">
            <div class="w-48 h-48 rounded-full bg-gray-200 mx-auto mb-6"></div>
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-2">Alex Morgan</h3>
            <p class="text-[var(--primary)] mb-4">Founder & CEO</p>
            <p class="text-[var(--text-secondary)]">Former productivity coach with a passion for helping people do their best work.</p>
          </div>
          
          <!-- Team Member 2 -->
          <div class="text-center">
            <div class="w-48 h-48 rounded-full bg-gray-200 mx-auto mb-6"></div>
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-2">Jamie Chen</h3>
            <p class="text-[var(--primary)] mb-4">Lead Developer</p>
            <p class="text-[var(--text-secondary)]">Full-stack engineer with a background in cognitive science and human-computer interaction.</p>
          </div>
          
          <!-- Team Member 3 -->
          <div class="text-center">
            <div class="w-48 h-48 rounded-full bg-gray-200 mx-auto mb-6"></div>
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-2">Sam Reynolds</h3>
            <p class="text-[var(--primary)] mb-4">UX Designer</p>
            <p class="text-[var(--text-secondary)]">Designer focused on creating interfaces that are both beautiful and distraction-free.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-20 bg-[var(--primary-light)]">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">Our Values</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Value 1 -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-3xl mb-4">🎯</div>
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Focus First</h3>
            <p class="text-[var(--text-secondary)]">
              We believe focus is the foundation of all great work. Our tools are designed to enhance concentration, not compete for your attention.
            </p>
          </div>
          
          <!-- Value 2 -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-3xl mb-4">🔍</div>
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Evidence-Based</h3>
            <p class="text-[var(--text-secondary)]">
              We ground our features in cognitive science and productivity research, not fads or trends.
            </p>
          </div>
          
          <!-- Value 3 -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-3xl mb-4">🌱</div>
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Sustainable Productivity</h3>
            <p class="text-[var(--text-secondary)]">
              We promote work habits that lead to long-term success, not burnout. Balance is built into our approach.
            </p>
          </div>
          
          <!-- Value 4 -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-3xl mb-4">🔒</div>
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Privacy-Centered</h3>
            <p class="text-[var(--text-secondary)]">
              We believe your productivity data belongs to you. We're committed to transparency and data minimalism.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-[var(--text-primary)] mb-6">
          Have Questions?
        </h2>
        <p class="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          We'd love to hear from you. Reach out to our team for any questions about our product or company.
        </p>
        <NuxtLink to="/contact">
          <button class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">
            Contact Us
          </button>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Get user state
const user = useState('user')
</script> 