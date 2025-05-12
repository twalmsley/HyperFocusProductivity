<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
    <!-- Privacy Policy Header -->
    <section class="bg-[var(--primary-light)] py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-[var(--text-primary)] mb-4">
          Privacy Policy
        </h1>
        <p class="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
          Last updated: {{ new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}
        </p>
      </div>
    </section>

    <!-- Privacy Policy Content -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p>At HyperFocusProductivity, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Information We Collect</h2>
            
            <p>We collect information that you provide directly to us when you:</p>
            <ul class="list-disc pl-6 mb-6">
              <li>Create an account</li>
              <li>Use our services</li>
              <li>Contact customer support</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            
            <p>This information may include:</p>
            <ul class="list-disc pl-6 mb-6">
              <li>Name and email address</li>
              <li>Username and password</li>
              <li>Profile information</li>
              <li>Payment information (processed securely through our payment processors)</li>
              <li>Task and productivity data</li>
              <li>Communication preferences</li>
            </ul>
            
            <p>We also automatically collect certain information when you use our service, including:</p>
            <ul class="list-disc pl-6 mb-6">
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Device information</li>
              <li>Usage patterns and statistics</li>
              <li>Cookies and similar technologies</li>
            </ul>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">How We Use Your Information</h2>
            
            <p>We use the information we collect to:</p>
            <ul class="list-disc pl-6 mb-6">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and maintain your account</li>
              <li>Process transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
              <li>Monitor and analyze usage trends</li>
              <li>Protect against, identify, and prevent fraud and other illegal activity</li>
            </ul>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Sharing Your Information</h2>
            
            <p>We do not sell your personal information to third parties. We may share your information with:</p>
            <ul class="list-disc pl-6 mb-6">
              <li>Service providers who perform services on our behalf</li>
              <li>Partners with whom we offer co-branded services or promotions</li>
              <li>Legal authorities when required by law or to protect rights and safety</li>
            </ul>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Your Rights and Choices</h2>
            
            <p>You have several rights regarding your personal information:</p>
            <ul class="list-disc pl-6 mb-6">
              <li>Access and update your information through your account settings</li>
              <li>Request deletion of your data (subject to certain exceptions)</li>
              <li>Opt out of marketing communications</li>
              <li>Set browser cookies preferences</li>
            </ul>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Data Security</h2>
            
            <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Children's Privacy</h2>
            
            <p>Our service is not directed to children under 16. We do not knowingly collect personal information from children under 16. If you believe we have inadvertently collected information from a child under 16, please contact us immediately.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Changes to This Privacy Policy</h2>
            
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Contact Us</h2>
            
            <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
            <p class="mb-6">Email: privacy@hyperfocusproductivity.com</p>
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