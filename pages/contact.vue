<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
  <AppNavHeader v-if="status === 'authenticated'" />
    <!-- Contact Header -->
    <section class="bg-[var(--primary-light)] py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-[var(--text-primary)] mb-4">
          Contact Us
        </h1>
        <p class="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
          Have questions, feedback, or need support? We're here to help.
        </p>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Contact Form -->
            <div class="bg-white p-8 rounded-lg shadow-md">
              <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-6">Send us a message</h2>
              
              <form class="space-y-6" @submit.prevent="handleSubmit">
                <div>
                  <label for="name" class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
                  <input type="text" id="name" name="name" maxlength="200" v-model="form.name" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent" required />
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
                  <input type="email" id="email" name="email" v-model="form.email" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent" required />
                </div>
                
                <div>
                  <label for="subject" class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Subject</label>
                  <select id="subject" name="subject" v-model="form.subject" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent" required>
                    <option value="" disabled>Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Questions</option>
                    <option value="feedback">Feedback/Suggestions</option>
                    <option value="partnership">Partnership Opportunities</option>
                  </select>
                </div>
                
                <div>
                  <label for="message" class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Message</label>
                  <textarea id="message" name="message" maxlength="2000" v-model="form.message" rows="6" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent" required></textarea>
                </div>
                
                <div>
                  <button 
                    type="submit" 
                    :disabled="loading"
                    class="w-full bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="loading">Sending...</span>
                    <span v-else>Send Message</span>
                  </button>
                </div>
              </form>
              
              <!-- Success message -->
              <div v-if="success" class="mt-6 p-4 bg-green-100 text-green-700 rounded-md">
                Thank you for your message! We'll get back to you as soon as possible.
              </div>

              <!-- Error message -->
              <div v-if="error" class="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
                {{ error }}
              </div>
            </div>
            
            <!-- Contact Information -->
            <div>
              <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-6">Contact Information</h2>
              
              <div class="space-y-8">
                <div>
                  <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2">Email</h3>
                  <p class="text-[var(--text-secondary)]">
                    <a href="mailto:tony@aosd.co.uk" class="text-[var(--primary)] hover:underline">tony@aosd.co.uk</a>
                  </p>
                  <p class="text-sm text-[var(--text-secondary)] mt-1">For general inquiries and support</p>
                </div>
                
                <div>
                  <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2">Office Hours</h3>
                  <p class="text-[var(--text-secondary)]">Monday - Friday: 9am - 5pm GMT</p>
                  <p class="text-sm text-[var(--text-secondary)] mt-1">We typically respond to emails within 24 hours during business days</p>
                </div>
                
                <div>
                  <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2">Headquarters</h3>
                  <p class="text-[var(--text-secondary)]">
                    AOSD Ltd<br>
                    Swindon, UK<br>
                  </p>
                </div>
                
              </div>
            </div>
          </div>
          
          <!-- FAQ Section -->
          <div class="mt-16">
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-8">Frequently Asked Questions</h2>
            
            <div class="space-y-6">
              <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="text-lg font-bold text-[var(--text-primary)] mb-2">What's your typical response time?</h3>
                <p class="text-[var(--text-secondary)]">We aim to respond to all inquiries within 24 hours during business days. For urgent support issues, advanced and premium subscribers receive priority assistance.</p>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="text-lg font-bold text-[var(--text-primary)] mb-2">Do you offer phone support?</h3>
                <p class="text-[var(--text-secondary)]">Currently, we provide support via email and the contact form.</p>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="text-lg font-bold text-[var(--text-primary)] mb-2">Can I request a feature?</h3>
                <p class="text-[var(--text-secondary)]">Absolutely! We love hearing from our users. Please use the contact form and select "Feedback/Suggestions" as the subject to share your ideas with our product team.</p>
              </div>
            </div>
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

// Form state
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Feedback states
const loading = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

// Fetch CSRF token on component mount
onMounted(async () => {
})

async function handleSubmit() {
  loading.value = true
  error.value = null
  success.value = false
  
  // Client-side validation
  if (!form.value.name.trim()) {
    error.value = 'Name is required'
    loading.value = false
    return
  }
  
  if (!form.value.email.trim()) {
    error.value = 'Email is required'
    loading.value = false
    return
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    error.value = 'Please enter a valid email address'
    loading.value = false
    return
  }
  
  if (!form.value.message.trim()) {
    error.value = 'Message is required'
    loading.value = false
    return
  }
  
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    })
    
    // Reset form on success
    form.value.name = ''
    form.value.email = ''
    form.value.subject = ''
    form.value.message = ''
    
    success.value = true
  } catch (e: any) {
    console.error('Error submitting contact form:', e)
    error.value = e.data?.message || 'An error occurred while sending your message. Please try again.'
  } finally {
    loading.value = false
  }
}
</script> 