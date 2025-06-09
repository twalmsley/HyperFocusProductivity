import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY : '')

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: process.env.NUXT_AUTH_SECRET,
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // @ts-expect-error Use .default here for it to work during SSR.
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    /* on before signin */
    async signIn({ user, account, profile }) {
      // Check if the user has an email
      if (!user.email) {
        return false
      }
      // Check the user is already in the database and if not, create a new user
      const email = user.email as string;
      const name = user.name as string;

      var userInDatabase = await prisma.user.findUnique({
        where: {
          email: email
        }
      })
      if (!userInDatabase) {
        userInDatabase = await prisma.user.create({
          data: {
            email: email,
            name: name,
          }
        })
      }
      // Check for a subscription and if not, create a new subscription for a free trial
      const subscription = await prisma.userSubscription.findUnique({
        where: {
          userId: userInDatabase.id
        }
      })
      if (!subscription) {
        const customer = await stripe.customers.create({ email: user.email })

        const newSubscription = await prisma.userSubscription.create({
          data: {
            userId: userInDatabase.id,
            status: 'FREE_TRIAL',
            type: 'MONTHLY',
            stripeCustomerId: customer.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            freeTrialExpiresAt: new Date(new Date().setDate(new Date().getDate() + 14))
          }
        })
      } else if (subscription.status === 'FREE_TRIAL' && subscription.freeTrialExpiresAt < new Date()) {
        await prisma.userSubscription.update({
          where: {
            id: subscription.id
          },
          data: {
            status: 'EXPIRED'
          }
        })
      }
      return true
    },
    /* on redirect to another url */
    async redirect({ url, baseUrl }) {
      return url
    },
    /* on session retrieval */
    async session({ session, token }) {
      const userId = token.sub;
      const subscriptionState = token.subscriptionState;
      const freeTrialExpiresAt = token.freeTrialExpiresAt;

      const result = {
        ...session,
        user: {
          ...session.user,
          id: userId
        },
        subscriptionState: subscriptionState,
        freeTrialExpiresAt: freeTrialExpiresAt,
        blocked: token.blocked
      }
      return result
    },
    /* on JWT token creation or mutation */
    async jwt({ token, user, account, profile, isNewUser }) {
      const userInDatabase = await prisma.user.findUnique({
        where: {
          email: token.email as string
        }
      })
      const subscription = await prisma.userSubscription.findUnique({
        where: {
          userId: userInDatabase?.id
        }
      })
      token.sub = userInDatabase?.id;
      token.subscriptionState = subscription?.status
      token.freeTrialExpiresAt = subscription?.freeTrialExpiresAt
      token.blocked = subscription?.status !== 'FREE_TRIAL' && subscription?.status !== 'ACTIVE'
      return token
    }
  }
})