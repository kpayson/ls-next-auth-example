import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import LabshareProvider from "./labshareProvider";
import { type TokenSet } from "@auth/core/types";

const tokenEndpoint = `${process.env.LABSHARE_BASEPATH}/auth/ls/oidc/token`;


// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {


  // https://next-auth.js.org/configuration/providers/oauth
  providers: [

    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),

    LabshareProvider({
      clientId: process.env.LABSHARE_ID!,
      clientSecret: process.env.LABSHARE_SECRET!,
      issuer: process.env.LABSHARE_ISSUER,
    }),

  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {

    async jwt({ token, account }) {

      if (account) {
        // Save the access token and refresh token in the JWT on the initial login

        //account.expires_at
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at, // Math.floor(Date.now() / 1000 + (account.expires_in as number)),
          refresh_token: account.refresh_token,
        }
      } 
      
      else if (Date.now() < (token.expires_at as number) * 1000) {
        // If the access token has not expired yet, return it
        return token
      } 
      else {

        try {

          const tokenEndpoint = `${process.env.LABSHARE_BASEPATH}/auth/ls/oidc/token`;
          const response = await fetch(tokenEndpoint, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.LABSHARE_ID,
              client_secret: process.env.LABSHARE_SECRET,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            } as any),
            method: "POST",
          })

          const tokens: TokenSet = await response.json()

          if (!response.ok) throw tokens

          return {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in!),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: tokens.refresh_token ?? token.refresh_token,
          }
        } catch (error) {
          console.error("Error refreshing access token", error)
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const }
        }
      }
    },
    async session({ session, token, user }) {


      if(new Date(session.expires) < new Date()) {

        const response = await fetch(tokenEndpoint, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.LABSHARE_ID,
            client_secret: process.env.LABSHARE_SECRET,
            grant_type: "refresh_token",
            refresh_token: token.refresh_token,
          } as any),
          method: "POST",
        });
  
        const tokens: TokenSet = await response.json();
  
        if (!response.ok) {throw tokens;}
      }

      //session.error = token.error
      return session
    },
  },

  debug:true,

  session: { strategy: "jwt" },
  
}

export default NextAuth(authOptions)
