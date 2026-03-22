import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Seeds the database with test data across all entity types
 * so that an Activity Report for March 2026 (1st - 31st) will
 * include entries in every section.
 *
 * Run with: npx ts-node prisma/seed-reports.ts
 */
async function main() {
  let user = await prisma.user.findFirst({
    where: { email: 'tony@aosd.co.uk' }
  })

  if (!user) {
    user = await prisma.user.create({
      data: { email: 'tony@aosd.co.uk', name: 'Test User' }
    })
    console.log('Created test user:', user.email)
  }

  // --- Projects ---
  const projectAlpha = await prisma.project.upsert({
    where: { id: 'seed-project-alpha' },
    update: {},
    create: {
      id: 'seed-project-alpha',
      userId: user.id,
      name: 'Alpha Project',
      color: '#3B82F6'
    }
  })

  const projectBeta = await prisma.project.upsert({
    where: { id: 'seed-project-beta' },
    update: {},
    create: {
      id: 'seed-project-beta',
      userId: user.id,
      name: 'Beta Project',
      color: '#10B981'
    }
  })

  console.log('Seeded projects: Alpha Project, Beta Project')

  // --- Project Tasks (completed in March 2026) ---
  const projectTasks = [
    { id: 'seed-task-p1', title: 'Set up CI/CD pipeline', projectId: projectAlpha.id, completedAt: new Date('2026-03-03T10:00:00Z') },
    { id: 'seed-task-p2', title: 'Write API documentation', projectId: projectAlpha.id, completedAt: new Date('2026-03-08T14:00:00Z') },
    { id: 'seed-task-p3', title: 'Implement authentication', projectId: projectAlpha.id, completedAt: new Date('2026-03-15T09:00:00Z') },
    { id: 'seed-task-p4', title: 'Design landing page', projectId: projectBeta.id, completedAt: new Date('2026-03-05T11:00:00Z') },
    { id: 'seed-task-p5', title: 'Build contact form', projectId: projectBeta.id, completedAt: new Date('2026-03-12T16:00:00Z') },
    { id: 'seed-task-p6', title: 'Optimise images', projectId: projectBeta.id, completedAt: new Date('2026-03-20T12:00:00Z') },
  ]

  for (const t of projectTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        userId: user.id,
        projectId: t.projectId,
        title: t.title,
        status: 'DONE',
        priority: 'MEDIUM',
        completedAt: t.completedAt,
        dueDate: t.completedAt
      }
    })
  }
  console.log(`Seeded ${projectTasks.length} project tasks`)

  // --- Non-project Tasks (completed in March 2026) ---
  const nonProjectTasks = [
    { id: 'seed-task-np1', title: 'Tidy desk', completedAt: new Date('2026-03-02T08:00:00Z') },
    { id: 'seed-task-np2', title: 'Book dentist appointment', completedAt: new Date('2026-03-07T10:00:00Z') },
    { id: 'seed-task-np3', title: 'Update CV', completedAt: new Date('2026-03-14T15:00:00Z') },
    { id: 'seed-task-np4', title: 'Renew gym membership', completedAt: new Date('2026-03-21T09:00:00Z') },
  ]

  for (const t of nonProjectTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        userId: user.id,
        title: t.title,
        status: 'DONE',
        priority: 'MEDIUM',
        completedAt: t.completedAt,
        dueDate: t.completedAt
      }
    })
  }
  console.log(`Seeded ${nonProjectTasks.length} non-project tasks`)

  // --- Cyclic Tasks (lastCompletedDate in March 2026) ---
  const cyclicTasks = [
    { id: 'seed-cyclic-1', title: 'Weekly review', groupName: 'Reviews', lastCompletedDate: new Date('2026-03-07T18:00:00Z') },
    { id: 'seed-cyclic-2', title: 'Water plants', groupName: 'Home', lastCompletedDate: new Date('2026-03-10T07:00:00Z') },
    { id: 'seed-cyclic-3', title: 'Backup laptop', groupName: 'Tech', lastCompletedDate: new Date('2026-03-22T20:00:00Z') },
  ]

  for (const ct of cyclicTasks) {
    await prisma.cyclicTask.upsert({
      where: { id: ct.id },
      update: { lastCompletedDate: ct.lastCompletedDate },
      create: {
        id: ct.id,
        userId: user.id,
        title: ct.title,
        groupName: ct.groupName,
        lastCompletedDate: ct.lastCompletedDate
      }
    })
  }
  console.log(`Seeded ${cyclicTasks.length} cyclic tasks`)

  // --- Journal Entries (dated in March 2026) ---
  const journalEntries = [
    { id: 'seed-journal-1', title: 'New month goals', date: new Date('2026-03-01'), type: 'DAILY' as const, mood: 'EXCITED' as const, content: 'Setting goals for March. Focus on fitness and project milestones.' },
    { id: 'seed-journal-2', title: 'Mid-month check-in', date: new Date('2026-03-15'), type: 'REVIEW' as const, mood: 'NEUTRAL' as const, content: 'Halfway through March. Progress is steady but could be better on the fitness side.' },
    { id: 'seed-journal-3', title: 'Weekend reflection', date: new Date('2026-03-22'), type: 'FREEFORM' as const, mood: 'HAPPY' as const, content: 'Enjoyed a long walk in the countryside today. Feeling refreshed.' },
    { id: 'seed-journal-4', title: 'End of month wrap-up', date: new Date('2026-03-31'), type: 'REVIEW' as const, mood: 'HAPPY' as const, content: 'Good month overall. Hit most of my goals and learned a lot.' },
  ]

  for (const je of journalEntries) {
    await prisma.journalEntry.upsert({
      where: { id: je.id },
      update: {},
      create: {
        id: je.id,
        userId: user.id,
        title: je.title,
        content: je.content,
        type: je.type,
        date: je.date,
        mood: je.mood,
        tags: []
      }
    })
  }
  console.log(`Seeded ${journalEntries.length} journal entries`)

  // --- Trackers with entries in March 2026 ---
  const trackersData = [
    {
      id: 'seed-tracker-1',
      name: 'Exercise',
      groupName: 'Health',
      entries: [
        { id: 'seed-te-1', date: new Date('2026-03-01'), value: 100 },
        { id: 'seed-te-2', date: new Date('2026-03-03'), value: 80 },
        { id: 'seed-te-3', date: new Date('2026-03-05'), value: 100 },
        { id: 'seed-te-4', date: new Date('2026-03-08'), value: 60 },
        { id: 'seed-te-5', date: new Date('2026-03-10'), value: 100 },
        { id: 'seed-te-6', date: new Date('2026-03-12'), value: 90 },
        { id: 'seed-te-7', date: new Date('2026-03-15'), value: 100 },
        { id: 'seed-te-8', date: new Date('2026-03-18'), value: 70 },
        { id: 'seed-te-9', date: new Date('2026-03-20'), value: 100 },
        { id: 'seed-te-10', date: new Date('2026-03-25'), value: 85 },
        { id: 'seed-te-11', date: new Date('2026-03-28'), value: 100 },
      ]
    },
    {
      id: 'seed-tracker-2',
      name: 'Reading',
      groupName: 'Learning',
      entries: [
        { id: 'seed-te-20', date: new Date('2026-03-02'), value: 100 },
        { id: 'seed-te-21', date: new Date('2026-03-09'), value: 100 },
        { id: 'seed-te-22', date: new Date('2026-03-16'), value: 100 },
        { id: 'seed-te-23', date: new Date('2026-03-23'), value: 100 },
        { id: 'seed-te-24', date: new Date('2026-03-30'), value: 100 },
      ]
    }
  ]

  for (const tracker of trackersData) {
    await prisma.tracker.upsert({
      where: { id: tracker.id },
      update: {},
      create: {
        id: tracker.id,
        userId: user.id,
        name: tracker.name,
        groupName: tracker.groupName
      }
    })

    for (const entry of tracker.entries) {
      await prisma.trackerEntry.upsert({
        where: { id: entry.id },
        update: {},
        create: {
          id: entry.id,
          trackerId: tracker.id,
          date: entry.date,
          value: entry.value
        }
      })
    }
  }
  console.log(`Seeded ${trackersData.length} trackers with entries`)

  console.log('\nReport seed data complete!')
  console.log('Generate a report for March 1-31, 2026 to see all sections populated.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
