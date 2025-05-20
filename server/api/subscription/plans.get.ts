import type { SubscriptionType } from '~/server/types'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  type: SubscriptionType
  features: string[]
  isPopular?: boolean
}

export default defineEventHandler(async (event) => {
  // In a real application, these would come from a database
  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Perfect for individual users',
      price: 5,
      type: 'MONTHLY',
      features: [
        'Unlimited Pomodoro sessions',
        'Advanced task management',
        'Basic productivity analytics',
        'Email support'
      ],
      isPopular: true
    },
    {
      id: 'premium',
      name: 'Premium Plan - Coming Soon!',
      description: 'For power users who want it all',
      price: 10,
      type: 'MONTHLY',
      features: [
        'Everything in Basic',
        'Advanced analytics and insights',
        'Team collaboration features',
        'Priority support',
        'Early access to new features'
      ]
    }
  ]

  return plans
}) 