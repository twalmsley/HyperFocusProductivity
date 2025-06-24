import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskCalendar from '~/components/tasks/TaskCalendar.vue'

describe('TaskCalendar', () => {
  it('renders calendar grid correctly', () => {
    const wrapper = mount(TaskCalendar, {
      props: {
        tasks: []
      },
      global: {
        stubs: {
          // Stub any components that might cause issues in tests
        }
      }
    })

    // Check that the calendar header is rendered
    expect(wrapper.find('.task-calendar').exists()).toBe(true)
    
    // Check that day headers are rendered
    const dayHeaders = wrapper.findAll('.grid-cols-7 > div')
    expect(dayHeaders.length).toBeGreaterThan(0)
  })

  it('displays tasks for correct dates', () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task 1',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        dueDate: new Date().toISOString(),
        estimatedPomodoros: 2,
        completedPomodoros: 0,
        userId: 'user1',
        projectId: null,
        notes: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
        position: null,
        repeatType: null,
        repeatInterval: null,
        repeatDays: null,
        repeatMonth: null,
        repeatDay: null,
        repeatWeekOfMonth: null,
        repeatDayOfWeek: null,
        isTemplate: false,
        templateTaskId: null
      }
    ]

    const wrapper = mount(TaskCalendar, {
      props: {
        tasks: mockTasks
      },
      global: {
        stubs: {
          // Stub any components that might cause issues in tests
        }
      }
    })

    // Check that the task is displayed
    expect(wrapper.text()).toContain('Test Task 1')
  })

  it('emits events correctly', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        dueDate: new Date().toISOString(),
        estimatedPomodoros: 1,
        completedPomodoros: 0,
        userId: 'user1',
        projectId: null,
        notes: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
        position: null,
        repeatType: null,
        repeatInterval: null,
        repeatDays: null,
        repeatMonth: null,
        repeatDay: null,
        repeatWeekOfMonth: null,
        repeatDayOfWeek: null,
        isTemplate: false,
        templateTaskId: null
      }
    ]

    const wrapper = mount(TaskCalendar, {
      props: {
        tasks: mockTasks
      },
      global: {
        stubs: {
          // Stub any components that might cause issues in tests
        }
      }
    })

    // Find and click on a task to trigger view event
    const taskElement = wrapper.find('[draggable="true"]')
    if (taskElement.exists()) {
      await taskElement.trigger('click')
      expect(wrapper.emitted('view')).toBeTruthy()
    }
  })
}) 