import { PrismaClient, TaskStatus } from '@prisma/client'

const prisma = new PrismaClient()

const userId = 'cf14960e-7991-437c-8c23-17864a6d2a29'

const statuses: TaskStatus[] = ['BACKLOG', 'IN_PROGRESS', 'DONE']
const taskTitles = [
  'Complete project documentation',
  'Review pull requests',
  'Fix UI bugs',
  'Implement new feature',
  'Write unit tests',
  'Optimize database queries',
  'Update dependencies',
  'Refactor legacy code',
  'Add error handling',
  'Improve performance',
  'Create API endpoints',
  'Design database schema',
  'Set up CI/CD pipeline',
  'Configure monitoring',
  'Implement caching',
  'Add logging system',
  'Create backup system',
  'Optimize image loading',
  'Implement search functionality',
  'Add user preferences',
  'Create admin dashboard',
  'Fix authentication issues',
  'Update security measures',
  'Improve accessibility',
  'Add analytics tracking',
  'Optimize mobile view',
  'Implement dark mode',
  'Add keyboard shortcuts',
  'Create user onboarding',
  'Implement notifications'
]

const taskNotes = [
  'Need to consider edge cases',
  'Should be compatible with existing systems',
  'Must follow security best practices',
  'Consider performance implications',
  'Need to add more test coverage',
  'Should be documented thoroughly',
  'Must handle error cases gracefully',
  'Consider scalability requirements',
  'Need to optimize for mobile',
  'Should follow design guidelines',
  'Must be accessible',
  'Should be user-friendly',
  'Need to consider internationalization',
  'Must be maintainable',
  'Should be well-tested'
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

async function generateTasks() {
  console.log('Starting to generate tasks...')
  
  const tasks = []
  const now = new Date()
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  
  for (let i = 0; i < 95; i++) {
    const createdAt = getRandomDate(startDate, now)
    const dueDate = Math.random() > 0.3 ? getRandomDate(createdAt, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) : null
    const status = getRandomElement(statuses)
    const completedAt = status === 'DONE' ? getRandomDate(createdAt, now) : null
    
    tasks.push({
      userId,
      title: `${getRandomElement(taskTitles)} ${i + 1}`,
      notes: Math.random() > 0.5 ? getRandomElement(taskNotes) : null,
      estimatedPomodoros: Math.random() > 0.3 ? Math.floor(Math.random() * 8) + 1 : null,
      status,
      createdAt,
      completedAt,
      dueDate,
      position: i
    })
  }

  try {
    await prisma.task.createMany({
      data: tasks
    })
    console.log('Successfully generated 95 tasks!')
  } catch (error) {
    console.error('Error generating tasks:', error)
  } finally {
    await prisma.$disconnect()
  }
}

generateTasks() 