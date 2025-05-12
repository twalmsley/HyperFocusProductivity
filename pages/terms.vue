<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
    <!-- Terms of Service Header -->
    <section class="bg-[var(--primary-light)] py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-[var(--text-primary)] mb-4">
          Terms of Service
        </h1>
        <p class="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
          Last updated: {{ new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}
        </p>
      </div>
    </section>

    <!-- Terms of Service Content -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p>Please read these Terms of Service ("Terms") carefully before using the FocusHub service. By accessing or using FocusHub, you agree to be bound by these Terms.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">1. Acceptance of Terms</h2>
            
            <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">2. Description of Service</h2>
            
            <p>FocusHub provides a productivity platform that includes task management, time tracking, and focus tools ("Service"). The Service is provided as is and is subject to change without notice.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">3. Account Registration</h2>
            
            <p>To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
            
            <p>You are responsible for safeguarding the password and for all activities that occur under your account. You agree not to disclose your password to any third party and to immediately notify FocusHub of any unauthorized use of your account.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">4. Free Trial and Subscription</h2>
            
            <p>FocusHub offers a 14-day free trial. After the free trial period, continued use of the Service requires a paid subscription. Subscription fees are charged in advance on a monthly basis. You can cancel your subscription at any time, but no refunds will be provided for any unused portion of the current billing period.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">5. User Content</h2>
            
            <p>Our Service allows you to post, store, and share content, including tasks, notes, and other materials ("User Content"). You retain all rights to your User Content, and you are responsible for it.</p>
            
            <p>By posting User Content, you grant FocusHub a license to use, modify, publicly display, reproduce, and distribute such content solely for the purpose of providing and improving the Service.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">6. Prohibited Activities</h2>
            
            <p>You agree not to use the Service:</p>
            <ul class="list-disc pl-6 mb-6">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any material that is defamatory, offensive, or otherwise objectionable</li>
              <li>To impersonate or attempt to impersonate FocusHub, an employee, or any other user</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use of the Service</li>
              <li>To attempt to gain unauthorized access to the Service or systems</li>
              <li>To use any automated means to access the Service</li>
            </ul>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">7. Intellectual Property</h2>
            
            <p>The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of FocusHub and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">8. Termination</h2>
            
            <p>We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">9. Limitation of Liability</h2>
            
            <p>In no event shall FocusHub, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or goodwill, arising out of or in connection with your access to or use of the Service.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">10. Changes to Terms</h2>
            
            <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">11. Contact Us</h2>
            
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p class="mb-6">Email: legal@focushub.com</p>
            <p>Or visit our <NuxtLink to="/contact" class="text-[var(--primary)] hover:underline">Contact Page</NuxtLink>.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Get user state
const user = useState('user')
</script> 