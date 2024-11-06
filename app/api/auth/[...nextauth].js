import NextAuth from 'next-auth'
import { AzureADProvider } from 'next-auth/providers/azure-ad'

export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID, // Get from Azure portal
      tenantId: process.env.AZURE_AD_B2C_TENANT_ID, // Get from Azure portal
      primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW, // Your signup/signin flow
      authorization: {
        params: {
          scope: 'openid email profile offline_access' // Adjust scopes as needed
        }
      },
      idToken: true // Important for access to user info
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token; // Store the ID token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;  // Make user info available in the session
      session.accessToken = token.accessToken; // Access token for API calls
      session.idToken = token.idToken // Access id token for user information
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET, // Set in .env.local (see below)
  debug: true, // Enable for helpful debugging output
}

export default NextAuth(authOptions);