import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getOrCreateUser() {
  let user = await prisma.user.findFirst({
    where: {
      email: 'tony@aosd.co.uk',
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'tony@aosd.co.uk',
        name: 'Tony Walmsley',
      },
    })
    console.log('Created seed user tony@aosd.co.uk')
  }

  return user
}

async function getOrCreateProject(userId: string, name: string, color: string) {
  const existing = await prisma.project.findFirst({
    where: {
      userId,
      name,
    },
  })

  if (existing) {
    return existing
  }

  return prisma.project.create({
    data: {
      userId,
      name,
      color,
    },
  })
}

async function seedProjectAndNonProjectTasks(userId: string, projectId: string) {
  const taskRows = [
    {
      title: 'Ship phase 1 dashboard',
      projectId,
      completedAt: new Date('2026-03-03T14:30:00.000Z'),
    },
    {
      title: 'Write project retrospective',
      projectId,
      completedAt: new Date('2026-03-14T09:15:00.000Z'),
    },
    {
      title: 'Book annual health check',
      projectId: null,
      completedAt: new Date('2026-03-07T10:45:00.000Z'),
    },
    {
      title: 'Prepare monthly budget notes',
      projectId: null,
      completedAt: new Date('2026-03-18T16:10:00.000Z'),
    },
  ]

  for (const row of taskRows) {
    const exists = await prisma.task.findFirst({
      where: {
        userId,
        title: row.title,
      },
    })
    if (!exists) {
      await prisma.task.create({
        data: {
          userId,
          projectId: row.projectId,
          title: row.title,
          notes: 'Seeded for reports integration testing',
          estimatedPomodoros: 1,
          completedPomodoros: 1,
          status: 'DONE',
          priority: 'MEDIUM',
          dueDate: row.completedAt,
          completedAt: row.completedAt,
        },
      })
    }
  }
}

async function seedDetailedProjectTasks(userId: string, projectId: string) {
  const detailedTaskRows = [
    {
      title: 'Define project scope',
      notes: 'Document all deliverables and dependencies for the quarter.',
      status: 'BACKLOG' as const,
      dueDate: new Date('2026-04-05T12:00:00.000Z'),
      completedAt: null,
      completedPomodoros: 0,
    },
    {
      title: 'Create API integration plan',
      notes: 'Draft endpoint contracts and expected failure handling paths.',
      status: 'BACKLOG' as const,
      dueDate: new Date('2026-04-12T12:00:00.000Z'),
      completedAt: null,
      completedPomodoros: 0,
    },
    {
      title: 'Implement authentication middleware',
      notes: 'Build reusable middleware with role checks and audit logging.',
      status: 'IN_PROGRESS' as const,
      dueDate: new Date('2026-04-02T12:00:00.000Z'),
      completedAt: null,
      completedPomodoros: 2,
    },
    {
      title: 'Prototype reporting dashboard UI',
      notes: 'Create interactive card and modal flows for report generation.',
      status: 'IN_PROGRESS' as const,
      dueDate: new Date('2026-04-09T12:00:00.000Z'),
      completedAt: null,
      completedPomodoros: 3,
    },
    {
      title: 'Set up project repository standards',
      notes: 'Configure linting, formatting, and commit hook checks.',
      status: 'DONE' as const,
      dueDate: new Date('2026-03-04T12:00:00.000Z'),
      completedAt: new Date('2026-03-03T09:30:00.000Z'),
      completedPomodoros: 1,
    },
    {
      title: 'Build deployment pipeline',
      notes: 'Automate staging deployment and smoke tests in CI.',
      status: 'DONE' as const,
      dueDate: new Date('2026-03-11T12:00:00.000Z'),
      completedAt: new Date('2026-03-10T14:15:00.000Z'),
      completedPomodoros: 2,
    },
  ]

  for (const row of detailedTaskRows) {
    const exists = await prisma.task.findFirst({
      where: {
        userId,
        projectId,
        title: row.title,
      },
    })

    if (!exists) {
      await prisma.task.create({
        data: {
          userId,
          projectId,
          title: row.title,
          notes: row.notes,
          estimatedPomodoros: 3,
          completedPomodoros: row.completedPomodoros,
          status: row.status,
          priority: row.status === 'DONE' ? 'MEDIUM' : 'HIGH',
          dueDate: row.dueDate,
          completedAt: row.completedAt,
        },
      })
    }
  }
}

async function seedCyclicTasks(userId: string) {
  const rows = [
    { title: 'Weekly inbox cleanup', lastCompletedDate: new Date('2026-03-05T08:00:00.000Z') },
    { title: 'Monthly backups check', lastCompletedDate: new Date('2026-03-22T08:00:00.000Z') },
  ]

  for (const row of rows) {
    const exists = await prisma.cyclicTask.findFirst({
      where: {
        userId,
        title: row.title,
      },
    })
    if (!exists) {
      await prisma.cyclicTask.create({
        data: {
          userId,
          groupName: 'Reporting Samples',
          title: row.title,
          description: 'Seeded for reports integration testing',
          lastCompletedDate: row.lastCompletedDate,
        },
      })
    }
  }
}

async function seedJournalEntries(userId: string) {
  const rows = [
    { title: 'March kickoff reflection', date: new Date('2026-03-01T20:00:00.000Z') },
    { title: 'Mid-month review notes', date: new Date('2026-03-15T20:00:00.000Z') },
  ]

  for (const row of rows) {
    const exists = await prisma.journalEntry.findFirst({
      where: {
        userId,
        title: row.title,
      },
    })
    if (!exists) {
      await prisma.journalEntry.create({
        data: {
          userId,
          title: row.title,
          content: 'Seeded journal entry for report generation testing.',
          type: 'FREEFORM',
          date: row.date,
          mood: 'NEUTRAL',
          tags: ['reports', 'seed'],
        },
      })
    }
  }
}

async function seedTrackerEntries(userId: string) {
  let tracker = await prisma.tracker.findFirst({
    where: {
      userId,
      name: 'Workout',
      groupName: 'Reporting Samples',
    },
  })

  if (!tracker) {
    tracker = await prisma.tracker.create({
      data: {
        userId,
        name: 'Workout',
        groupName: 'Reporting Samples',
      },
    })
  }

  const completionDates = [
    '2026-03-02',
    '2026-03-05',
    '2026-03-10',
    '2026-03-14',
    '2026-03-20',
    '2026-03-27',
  ]

  for (const day of completionDates) {
    const date = new Date(`${day}T12:00:00.000Z`)
    const exists = await prisma.trackerEntry.findFirst({
      where: {
        trackerId: tracker.id,
        date,
      },
    })

    if (!exists) {
      await prisma.trackerEntry.create({
        data: {
          trackerId: tracker.id,
          date,
          value: 100,
        },
      })
    }
  }
}

async function main() {
  const user = await getOrCreateUser()
  const project = await getOrCreateProject(user.id, 'Acme Product Launch', '#3b82f6')

  await seedProjectAndNonProjectTasks(user.id, project.id)
  await seedDetailedProjectTasks(user.id, project.id)
  await seedCyclicTasks(user.id)
  await seedJournalEntries(user.id)
  await seedTrackerEntries(user.id)

  console.log('Report seed data created successfully')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
