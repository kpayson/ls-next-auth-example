import NextAuth, { NextAuthOptions } from "next-auth"
import { useSession } from "next-auth/react"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"
import { config } from '../../../middleware';
//  import log from "logging-service"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {


  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains

    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    // }),
    // Auth0Provider({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),

  //   {
  //     //authority: 'https://a-ci.labshare.org/_api/auth/ls',
  //     clientId: '07a0ae3f-1ad0-4517-b849-ffce53889459',
  //     //redirect_uri: 'https://localhost:4200/auth-callback',
      
  //     redirect_uri: 'https://localhost:4200',
  //     post_logout_redirect_uri: 'https://localhost:4200',
  //     response_type: "code",
  //     RequirePkce : true,
  //     scope: "openid profile api1",
  //     filterProtocolClaims: true,
  //     loadUserInfo: true,
  //     automaticSilentRenew: true,
  //     flowDescription: "PKCE"
  // }

  // {
  //   id: "lsauth",
  //   name: "Labshare Auth Wellknown",
  //   type: "oauth",
  //   wellKnown: 'http://localhost:7007/_api/auth/ls/.well-known/openid-configuration',
  //   authorization: { params: { scope: "openid email profile" } },
  //   idToken: true,
  //   checks: ["pkce", "state"],
  //   profile(profile) {
  //     return {
  //       id: profile.sub,
  //       name: profile.name,
  //       email: profile.email,
  //       image: profile.picture,
  //     }
  //   },
  // },
  // http://localhost:7007/auth/ls/
  {
    id: "lsauth",
    name: "Labshare Auth",
    type: "oauth",
    clientId: "nextjs-demo",
    authorization: "http://localhost:7007/_api/auth/ls/authorize",
    token: "http://localhost:7007/_api/auth/ls/oidc/token",
    userinfo: "http://localhost:7007/_api/auth/ls/me",
    
    //options:{}

    
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
  }


  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
    ,
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = (token.accessToken || '') as string
      return session
    }
  },


  debug:true,
  // logger: {
  //   error(code, metadata) {
  //     log.error(code, metadata)
  //   },
  //   warn(code) {
  //     log.warn(code)
  //   },
  //   debug(code, metadata) {
  //     log.debug(code, metadata)
  //   }
  // }
}

export default NextAuth(authOptions)

// openId: {
//   type: 'openIdConnect',
//   openIdConnectUrl: `${configuration.rest.basePath}/auth/{tenant}/.well-known/openid-configuration`
// }
