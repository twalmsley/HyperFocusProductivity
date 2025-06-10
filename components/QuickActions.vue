<template>
  <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
    <h2 class="text-lg font-semibold mb-3">Quick Actions</h2>
    <div class="flex flex-wrap gap-3">
      <NuxtLink to="/app/tasks/new"
        class="flex-1 min-w-[120px] bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors">
        New Task
      </NuxtLink>
      <NuxtLink to="/app/tasks"
        class="flex-1 min-w-[120px] border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-4 py-2 rounded-lg text-center transition-colors">
        View Tasks
      </NuxtLink>
      <NuxtLink to="/app/cyclic-tasks/new"
        class="flex-1 min-w-[120px] bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors">
        New Cyclic Task
      </NuxtLink>
      <NuxtLink to="/app/journal/new"
        class="flex-1 min-w-[120px] bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors">
        New Journal Entry
      </NuxtLink>
      
    </div>
  </div>
</template> 