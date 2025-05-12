export type SubscriptionStatus = 'FREE_TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED'
export type SubscriptionType = 'MONTHLY' | 'YEARLY'

export interface UserSubscription {
  id: string
  userId: string
  status: SubscriptionStatus
  type?: SubscriptionType | null
  freeTrialExpiresAt: Date
  currentPeriodStart?: Date | null
  currentPeriodEnd?: Date | null
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string | null
  password: string
  createdAt: Date
  proStatus: boolean
  subscription?: UserSubscription | null
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  user: User
} 