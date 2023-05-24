import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import LabshareProvider from "./labshareProvider";

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

    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
    async session({ session, token }) {
      session.error = token.error
      return session
    },
  },

  debug:true,

  session: { strategy: "jwt" },
  
}

export default NextAuth(authOptions)

