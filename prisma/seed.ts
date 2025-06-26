import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // First, let's get or create a test user
  let user = await prisma.user.findFirst({
    where: {
      email: 'tony@aosd.co.uk'
    }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'tony@aosd.co.uk',
        name: 'Test User',
      }
    })
    console.log('Created test user:', user.email)
  }

  // Sample journal entries for April, May, and June
  const sampleEntries = [
    // April entries
    {
      title: 'Spring Cleaning Day',
      content: 'Started my spring cleaning today. Organized the garage and decluttered the living room. Feeling productive and refreshed!',
      type: 'DAILY' as const,
      date: new Date('2025-04-05'),
      mood: 'HAPPY' as const,
      tags: ['cleaning', 'organization', 'spring'],
      templateUsed: null
    },
    {
      title: 'Workout Progress',
      content: 'Completed my 30-day fitness challenge! Lost 5 pounds and feeling stronger. Ready to set new goals for next month.',
      type: 'REVIEW' as const,
      date: new Date('2025-04-12'),
      mood: 'EXCITED' as const,
      tags: ['fitness', 'progress', 'achievement'],
      templateUsed: null
    },
    {
      title: 'Family Dinner',
      content: 'Had a wonderful family dinner tonight. Mom made her famous lasagna and we all shared stories from the week. These moments are precious.',
      type: 'FREEFORM' as const,
      date: new Date('2025-04-18'),
      mood: 'HAPPY' as const,
      tags: ['family', 'dinner', 'memories'],
      templateUsed: null
    },
    {
      title: 'Project Deadline Stress',
      content: 'Feeling overwhelmed with the upcoming project deadline. Need to break it down into smaller tasks and focus on one thing at a time.',
      type: 'DAILY' as const,
      date: new Date('2025-04-25'),
      mood: 'ANGRY' as const,
      tags: ['work', 'stress', 'deadline'],
      templateUsed: null
    },

    // May entries
    {
      title: 'Garden Planting',
      content: 'Planted tomatoes, basil, and peppers in the garden today. The soil feels perfect and I can already imagine the fresh vegetables this summer.',
      type: 'DAILY' as const,
      date: new Date('2025-05-03'),
      mood: 'EXCITED' as const,
      tags: ['garden', 'plants', 'summer'],
      templateUsed: null
    },
    {
      title: 'Book Club Discussion',
      content: 'Great discussion at book club tonight about "The Midnight Library". Everyone had different perspectives on the choices we make in life.',
      type: 'FREEFORM' as const,
      date: new Date('2025-05-10'),
      mood: 'NEUTRAL' as const,
      tags: ['books', 'discussion', 'friends'],
      templateUsed: null
    },
    {
      title: 'Career Reflection',
      content: 'Been thinking about my career path lately. Feeling stuck in my current role but unsure about what direction to take next. Need to explore my options.',
      type: 'REVIEW' as const,
      date: new Date('2025-05-17'),
      mood: 'SAD' as const,
      tags: ['career', 'reflection', 'future'],
      templateUsed: null
    },
    {
      title: 'Weekend Hike',
      content: 'Amazing hike in the mountains today! The wildflowers are in full bloom and the views were breathtaking. Perfect weather and great company.',
      type: 'DAILY' as const,
      date: new Date('2025-05-24'),
      mood: 'HAPPY' as const,
      tags: ['hiking', 'nature', 'weekend'],
      templateUsed: null
    },
    {
      title: 'Cooking Experiment',
      content: 'Tried making homemade pasta for the first time. It was a bit messy but turned out delicious! Will definitely try again with different recipes.',
      type: 'FREEFORM' as const,
      date: new Date('2025-05-30'),
      mood: 'EXCITED' as const,
      tags: ['cooking', 'pasta', 'experiment'],
      templateUsed: null
    },

    // June entries
    {
      title: 'Summer Vacation Planning',
      content: 'Started planning our summer vacation to the beach. Looking at different destinations and trying to find the perfect balance of relaxation and adventure.',
      type: 'DAILY' as const,
      date: new Date('2025-06-07'),
      mood: 'EXCITED' as const,
      tags: ['vacation', 'planning', 'summer'],
      templateUsed: null
    },
    {
      title: 'Work Presentation Success',
      content: 'Nailed my presentation at work today! The team was impressed with the new strategy and I received great feedback from the management.',
      type: 'DAILY' as const,
      date: new Date('2025-06-14'),
      mood: 'HAPPY' as const,
      tags: ['work', 'success', 'presentation'],
      templateUsed: null
    },
    {
      title: 'Learning New Skill',
      content: 'Started learning to play the guitar today. My fingers are sore but I can already play a few basic chords. Looking forward to practicing more.',
      type: 'FREEFORM' as const,
      date: new Date('2025-06-21'),
      mood: 'NEUTRAL' as const,
      tags: ['music', 'learning', 'guitar'],
      templateUsed: null
    },
    {
      title: 'Mid-Year Review',
      content: 'Halfway through the year already! Looking back at my goals from January - some achieved, some need more work. Time to adjust and refocus.',
      type: 'REVIEW' as const,
      date: new Date('2025-06-28'),
      mood: 'NEUTRAL' as const,
      tags: ['review', 'goals', 'mid-year'],
      templateUsed: null
    }
  ]

  // Create the journal entries
  for (const entry of sampleEntries) {
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        userId: user.id,
        title: entry.title,
        date: entry.date
      }
    })

    if (!existingEntry) {
      await prisma.journalEntry.create({
        data: {
          userId: user.id,
          ...entry
        }
      })
      console.log(`Created journal entry: ${entry.title}`)
    } else {
      console.log(`Journal entry already exists: ${entry.title}`)
    }
  }

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 