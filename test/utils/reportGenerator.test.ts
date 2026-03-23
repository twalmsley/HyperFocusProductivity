import { describe, it, expect } from 'vitest'
import { generateActivityReport, generateDetailedProjectReport, generatePieChartSvg } from '~/server/utils/reportGenerator'
import type { ReportData, DetailedProjectReportData, DetailedProjectTask, PieSlice } from '~/server/utils/reportGenerator'

function createEmptyReportData(overrides: Partial<ReportData> = {}): ReportData {
  return {
    startDate: new Date(2026, 2, 1),
    endDate: new Date(2026, 2, 31),
    projectTasks: [],
    nonProjectTasks: [],
    cyclicTasks: [],
    journalEntries: [],
    trackers: [],
    ...overrides
  }
}

describe('generateActivityReport', () => {
  it('generates a report with the correct title and period', () => {
    const data = createEmptyReportData()
    const result = generateActivityReport(data)

    expect(result).toContain('# Activity Report')
    expect(result).toContain('March 1, 2026')
    expect(result).toContain('March 31, 2026')
  })

  it('shows empty messages when no data is present', () => {
    const data = createEmptyReportData()
    const result = generateActivityReport(data)

    expect(result).toContain('No project tasks completed during this period.')
    expect(result).toContain('No non-project tasks completed during this period.')
    expect(result).toContain('No cyclic tasks completed during this period.')
    expect(result).toContain('No journal entries during this period.')
    expect(result).toContain('No tracker activity during this period.')
  })

  describe('Project Tasks Summary', () => {
    it('groups tasks by project and sorts projects alphabetically', () => {
      const data = createEmptyReportData({
        projectTasks: [
          { title: 'Task B1', completedAt: '2026-03-10', projectName: 'Zebra Project' },
          { title: 'Task A1', completedAt: '2026-03-05', projectName: 'Alpha Project' },
          { title: 'Task A2', completedAt: '2026-03-15', projectName: 'Alpha Project' }
        ]
      })
      const result = generateActivityReport(data)

      const alphaIdx = result.indexOf('### Alpha Project')
      const zebraIdx = result.indexOf('### Zebra Project')
      expect(alphaIdx).toBeGreaterThan(-1)
      expect(zebraIdx).toBeGreaterThan(-1)
      expect(alphaIdx).toBeLessThan(zebraIdx)
    })

    it('sorts tasks within a project by completion date', () => {
      const data = createEmptyReportData({
        projectTasks: [
          { title: 'Late Task', completedAt: '2026-03-20', projectName: 'My Project' },
          { title: 'Early Task', completedAt: '2026-03-05', projectName: 'My Project' },
          { title: 'Mid Task', completedAt: '2026-03-10', projectName: 'My Project' }
        ]
      })
      const result = generateActivityReport(data)

      const earlyIdx = result.indexOf('Early Task')
      const midIdx = result.indexOf('Mid Task')
      const lateIdx = result.indexOf('Late Task')
      expect(earlyIdx).toBeLessThan(midIdx)
      expect(midIdx).toBeLessThan(lateIdx)
    })

    it('displays task title and completion date in table format', () => {
      const data = createEmptyReportData({
        projectTasks: [
          { title: 'Fix Login Bug', completedAt: '2026-03-15', projectName: 'Web App' }
        ]
      })
      const result = generateActivityReport(data)

      expect(result).toContain('| Fix Login Bug | 2026-03-15 |')
    })
  })

  describe('Non-project Tasks Summary', () => {
    it('sorts tasks by completion date', () => {
      const data = createEmptyReportData({
        nonProjectTasks: [
          { title: 'Third', completedAt: '2026-03-20' },
          { title: 'First', completedAt: '2026-03-01' },
          { title: 'Second', completedAt: '2026-03-10' }
        ]
      })
      const result = generateActivityReport(data)

      const firstIdx = result.indexOf('| First |')
      const secondIdx = result.indexOf('| Second |')
      const thirdIdx = result.indexOf('| Third |')
      expect(firstIdx).toBeLessThan(secondIdx)
      expect(secondIdx).toBeLessThan(thirdIdx)
    })

    it('displays task title and completion date', () => {
      const data = createEmptyReportData({
        nonProjectTasks: [
          { title: 'Clean Desk', completedAt: '2026-03-05' }
        ]
      })
      const result = generateActivityReport(data)

      expect(result).toContain('| Clean Desk | 2026-03-05 |')
    })
  })

  describe('Cyclic Tasks Summary', () => {
    it('sorts cyclic tasks by completion date', () => {
      const data = createEmptyReportData({
        cyclicTasks: [
          { title: 'Evening Review', completedAt: '2026-03-15' },
          { title: 'Morning Standup', completedAt: '2026-03-01' }
        ]
      })
      const result = generateActivityReport(data)

      const morningIdx = result.indexOf('| Morning Standup |')
      const eveningIdx = result.indexOf('| Evening Review |')
      expect(morningIdx).toBeLessThan(eveningIdx)
    })

    it('displays cyclic task name and completion date', () => {
      const data = createEmptyReportData({
        cyclicTasks: [
          { title: 'Weekly Review', completedAt: '2026-03-07' }
        ]
      })
      const result = generateActivityReport(data)

      expect(result).toContain('| Weekly Review | 2026-03-07 |')
    })
  })

  describe('Journal Summary', () => {
    it('sorts journal entries by date', () => {
      const data = createEmptyReportData({
        journalEntries: [
          { title: 'Late Entry', date: '2026-03-25' },
          { title: 'Early Entry', date: '2026-03-02' }
        ]
      })
      const result = generateActivityReport(data)

      const earlyIdx = result.indexOf('| Early Entry |')
      const lateIdx = result.indexOf('| Late Entry |')
      expect(earlyIdx).toBeLessThan(lateIdx)
    })

    it('displays journal title and date', () => {
      const data = createEmptyReportData({
        journalEntries: [
          { title: 'Productive Day', date: '2026-03-12' }
        ]
      })
      const result = generateActivityReport(data)

      expect(result).toContain('| Productive Day | 2026-03-12 |')
    })
  })

  describe('Trackers Summary', () => {
    it('shows tracker name and completion summary', () => {
      const data = createEmptyReportData({
        trackers: [
          {
            name: 'Exercise',
            completionDates: ['2026-03-01', '2026-03-03', '2026-03-05'],
            totalDaysInPeriod: 31
          }
        ]
      })
      const result = generateActivityReport(data)

      expect(result).toContain('### Exercise')
      expect(result).toContain('**3 completed out of 31 days**')
    })

    it('lists completion dates sorted chronologically', () => {
      const data = createEmptyReportData({
        trackers: [
          {
            name: 'Meditation',
            completionDates: ['2026-03-15', '2026-03-02', '2026-03-10'],
            totalDaysInPeriod: 31
          }
        ]
      })
      const result = generateActivityReport(data)

      expect(result).toContain('2026-03-02, 2026-03-10, 2026-03-15')
    })

    it('handles tracker with no completions gracefully', () => {
      const data = createEmptyReportData({
        trackers: []
      })
      const result = generateActivityReport(data)

      expect(result).toContain('No tracker activity during this period.')
    })

    it('handles multiple trackers', () => {
      const data = createEmptyReportData({
        trackers: [
          {
            name: 'Reading',
            completionDates: ['2026-03-01'],
            totalDaysInPeriod: 31
          },
          {
            name: 'Exercise',
            completionDates: ['2026-03-01', '2026-03-02'],
            totalDaysInPeriod: 31
          }
        ]
      })
      const result = generateActivityReport(data)

      expect(result).toContain('### Reading')
      expect(result).toContain('**1 completed out of 31 days**')
      expect(result).toContain('### Exercise')
      expect(result).toContain('**2 completed out of 31 days**')
    })
  })

  describe('Full report with all sections', () => {
    it('generates a complete report with all sections populated', () => {
      const data: ReportData = {
        startDate: new Date(2026, 2, 1),
        endDate: new Date(2026, 2, 31),
        projectTasks: [
          { title: 'API Endpoint', completedAt: '2026-03-10', projectName: 'Backend' },
          { title: 'Login Form', completedAt: '2026-03-05', projectName: 'Frontend' }
        ],
        nonProjectTasks: [
          { title: 'Organise Desktop', completedAt: '2026-03-08' }
        ],
        cyclicTasks: [
          { title: 'Daily Standup', completedAt: '2026-03-01' }
        ],
        journalEntries: [
          { title: 'Week 1 Reflection', date: '2026-03-07' }
        ],
        trackers: [
          {
            name: 'Water Intake',
            completionDates: ['2026-03-01', '2026-03-02', '2026-03-03'],
            totalDaysInPeriod: 31
          }
        ]
      }

      const result = generateActivityReport(data)

      expect(result).toContain('## Project Tasks Summary')
      expect(result).toContain('### Backend')
      expect(result).toContain('### Frontend')
      expect(result).toContain('## Non-project Tasks Summary')
      expect(result).toContain('| Organise Desktop |')
      expect(result).toContain('## Cyclic Tasks Summary')
      expect(result).toContain('| Daily Standup |')
      expect(result).toContain('## Journal Summary')
      expect(result).toContain('| Week 1 Reflection |')
      expect(result).toContain('## Trackers Summary')
      expect(result).toContain('### Water Intake')
    })
  })

  describe('Edge cases', () => {
    it('handles single-day period', () => {
      const data = createEmptyReportData({
        startDate: new Date(2026, 2, 15),
        endDate: new Date(2026, 2, 15)
      })
      const result = generateActivityReport(data)

      expect(result).toContain('March 15, 2026')
    })

    it('handles tasks with Date objects instead of strings', () => {
      const data = createEmptyReportData({
        nonProjectTasks: [
          { title: 'Date Object Task', completedAt: new Date('2026-03-10T14:30:00Z') }
        ]
      })
      const result = generateActivityReport(data)

      expect(result).toContain('| Date Object Task | 2026-03-10 |')
    })
  })
})

describe('generatePieChartSvg', () => {
  it('returns a message when total is 0', () => {
    const slices: PieSlice[] = [
      { label: 'A', count: 0, color: '#000' },
      { label: 'B', count: 0, color: '#fff' }
    ]
    const result = generatePieChartSvg(slices)
    expect(result).toContain('No tasks to display in chart')
  })

  it('generates SVG with a circle when one slice is 100%', () => {
    const slices: PieSlice[] = [
      { label: 'Completed', count: 5, color: '#10B981' },
      { label: 'Planned', count: 0, color: '#6B7280' }
    ]
    const result = generatePieChartSvg(slices)
    expect(result).toContain('<svg')
    expect(result).toContain('<circle')
    expect(result).toContain('Completed: 5')
  })

  it('generates SVG with path elements for multiple slices', () => {
    const slices: PieSlice[] = [
      { label: 'Planned', count: 3, color: '#6B7280' },
      { label: 'In Progress', count: 2, color: '#F59E0B' },
      { label: 'Completed', count: 5, color: '#10B981' }
    ]
    const result = generatePieChartSvg(slices)
    expect(result).toContain('<svg')
    expect(result).toContain('<path')
    expect(result).toContain('Planned: 3')
    expect(result).toContain('In Progress: 2')
    expect(result).toContain('Completed: 5')
  })

  it('includes legend entries for all slices', () => {
    const slices: PieSlice[] = [
      { label: 'Alpha', count: 1, color: '#f00' },
      { label: 'Beta', count: 2, color: '#0f0' }
    ]
    const result = generatePieChartSvg(slices)
    expect(result).toContain('Alpha: 1')
    expect(result).toContain('Beta: 2')
  })
})

function createTask(overrides: Partial<DetailedProjectTask> = {}): DetailedProjectTask {
  return {
    title: 'Test Task',
    description: 'A test task description',
    status: 'BACKLOG',
    dueDate: '2026-04-01',
    completedAt: null,
    ...overrides
  }
}

describe('generateDetailedProjectReport', () => {
  it('includes the project name in the title', () => {
    const data: DetailedProjectReportData = {
      projectName: 'My Awesome Project',
      tasks: []
    }
    const result = generateDetailedProjectReport(data)
    expect(result).toContain('# Detailed Project Report: My Awesome Project')
  })

  it('shows task overview counts', () => {
    const data: DetailedProjectReportData = {
      projectName: 'Test',
      tasks: [
        createTask({ status: 'BACKLOG' }),
        createTask({ status: 'BACKLOG' }),
        createTask({ status: 'IN_PROGRESS' }),
        createTask({ status: 'DONE', completedAt: '2026-03-10' }),
        createTask({ status: 'DONE', completedAt: '2026-03-12' }),
        createTask({ status: 'DONE', completedAt: '2026-03-15' })
      ]
    }
    const result = generateDetailedProjectReport(data)
    expect(result).toContain('**Total:** 6')
    expect(result).toContain('**Planned:** 2')
    expect(result).toContain('**In Progress:** 1')
    expect(result).toContain('**Completed:** 3')
  })

  it('includes an SVG pie chart', () => {
    const data: DetailedProjectReportData = {
      projectName: 'Test',
      tasks: [
        createTask({ status: 'BACKLOG' }),
        createTask({ status: 'DONE', completedAt: '2026-03-10' })
      ]
    }
    const result = generateDetailedProjectReport(data)
    expect(result).toContain('<svg')
  })

  it('shows empty messages when no tasks exist for a status', () => {
    const data: DetailedProjectReportData = {
      projectName: 'Empty',
      tasks: []
    }
    const result = generateDetailedProjectReport(data)
    expect(result).toContain('No planned tasks.')
    expect(result).toContain('No tasks in progress.')
    expect(result).toContain('No completed tasks.')
  })

  describe('Planned Tasks', () => {
    it('sorts planned tasks by due date', () => {
      const data: DetailedProjectReportData = {
        projectName: 'Test',
        tasks: [
          createTask({ title: 'Late', status: 'BACKLOG', dueDate: '2026-05-01' }),
          createTask({ title: 'Early', status: 'BACKLOG', dueDate: '2026-03-15' }),
          createTask({ title: 'Mid', status: 'BACKLOG', dueDate: '2026-04-01' })
        ]
      }
      const result = generateDetailedProjectReport(data)
      const earlyIdx = result.indexOf('### Early')
      const midIdx = result.indexOf('### Mid')
      const lateIdx = result.indexOf('### Late')
      expect(earlyIdx).toBeLessThan(midIdx)
      expect(midIdx).toBeLessThan(lateIdx)
    })

    it('puts tasks without due date last', () => {
      const data: DetailedProjectReportData = {
        projectName: 'Test',
        tasks: [
          createTask({ title: 'No Date', status: 'BACKLOG', dueDate: null }),
          createTask({ title: 'Has Date', status: 'BACKLOG', dueDate: '2026-04-01' })
        ]
      }
      const result = generateDetailedProjectReport(data)
      const hasDateIdx = result.indexOf('### Has Date')
      const noDateIdx = result.indexOf('### No Date')
      expect(hasDateIdx).toBeLessThan(noDateIdx)
    })

    it('displays title, due date, and description', () => {
      const data: DetailedProjectReportData = {
        projectName: 'Test',
        tasks: [
          createTask({ title: 'My Task', status: 'BACKLOG', dueDate: '2026-04-15', description: 'Do something important' })
        ]
      }
      const result = generateDetailedProjectReport(data)
      expect(result).toContain('### My Task')
      expect(result).toContain('**Due:** 2026-04-15')
      expect(result).toContain('Do something important')
    })

    it('shows "No description" for tasks without notes', () => {
      const data: DetailedProjectReportData = {
        projectName: 'Test',
        tasks: [
          createTask({ title: 'Bare Task', status: 'BACKLOG', description: null })
        ]
      }
      const result = generateDetailedProjectReport(data)
      expect(result).toContain('*No description*')
    })
  })

  describe('In Progress Tasks', () => {
    it('sorts in-progress tasks by due date', () => {
      const data: DetailedProjectReportData = {
        projectName: 'Test',
        tasks: [
          createTask({ title: 'Later', status: 'IN_PROGRESS', dueDate: '2026-05-01' }),
          createTask({ title: 'Sooner', status: 'IN_PROGRESS', dueDate: '2026-03-20' })
        ]
      }
      const result = generateDetailedProjectReport(data)
      const soonerIdx = result.indexOf('### Sooner')
      const laterIdx = result.indexOf('### Later')
      expect(soonerIdx).toBeLessThan(laterIdx)
    })
  })

  describe('Completed Tasks', () => {
    it('sorts completed tasks by completion date', () => {
      const data: DetailedProjectReportData = {
        projectName: 'Test',
        tasks: [
          createTask({ title: 'Done Last', status: 'DONE', completedAt: '2026-03-20' }),
          createTask({ title: 'Done First', status: 'DONE', completedAt: '2026-03-05' }),
          createTask({ title: 'Done Mid', status: 'DONE', completedAt: '2026-03-12' })
        ]
      }
      const result = generateDetailedProjectReport(data)
      const firstIdx = result.indexOf('### Done First')
      const midIdx = result.indexOf('### Done Mid')
      const lastIdx = result.indexOf('### Done Last')
      expect(firstIdx).toBeLessThan(midIdx)
      expect(midIdx).toBeLessThan(lastIdx)
    })

    it('displays completion date instead of due date', () => {
      const data: DetailedProjectReportData = {
        projectName: 'Test',
        tasks: [
          createTask({ title: 'Finished', status: 'DONE', completedAt: '2026-03-15', description: 'All done' })
        ]
      }
      const result = generateDetailedProjectReport(data)
      expect(result).toContain('**Completed:** 2026-03-15')
    })
  })

  describe('Section ordering', () => {
    it('lists sections in order: Planned, In Progress, Completed', () => {
      const data: DetailedProjectReportData = {
        projectName: 'Test',
        tasks: [
          createTask({ status: 'DONE', completedAt: '2026-03-10' }),
          createTask({ status: 'BACKLOG' }),
          createTask({ status: 'IN_PROGRESS' })
        ]
      }
      const result = generateDetailedProjectReport(data)
      const plannedIdx = result.indexOf('## Planned Tasks')
      const inProgressIdx = result.indexOf('## In Progress Tasks')
      const completedIdx = result.indexOf('## Completed Tasks')
      expect(plannedIdx).toBeLessThan(inProgressIdx)
      expect(inProgressIdx).toBeLessThan(completedIdx)
    })
  })

  describe('Full report', () => {
    it('generates a complete report with all sections', () => {
      const data: DetailedProjectReportData = {
        projectName: 'Alpha Project',
        tasks: [
          createTask({ title: 'Backlog 1', status: 'BACKLOG', dueDate: '2026-04-10', description: 'Plan this' }),
          createTask({ title: 'WIP 1', status: 'IN_PROGRESS', dueDate: '2026-04-01', description: 'Working on it' }),
          createTask({ title: 'Complete 1', status: 'DONE', completedAt: '2026-03-05', description: 'Finished' }),
          createTask({ title: 'Complete 2', status: 'DONE', completedAt: '2026-03-15', description: 'Also finished' })
        ]
      }
      const result = generateDetailedProjectReport(data)

      expect(result).toContain('# Detailed Project Report: Alpha Project')
      expect(result).toContain('**Total:** 4')
      expect(result).toContain('**Planned:** 1')
      expect(result).toContain('**In Progress:** 1')
      expect(result).toContain('**Completed:** 2')
      expect(result).toContain('<svg')
      expect(result).toContain('### Backlog 1')
      expect(result).toContain('### WIP 1')
      expect(result).toContain('### Complete 1')
      expect(result).toContain('### Complete 2')
    })
  })
})
