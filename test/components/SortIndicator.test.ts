import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SortIndicator from '~/components/SortIndicator.vue'

describe('SortIndicator', () => {
  it('renders correctly when active and ascending', () => {
    const wrapper = mount(SortIndicator, {
      props: {
        active: true,
        direction: 'asc'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('path').attributes('d')).toBe('M5 15l5-5 5 5H5z')
    expect(wrapper.classes()).toContain('inline-flex')
  })

  it('renders correctly when active and descending', () => {
    const wrapper = mount(SortIndicator, {
      props: {
        active: true,
        direction: 'desc'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('path').attributes('d')).toBe('M5 5l5 5 5-5H5z')
  })

  it('does not render svg when not active', () => {
    const wrapper = mount(SortIndicator, {
      props: {
        active: false,
        direction: 'asc'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(SortIndicator, {
      props: {
        active: true,
        direction: 'asc'
      }
    })

    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('ml-1')
    expect(wrapper.find('svg').classes()).toContain('w-3')
    expect(wrapper.find('svg').classes()).toContain('h-3')
  })

  it('accepts valid direction props', () => {
    const wrapper = mount(SortIndicator, {
      props: {
        active: true,
        direction: 'asc'
      }
    })

    expect(wrapper.props('direction')).toBe('asc')
    
    const wrapperDesc = mount(SortIndicator, {
      props: {
        active: true,
        direction: 'desc'
      }
    })

    expect(wrapperDesc.props('direction')).toBe('desc')
  })
}) 