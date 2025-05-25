<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
  <AppNavHeader v-if="status === 'authenticated'" />
    <!-- Cookie Policy Header -->
    <section class="bg-[var(--primary-light)] py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-[var(--text-primary)] mb-4">
          Cookie Policy
        </h1>
        <p class="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
          Last updated: {{ new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}
        </p>
      </div>
    </section>

    <!-- Cookie Policy Content -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p>This Cookie Policy explains how the HyperFocusProductivity App ("we", "us", or "our") uses cookies and similar technologies to recognize and remember you when you visit our website and use our services.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">What are Cookies?</h2>
            
            <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.</p>
            
            <p>Cookies allow a website to recognize your device and remember information about your visit, such as your preferred language, login information, and other settings.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">How We Use Cookies</h2>
            
            <p>We use cookies for several purposes, including:</p>
            <ul class="list-disc pl-6 mb-6">
              <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.</li>
              <li><strong>Preference Cookies:</strong> These cookies enable us to remember information that changes the way the website behaves or looks, such as your preferred language or the region you are in.</li>
              <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve the website's functionality and user experience.</li>
              <li><strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites. They are set to display targeted advertisements based on your interests and online behavior.</li>
              <li><strong>Functionality Cookies:</strong> These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.</li>
            </ul>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Types of Cookies We Use</h2>
            
            <p><strong>Session Cookies</strong> are temporary cookies that are erased when you close your browser. They are used to store temporary information, such as your login status.</p>
            
            <p><strong>Persistent Cookies</strong> remain on your device for a specified period or until you delete them manually. They are used to remember your preferences and settings when you revisit the website.</p>
            
            <p><strong>First-party Cookies</strong> are set by the website you are visiting. Only this website can read them.</p>
            
            <p><strong>Third-party Cookies</strong> are set by a domain other than the one you are visiting. These are commonly used for analytics, marketing, and advertising purposes.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Managing Your Cookie Preferences</h2>
            
            <p>Most web browsers allow you to control cookies through their settings. You can typically delete existing cookies, block certain types of cookies, or set your browser to notify you when cookies are being set. However, if you disable or delete certain cookies, some features of our website may not function properly.</p>
            
            <p>Here's how to manage cookies in common web browsers:</p>
            <ul class="list-disc pl-6 mb-6">
              <li><strong>Chrome:</strong> Settings > Privacy and security > Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options > Privacy & Security > Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences > Privacy > Cookies and website data</li>
              <li><strong>Edge:</strong> Settings > Cookies and site permissions > Cookies and site data</li>
            </ul>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Changes to Our Cookie Policy</h2>
            
            <p>We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page with an updated revision date.</p>
            
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Contact Us</h2>
            
            <p>If you have any questions about our Cookie Policy, please visit our <NuxtLink to="/contact" class="text-[var(--primary)] hover:underline">Contact Page</NuxtLink>.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const {
  status,
  data,
  lastRefreshedAt,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  signOut
} = useAuth()

definePageMeta({
  auth: false
})

// Get user state
const user = useState('user')
</script> 