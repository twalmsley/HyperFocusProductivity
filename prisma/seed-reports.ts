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

  // --- Alpha Project: Completed tasks ---
  const alphaCompletedTasks = [
    { id: 'seed-task-p1', title: 'Set up CI/CD pipeline', notes: 'Configure GitHub Actions for automated builds and deployments to staging.', projectId: projectAlpha.id, completedAt: new Date('2026-03-03T10:00:00Z'), dueDate: new Date('2026-03-03') },
    { id: 'seed-task-p2', title: 'Write API documentation', notes: 'Document all REST endpoints using OpenAPI 3.0 specification. Include request/response examples.', projectId: projectAlpha.id, completedAt: new Date('2026-03-08T14:00:00Z'), dueDate: new Date('2026-03-10') },
    { id: 'seed-task-p3', title: 'Implement authentication', notes: 'Add OAuth2 with Google and GitHub providers. Include session management and CSRF protection.', projectId: projectAlpha.id, completedAt: new Date('2026-03-15T09:00:00Z'), dueDate: new Date('2026-03-14') },
  ]

  // --- Alpha Project: In-progress tasks ---
  const alphaInProgressTasks = [
    { id: 'seed-task-p-ip1', title: 'Build user dashboard', notes: 'Create the main dashboard view showing key metrics, recent activity, and quick actions.', projectId: projectAlpha.id, dueDate: new Date('2026-04-01') },
    { id: 'seed-task-p-ip2', title: 'Add rate limiting', notes: 'Implement rate limiting on all public API endpoints to prevent abuse. Use sliding window algorithm.', projectId: projectAlpha.id, dueDate: new Date('2026-04-05') },
  ]

  // --- Alpha Project: Planned/backlog tasks ---
  const alphaPlannedTasks = [
    { id: 'seed-task-p-bl1', title: 'Set up monitoring and alerting', notes: 'Configure Datadog or similar for application monitoring, error tracking, and alerting on key metrics.', projectId: projectAlpha.id, dueDate: new Date('2026-04-15') },
    { id: 'seed-task-p-bl2', title: 'Performance optimisation pass', notes: 'Profile the application and optimise slow database queries, reduce bundle size, and add caching where appropriate.', projectId: projectAlpha.id, dueDate: new Date('2026-04-20') },
    { id: 'seed-task-p-bl3', title: 'Write end-to-end tests', notes: 'Create Playwright tests covering the critical user journeys: signup, login, dashboard, and data export.', projectId: projectAlpha.id, dueDate: null },
  ]

  // --- Beta Project: Completed tasks ---
  const betaCompletedTasks = [
    { id: 'seed-task-p4', title: 'Design landing page', notes: 'Create responsive landing page mockups in Figma, including hero section, features grid, and pricing table.', projectId: projectBeta.id, completedAt: new Date('2026-03-05T11:00:00Z'), dueDate: new Date('2026-03-05') },
    { id: 'seed-task-p5', title: 'Build contact form', notes: 'Implement contact form with email validation, honeypot spam protection, and server-side processing.', projectId: projectBeta.id, completedAt: new Date('2026-03-12T16:00:00Z'), dueDate: new Date('2026-03-12') },
    { id: 'seed-task-p6', title: 'Optimise images', notes: 'Convert all images to WebP format, add lazy loading, and implement responsive image srcsets.', projectId: projectBeta.id, completedAt: new Date('2026-03-20T12:00:00Z'), dueDate: new Date('2026-03-18') },
  ]

  // --- Beta Project: In-progress tasks ---
  const betaInProgressTasks = [
    { id: 'seed-task-p-ip3', title: 'Implement blog section', notes: 'Build a markdown-based blog with categories, tags, and RSS feed support.', projectId: projectBeta.id, dueDate: new Date('2026-03-28') },
  ]

  // --- Beta Project: Planned/backlog tasks ---
  const betaPlannedTasks = [
    { id: 'seed-task-p-bl4', title: 'Add SEO metadata', notes: 'Implement dynamic meta tags, Open Graph data, and structured data (JSON-LD) for all public pages.', projectId: projectBeta.id, dueDate: new Date('2026-04-10') },
    { id: 'seed-task-p-bl5', title: 'Set up analytics', notes: 'Integrate privacy-friendly analytics (Plausible or Umami) and set up conversion tracking for the contact form.', projectId: projectBeta.id, dueDate: new Date('2026-04-12') },
  ]

  // Seed all project tasks
  for (const t of alphaCompletedTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, userId: user.id, projectId: t.projectId, title: t.title, notes: t.notes, status: 'DONE', priority: 'MEDIUM', completedAt: t.completedAt, dueDate: t.dueDate }
    })
  }
  for (const t of alphaInProgressTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, userId: user.id, projectId: t.projectId, title: t.title, notes: t.notes, status: 'IN_PROGRESS', priority: 'HIGH', dueDate: t.dueDate }
    })
  }
  for (const t of alphaPlannedTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, userId: user.id, projectId: t.projectId, title: t.title, notes: t.notes, status: 'BACKLOG', priority: 'MEDIUM', dueDate: t.dueDate }
    })
  }
  for (const t of betaCompletedTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, userId: user.id, projectId: t.projectId, title: t.title, notes: t.notes, status: 'DONE', priority: 'MEDIUM', completedAt: t.completedAt, dueDate: t.dueDate }
    })
  }
  for (const t of betaInProgressTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, userId: user.id, projectId: t.projectId, title: t.title, notes: t.notes, status: 'IN_PROGRESS', priority: 'HIGH', dueDate: t.dueDate }
    })
  }
  for (const t of betaPlannedTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, userId: user.id, projectId: t.projectId, title: t.title, notes: t.notes, status: 'BACKLOG', priority: 'MEDIUM', dueDate: t.dueDate }
    })
  }
  const totalProjectTasks = alphaCompletedTasks.length + alphaInProgressTasks.length + alphaPlannedTasks.length +
    betaCompletedTasks.length + betaInProgressTasks.length + betaPlannedTasks.length
  console.log(`Seeded ${totalProjectTasks} project tasks (completed, in-progress, and planned)`)

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
  console.log('- Activity Report: use March 1-31, 2026 to see all sections populated.')
  console.log('- Detailed Project Report: select Alpha Project or Beta Project to see all task states.')
  console.log('- Detailed All Tasks Report: use March 1-31, 2026 to see tasks across all projects with both pie charts.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
