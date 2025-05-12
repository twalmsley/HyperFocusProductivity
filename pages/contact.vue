<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
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
              
              <form class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
                  <input type="text" id="name" name="name" v-model="contactForm.name" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent" required />
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
                  <input type="email" id="email" name="email" v-model="contactForm.email" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent" required />
                </div>
                
                <div>
                  <label for="subject" class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Subject</label>
                  <select id="subject" name="subject" v-model="contactForm.subject" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent" required>
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
                  <textarea id="message" name="message" v-model="contactForm.message" rows="6" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent" required></textarea>
                </div>
                
                <div>
                  <button type="submit" @click.prevent="submitContactForm" class="w-full bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-3 px-4 rounded-lg transition-colors">
                    Send Message
                  </button>
                </div>
              </form>
              
              <!-- Success message -->
              <div v-if="formSubmitted" class="mt-6 p-4 bg-green-100 text-green-700 rounded-md">
                Thank you for your message! We'll get back to you as soon as possible.
              </div>
            </div>
            
            <!-- Contact Information -->
            <div>
              <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-6">Contact Information</h2>
              
              <div class="space-y-8">
                <div>
                  <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2">Email</h3>
                  <p class="text-[var(--text-secondary)]">
                    <a href="mailto:support@focushub.com" class="text-[var(--primary)] hover:underline">support@focushub.com</a>
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
                    123 Productivity Street<br>
                    London, UK<br>
                    EC1A 1BB
                  </p>
                </div>
                
                <div>
                  <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2">Follow Us</h3>
                  <div class="flex space-x-4 mt-2">
                    <a href="#" class="text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors">
                      <span class="sr-only">Twitter</span>
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                    <a href="#" class="text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors">
                      <span class="sr-only">LinkedIn</span>
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                      </svg>
                    </a>
                    <a href="#" class="text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors">
                      <span class="sr-only">GitHub</span>
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                      </svg>
                    </a>
                  </div>
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
                <p class="text-[var(--text-secondary)]">We aim to respond to all inquiries within 24 hours during business days. For urgent support issues, premium subscribers receive priority assistance.</p>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="text-lg font-bold text-[var(--text-primary)] mb-2">Do you offer phone support?</h3>
                <p class="text-[var(--text-secondary)]">Currently, we provide support via email and the contact form. Premium subscribers have access to live chat support during business hours.</p>
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
// Get user state
const user = useState('user')

// Contact form state
const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Form submission state
const formSubmitted = ref(false)

// Form submission handler
function submitContactForm() {
  // Here you would typically send the form data to your backend
  // For now, we'll just simulate a successful submission
  
  // Reset form after "submission"
  setTimeout(() => {
    formSubmitted.value = true
    
    // Reset form
    contactForm.name = ''
    contactForm.email = ''
    contactForm.subject = ''
    contactForm.message = ''
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      formSubmitted.value = false
    }, 5000)
  }, 500)
}
</script> 