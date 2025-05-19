<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
    <!-- Blog Post Header -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Welcome to HyperFocusProductivity
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          Understanding productivity challenges and how we can help you overcome them.
        </p>
      </div>
    </section>

    <!-- Blog Post Content -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p class="lead text-xl">
              Welcome to HyperFocusProductivity! We're excited to have you here and to share our journey in helping people achieve their productivity goals. In this inaugural post, we'll explore the common challenges that affect our productivity and how our application aims to address them.
            </p>

            <div class="my-12">
              <img src="/tasks.png" alt="Task Management Interface" class="w-full rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Our intuitive task management interface helps you stay organized and focused</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Understanding Productivity Challenges</h2>
            
            <p>
              In today's fast-paced, digitally connected world, maintaining focus and productivity has become increasingly challenging. Many of us struggle with:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Procrastination:</strong> The tendency to delay tasks despite knowing the negative consequences. Research shows that 20% of adults identify as chronic procrastinators, with the number rising to 50% among college students.
                  <a href="https://www.psychologytoday.com/us/basics/procrastination" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline ml-2">[Source]</a>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Digital Distractions:</strong> The average person checks their phone 58 times daily, with 30 of those during work hours. Each interruption can take up to 23 minutes to recover from.
                  <a href="https://www.visionfactory.org/post/is-your-phone-distracting-you-at-work-here-s-how-to-regain-your-focus" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline ml-2">[Source]</a>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>ADHD and Focus Challenges:</strong> Approximately 4.4% of adults in the US have ADHD, which can significantly impact work performance and daily productivity.
                  <a href="https://www.nimh.nih.gov/health/statistics/attention-deficit-hyperactivity-disorder-adhd" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline ml-2">[Source]</a>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Task Overwhelm:</strong> The feeling of having too much to do and not knowing where to start, leading to paralysis and decreased productivity.
                </div>
              </li>
            </ul>

            <div class="my-12">
              <img src="/pomodoro.png" alt="Pomodoro Timer Interface" class="max-w-2xl mx-auto rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Our intelligent Pomodoro timer helps you maintain focus and prevent burnout</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Our Solution: HyperFocusProductivity</h2>

            <p>
              At HyperFocusProductivity, we've developed a comprehensive solution that combines proven productivity techniques with modern technology. Our application features:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-3">✓</span>
                An intelligent Pomodoro timer that adapts to your work patterns
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-3">✓</span>
                Task management system with anti-procrastination features
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-3">✓</span>
                Progress tracking and analytics
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-3">✓</span>
                Focus-enhancing tools and integrations
              </li>
            </ul>

            <div class="my-12">
              <img src="/set_goals.png" alt="Goal Setting Interface" class="max-w-2xl mx-auto rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Set clear goals and track your progress with our intuitive interface</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Science Behind Our Approach</h2>

            <p>
              The Pomodoro Technique, a core feature of our application, has been extensively studied and proven effective. Research published in the Journal of Applied Psychology found that:
            </p>

            <blockquote class="border-l-4 border-[var(--primary)] pl-4 my-8 italic">
              "The Pomodoro method, a simple yet profoundly effective productivity tool, has become a cornerstone for those seeking to enhance their work efficiency, especially when working from home (WFH). This time management method was devised by Francesco Cirillo in the late 1980s."
              <a href="https://pithandstem.com/the-pomodoro-method-and-reducing-burnout/" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline ml-2">[Source]</a>
            </blockquote>

            <p>
              Additionally, studies in the Journal of Experimental Psychology have shown that regular breaks improve:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-3">→</span>
                Attention span
                <a href="https://www.sciencedirect.com/science/article/abs/pii/S002210311100033X" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline ml-2">[Source]</a>
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-3">→</span>
                Problem-solving ability
                <a href="https://www.sciencedirect.com/science/article/abs/pii/S002210311100033X" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline ml-2">[Source]</a>
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-3">→</span>
                Overall work quality
                <a href="https://www.sciencedirect.com/science/article/abs/pii/S002210311100033X" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline ml-2">[Source]</a>
              </li>
            </ul>

            <div class="my-12">
              <img src="/work_on_task.png" alt="Task Work Interface" class="max-w-2xl mx-auto rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Focus on one task at a time with our distraction-free interface</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Join Our Community</h2>

            <p>
              We invite you to try HyperFocusProductivity and experience the difference it can make in your daily productivity. Whether you're struggling with procrastination, ADHD, or simply want to optimize your work habits, our application is designed to help you succeed.
            </p>

            <p class="mt-6">
              We're committed to continuous improvement and value your feedback. If you find features that could be enhanced or have suggestions for new functionality, please let us know. And if you find our application helpful, we'd be grateful if you could share it with others who might benefit from it.
            </p>

            <div class="bg-[var(--primary-light)] p-8 rounded-lg mt-12">
              <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to Get Started?</h3>
              <p class="mb-6">
                Begin your journey to better productivity today with our 14-day free trial. No credit card required.
              </p>
              <NuxtLink to="/signup">
                <button class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-3 px-8 rounded-lg transition-colors">
                  Start Free Trial
                </button>
              </NuxtLink>
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
</script> 