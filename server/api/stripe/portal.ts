import Stripe from 'stripe'
import { getServerSession } from '#auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY : '')

const baseUrl = process.env.APP_URL ? process.env.APP_URL : ''

export default eventHandler(async event => {
  const session = await getServerSession(event)

  if (!session?.user?.email) {
    return { error: 'User not authenticated' }
  }

  const userSubscription = await prisma.userSubscription.findFirst({
    where: {
      user: {
        email: session.user.email,
      },
    },
  })

  if (!userSubscription?.stripeCustomerId) {
    return { error: 'Stripe customer not found' }
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: userSubscription.stripeCustomerId,
    return_url: `${baseUrl}/app/subscription`,
  })

  return { url: portalSession.url }
})