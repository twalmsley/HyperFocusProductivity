import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: process.env.NUXT_AUTH_SECRET,
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  ],
  callbacks: {
    /* on before signin */
    async signIn({ user, account, profile }) {
      // Check the user is already in the database
      const email = user.email as string;
      const name = user.name as string;

      const userInDatabase = await prisma.user.findUnique({
        where: {
          email: email
        }
      })
      if (!userInDatabase) {
        const newUser = await prisma.user.create({
          data: {
            email: email,
            name: name,
          }
        })
      }
      return true
    },
    /* on redirect to another url */
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    /* on session retrieval */
    async session({ session, token }) {
      const userId = token.sub;

      const result = {
        ...session,
        user: {
          ...session.user,
          id: userId
        }
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
    token.sub = userInDatabase?.id;
    return token
  }
}
})