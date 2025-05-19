import { useAuth } from './useAuth'
import { useRouter } from 'vue-router'

export const useSubscription = () => {
  const { user, fetchUser } = useAuth()
  const router = useRouter()

  const checkSubscription = async () => {
    try {
      // Fetch fresh user data including subscription
      await fetchUser()
      
      if (!user.value?.subscription) {
        router.push('/app/subscription')
        return false
      }

      const subscription = user.value.subscription
      const now = new Date()

      // Check if subscription has expired
      if (
        subscription.status === 'EXPIRED' ||
        subscription.status === 'CANCELED' ||
        subscription.status === 'PAST_DUE' ||
        (subscription.status === 'FREE_TRIAL' && new Date(subscription.freeTrialExpiresAt) < now) ||
        (subscription.status === 'ACTIVE' && subscription.currentPeriodEnd && new Date(subscription.currentPeriodEnd) < now)
      ) {
        router.push('/app/subscription')
        return false
      }

      return true
    } catch (error) {
      console.error('Error checking subscription:', error)
      router.push('/app/subscription')
      return false
    }
  }

  return {
    checkSubscription
  }
} 