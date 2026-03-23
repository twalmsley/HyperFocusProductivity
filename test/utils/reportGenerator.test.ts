import { describe, expect, it } from 'vitest'
import {
  buildActivitySummaryReportMarkdown,
  buildDetailedAllProjectsReportMarkdown,
  buildDetailedProjectReportMarkdown,
  buildTrackersActivityReportMarkdown,
} from '~/server/utils/reportGenerator'

describe('buildActivitySummaryReportMarkdown', () => {
  it('builds markdown with sorted sections and tracker summary', () => {
    const markdown = buildActivitySummaryReportMarkdown({
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T23:59:59.999Z'),
      generatedAt: new Date('2026-04-01T08:30:00.000Z'),
      projectTasks: [
        { projectName: 'Beta Project', title: 'Beta Task', completedAt: new Date('2026-03-10T10:00:00.000Z') },
        { projectName: 'Alpha Project', title: 'Second Alpha Task', completedAt: new Date('2026-03-12T10:00:00.000Z') },
        { projectName: 'Alpha Project', title: 'First Alpha Task', completedAt: new Date('2026-03-05T10:00:00.000Z') },
      ],
      nonProjectTasks: [
        { title: 'Later Standalone Task', completedAt: new Date('2026-03-16T10:00:00.000Z') },
        { title: 'Earlier Standalone Task', completedAt: new Date('2026-03-02T10:00:00.000Z') },
      ],
      cyclicTasks: [
        { title: 'Review Backups', completedAt: new Date('2026-03-04T10:00:00.000Z') },
      ],
      journalEntries: [
        { title: 'Daily reflection', entryDate: new Date('2026-03-03T10:00:00.000Z') },
      ],
      trackers: [
        {
          trackerName: 'Workout',
          completionDates: [
            new Date('2026-03-01T06:00:00.000Z'),
            new Date('2026-03-01T20:00:00.000Z'),
            new Date('2026-03-04T06:00:00.000Z'),
          ],
        },
      ],
    })

    expect(markdown).toContain('# Activity Summary Report')
    expect(markdown.indexOf('### Alpha Project')).toBeLessThan(markdown.indexOf('### Beta Project'))
    expect(markdown.indexOf('First Alpha Task')).toBeLessThan(markdown.indexOf('Second Alpha Task'))
    expect(markdown.indexOf('Earlier Standalone Task')).toBeLessThan(markdown.indexOf('Later Standalone Task'))
    expect(markdown).toContain('Summary: 2 completed out of 31 days')
  })

  it('writes empty-state messages when sections have no data', () => {
    const markdown = buildActivitySummaryReportMarkdown({
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-01T23:59:59.999Z'),
      generatedAt: new Date('2026-03-02T08:30:00.000Z'),
      projectTasks: [],
      nonProjectTasks: [],
      cyclicTasks: [],
      journalEntries: [],
      trackers: [],
    })

    expect(markdown).toContain('No completed project tasks found')
    expect(markdown).toContain('No completed non-project tasks found')
    expect(markdown).toContain('No cyclic task completions found')
    expect(markdown).toContain('No journal entries found')
    expect(markdown).toContain('No completed trackers found')
  })
})

describe('buildDetailedProjectReportMarkdown', () => {
  it('orders planned, in-progress, and completed tasks correctly', () => {
    const markdown = buildDetailedProjectReportMarkdown({
      projectName: 'Acme Product Launch',
      generatedAt: new Date('2026-04-01T10:00:00.000Z'),
      plannedTasks: [
        {
          title: 'Later planned',
          description: 'Later due',
          status: 'BACKLOG',
          dueDate: new Date('2026-04-10T12:00:00.000Z'),
          completedAt: null,
        },
        {
          title: 'Earlier planned',
          description: 'Earlier due',
          status: 'BACKLOG',
          dueDate: new Date('2026-04-03T12:00:00.000Z'),
          completedAt: null,
        },
      ],
      inProgressTasks: [
        {
          title: 'Later in-progress',
          description: 'In progress later',
          status: 'IN_PROGRESS',
          dueDate: new Date('2026-04-08T12:00:00.000Z'),
          completedAt: null,
        },
        {
          title: 'Earlier in-progress',
          description: 'In progress earlier',
          status: 'IN_PROGRESS',
          dueDate: new Date('2026-04-02T12:00:00.000Z'),
          completedAt: null,
        },
      ],
      completedTasks: [
        {
          title: 'Later completed',
          description: 'Done later',
          status: 'DONE',
          dueDate: new Date('2026-03-20T12:00:00.000Z'),
          completedAt: new Date('2026-03-25T12:00:00.000Z'),
        },
        {
          title: 'Earlier completed',
          description: 'Done earlier',
          status: 'DONE',
          dueDate: new Date('2026-03-12T12:00:00.000Z'),
          completedAt: new Date('2026-03-14T12:00:00.000Z'),
        },
      ],
    })

    expect(markdown).toContain('# Detailed Project Report: Acme Product Launch')
    expect(markdown).toContain('- Planned tasks: 2')
    expect(markdown).toContain('- In-progress tasks: 2')
    expect(markdown).toContain('- Completed tasks: 2')

    expect(markdown.indexOf('## Planned Tasks')).toBeLessThan(markdown.indexOf('## In-progress Tasks'))
    expect(markdown.indexOf('## In-progress Tasks')).toBeLessThan(markdown.indexOf('## Completed Tasks'))
    expect(markdown.indexOf('Earlier planned')).toBeLessThan(markdown.indexOf('Later planned'))
    expect(markdown.indexOf('Earlier in-progress')).toBeLessThan(markdown.indexOf('Later in-progress'))
    expect(markdown.indexOf('Earlier completed')).toBeLessThan(markdown.indexOf('Later completed'))
  })
})

describe('buildDetailedAllProjectsReportMarkdown', () => {
  it('builds all-projects markdown with project counts and state ordering', () => {
    const markdown = buildDetailedAllProjectsReportMarkdown({
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T23:59:59.999Z'),
      generatedAt: new Date('2026-04-01T10:00:00.000Z'),
      plannedTasks: [
        {
          title: 'Plan rollout',
          description: 'Rollout planning',
          projectName: 'Project Z',
          status: 'BACKLOG',
          dueDate: new Date('2026-03-08T12:00:00.000Z'),
          completedAt: null,
        },
      ],
      inProgressTasks: [
        {
          title: 'Build feature',
          description: 'Feature build',
          projectName: 'Project A',
          status: 'IN_PROGRESS',
          dueDate: new Date('2026-03-06T12:00:00.000Z'),
          completedAt: null,
        },
      ],
      completedTasks: [
        {
          title: 'Release prep',
          description: 'Prep',
          projectName: 'Project A',
          status: 'DONE',
          dueDate: new Date('2026-03-03T12:00:00.000Z'),
          completedAt: new Date('2026-03-05T12:00:00.000Z'),
        },
      ],
    })

    expect(markdown).toContain('# Detailed All Projects Tasks Report')
    expect(markdown).toContain('- Planned tasks: 1')
    expect(markdown).toContain('- In-progress tasks: 1')
    expect(markdown).toContain('- Completed tasks: 1')
    expect(markdown).toContain('- Project tasks: Project A = 2')
    expect(markdown).toContain('- Project tasks: Project Z = 1')
    expect(markdown.indexOf('## Planned Tasks')).toBeLessThan(markdown.indexOf('## In-progress Tasks'))
    expect(markdown.indexOf('## In-progress Tasks')).toBeLessThan(markdown.indexOf('## Completed Tasks'))
  })
})

describe('buildTrackersActivityReportMarkdown', () => {
  it('includes tracker stats lines for chart rendering', () => {
    const markdown = buildTrackersActivityReportMarkdown({
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T23:59:59.999Z'),
      generatedAt: new Date('2026-04-01T10:00:00.000Z'),
      trackers: [
        {
          trackerName: 'Workout',
          totalDays: 31,
          completedDates: [new Date('2026-03-02T12:00:00.000Z'), new Date('2026-03-05T12:00:00.000Z')],
        },
      ],
    })

    expect(markdown).toContain('# Trackers Activity Report')
    expect(markdown).toContain('- Completed days: 2/31 (6%)')
    expect(markdown).toContain('- Tracker stats: Workout|2|31|6|2026-03-02,2026-03-05')
  })
})
