import { useRouter } from 'vue-router'

export const useSubscription = () => {
  const router = useRouter()

  const checkSubscription = async () => {
    // TODO: Implement subscription check
    return true
  }

  return {
    checkSubscription
  }
} 