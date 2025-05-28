import Stripe from 'stripe'
import { getServerSession } from '#auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY : '')
const baseUrl = process.env.APP_URL ? process.env.APP_URL : ''

export default eventHandler(async event => {
  const { lookup_key } = await readBody(event)
  const authSession = await getServerSession(event)

  if (authSession && authSession.user?.email) {
    const account = await prisma.userSubscription.findFirst({
      where: {
        user: {
          email: authSession.user.email,
        },
      },
    })

    if (account && account.stripeCustomerId && account.status !== 'ACTIVE') {
      const prices = await stripe.prices.list({
        lookup_keys: [lookup_key],
        expand: ['data.product'],
      })

      const session = await stripe.checkout.sessions.create({
        customer: account.stripeCustomerId,
        billing_address_collection: 'auto',
        line_items: [
          {
            price: prices.data[0].id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/stripe/success`,
        cancel_url: `${baseUrl}/stripe/cancelled`,
      })

      if (session.url) {
        return { url: session.url }
      }
    }
  }
})