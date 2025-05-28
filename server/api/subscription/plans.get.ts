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
      id: 'hyper-basic-yearly',
      name: 'Basic Plan',
      description: 'Perfect for individual users',
      price: 68,
      type: 'YEARLY',
      features: [
        'Unlimited Pomodoro sessions',
        'Advanced task management',
        'Basic productivity analytics',
        'Email support'
      ],
      isPopular: true
    },
    // {
    //   id: 'hyper-advanced-yearly',
    //   name: 'Advanced Plan - Coming Soon!',
    //   description: 'For power users who want it all',
    //   price: 112,
    //   type: 'YEARLY',
    //   features: [
    //     'Everything in Basic',
    //     'Advanced analytics and insights',
    //     'Team collaboration features',
    //     'Priority support',
    //     'Early access to new features'
    //   ]
    // },
    {
      id: 'hyper-basic-monthly',
      name: 'Basic Plan',
      description: 'Perfect for individual users',
      price: 7,
      type: 'MONTHLY',
      features: [
        'Unlimited Pomodoro sessions',
        'Advanced task management',
        'Basic productivity analytics',
        'Email support'
      ],
      isPopular: true
    },
    // {
    //   id: 'hyper-advanced-monthly',
    //   name: 'Advanced Plan - Coming Soon!',
    //   description: 'For power users who want it all',
    //   price: 14,
    //   type: 'MONTHLY',
    //   features: [
    //     'Everything in Basic',
    //     'Advanced analytics and insights',
    //     'Team collaboration features',
    //     'Priority support',
    //     'Early access to new features'
    //   ]
    // },
  ]

  return plans
}) 