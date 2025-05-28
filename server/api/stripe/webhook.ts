import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY : '')
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ? process.env.STRIPE_WEBHOOK_SECRET : ''

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event)
  const signature = getHeader(event, 'stripe-signature')
  let stripeEvent: any = body
  let subscription: any
  let status: any

  if (!body) {
    return { error: 'Invalid request body' }
  }

  if (!signature) {
    return { error: 'Invalid stripe-signature' }
  }

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch (err) {
    const error = createError({
      statusCode: 400,
      statusMessage: `Webhook error: ${err}`,
    })
    return sendError(event, error)
  }

  switch (stripeEvent.type) {
    case 'customer.subscription.deleted':
      subscription = stripeEvent.data.object

      await prisma.userSubscription.update({
        where: {
          stripeCustomerId: subscription.customer,
        },
        data: {
          status: 'CANCELED',
          planId: null,
        },
      })

      break
    case 'customer.subscription.created':
      subscription = stripeEvent.data.object
      status = subscription.status

      const lookupKey = subscription.items.data[0].price.lookup_key
      const type = lookupKey.includes('monthly') ? 'MONTHLY' : 'YEARLY'

      await prisma.userSubscription.update({
        where: {
          stripeCustomerId: subscription.customer,
        },
        data: {
          status: 'ACTIVE',
          planId: lookupKey,
          type: type,
        },
      })

      break
    default:
      console.log(`Unhandled event type ${stripeEvent.type}.`)
  }
  return { received: true }
})