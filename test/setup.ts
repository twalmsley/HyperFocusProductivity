import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000'
    }
  }),
  useNuxtApp: () => ({
    $fetch: vi.fn(),
    $auth: {
      signIn: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn()
    }
  })
}))

// Mock Nuxt utilities
vi.mock('#imports', () => ({
  definePageMeta: vi.fn(),
  navigateTo: vi.fn(),
  useRoute: () => ({
    path: '/',
    query: {},
    params: {}
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  })
}))

// Global test configuration
config.global.stubs = {
  'NuxtLink': true,
  'NuxtImg': true,
  'NuxtIcon': true
}

// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}) 