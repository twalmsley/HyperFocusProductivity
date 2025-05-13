import { PrismaClient, TaskStatus } from '@prisma/client'

const prisma = new PrismaClient()

const userId = 'd7553963-0af2-4a35-841c-d6c3dddccd06'

const statuses: TaskStatus[] = ['BACKLOG', 'IN_PROGRESS', 'DONE']
const taskTitles = [
  'Implement user authentication',
  'Design database schema',
  'Create API endpoints',
  'Write unit tests',
  'Fix bug in login flow',
  'Optimize database queries',
  'Add error handling',
  'Update documentation',
  'Refactor legacy code',
  'Implement caching',
  'Add logging system',
  'Create deployment pipeline',
  'Set up monitoring',
  'Implement rate limiting',
  'Add data validation',
  'Create backup system',
  'Optimize image loading',
  'Implement search functionality',
  'Add user preferences',
  'Create admin dashboard'
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
  'Should follow design guidelines'
]

function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

async function seedTasks() {
  console.log('Starting to seed tasks...')
  
  const tasks = []
  const now = new Date()
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  
  for (let i = 0; i < 220; i++) {
    const createdAt = getRandomDate(startDate, now)
    const dueDate = Math.random() > 0.3 ? getRandomDate(createdAt, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) : null
    const status = getRandomElement(statuses)
    const completedAt = status === 'DONE' ? getRandomDate(createdAt, now) : null
    
    tasks.push({
      userId,
      title: `${getRandomElement(taskTitles)} ${i + 1}`,
      notes: Math.random() > 0.5 ? getRandomElement(taskNotes) : null,
      estimatedPomodoros: Math.random() > 0.3 ? Math.floor(Math.random() * 8) + 1 : null,
      completedPomodoros: 0,
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
    console.log('Successfully seeded 220 tasks!')
  } catch (error) {
    console.error('Error seeding tasks:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTasks() 