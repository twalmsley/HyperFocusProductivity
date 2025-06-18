# Testing Guide

This project uses **Vitest** as the primary testing framework, which is the official testing framework for Nuxt 3 applications. The testing setup includes support for Vue components, composables, and utility functions.

## Testing Framework

- **Vitest**: Fast unit testing framework with TypeScript support
- **@vue/test-utils**: Vue component testing utilities
- **jsdom**: DOM environment for browser-like testing
- **@vitest/ui**: Visual test runner interface

## Test Scripts

```bash
# Run tests in watch mode (default)
yarn test

# Run tests with UI interface
yarn test:ui

# Run tests once (for CI/CD)
yarn test:run

# Run tests with coverage report
yarn test:coverage

# Run tests in watch mode
yarn test:watch
```

## Test Structure

```
test/
├── setup.ts                    # Global test configuration
├── components/                 # Vue component tests
│   └── SortIndicator.test.ts
├── composables/               # Vue composable tests
│   └── useJournalEntryModal.test.ts
└── utils/                     # Utility function tests
    └── dateUtils.test.ts
```

## Writing Tests

### Component Tests

Test Vue components using `@vue/test-utils`:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '~/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' }
    })
    
    expect(wrapper.text()).toContain('Test')
  })
})
```

### Composable Tests

Test Vue composables by calling them directly:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { useMyComposable } from '~/composables/useMyComposable'

describe('useMyComposable', () => {
  it('initializes with correct state', () => {
    const composable = useMyComposable()
    expect(composable.count.value).toBe(0)
  })
})
```

### Utility Function Tests

Test pure functions with standard assertions:

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from '~/utils/dateUtils'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toBe('2024-01-15')
  })
})
```

## Mocking

### Nuxt Composables

The test setup automatically mocks common Nuxt composables:

```typescript
// These are automatically mocked in test/setup.ts
useRuntimeConfig()
useNuxtApp()
useRoute()
useRouter()
```

### API Calls

Mock `$fetch` for API testing:

```typescript
import { vi } from 'vitest'

vi.mocked(global.$fetch).mockResolvedValue({
  data: 'mocked response'
})
```

### Vue Components

Stub Nuxt-specific components:

```typescript
const wrapper = mount(MyComponent, {
  global: {
    stubs: {
      'NuxtLink': true,
      'NuxtImg': true
    }
  }
})
```

## Test Conventions

1. **File Naming**: Use `.test.ts` or `.spec.ts` suffix
2. **Test Organization**: Group related tests with `describe` blocks
3. **Test Names**: Use descriptive names that explain the expected behavior
4. **Assertions**: Use specific assertions that test the actual behavior
5. **Setup/Teardown**: Use `beforeEach` and `afterEach` for test isolation

## Coverage

Run coverage reports to identify untested code:

```bash
yarn test:coverage
```

This will generate a coverage report showing:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **Keep Tests Simple**: Each test should verify one specific behavior
3. **Use Descriptive Names**: Test names should clearly describe what is being tested
4. **Mock External Dependencies**: Don't test third-party libraries or external APIs
5. **Test Edge Cases**: Include tests for error conditions and boundary values
6. **Maintain Test Data**: Use factories or fixtures for consistent test data

## Integration with Build Process

Tests are integrated into the build process. You can add test execution to your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Run tests
  run: yarn test:run
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure to use the `~` alias for imports from the project root
2. **Component Not Found**: Ensure components are properly imported and stubbed if needed
3. **Async Test Failures**: Use `await` for async operations and consider using `flushPromises()`
4. **Mock Not Working**: Check that mocks are set up before the code under test runs

### Debugging

Use the UI interface for debugging:

```bash
yarn test:ui
```

This provides a visual interface where you can:
- See test results in real-time
- Debug individual tests
- View test coverage
- Filter and search tests 