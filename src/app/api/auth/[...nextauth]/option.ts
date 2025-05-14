import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/config/db.config";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter Email" },
        password: { label: "Password", type: "password", placeholder: "Enter Password" }
      },
      async authorize(credentials){
        try {
          if (!credentials || !credentials.email) {
            throw new Error("Email is required");
          }
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            }
          })
          if(!user){
            throw new Error("No user found with this email");
          }
          if(!user.isVerified){
            throw new Error("Please verify you account");
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if(isPasswordCorrect){
            return user;
          }
          else{
            throw new Error("Password is incorrect");
          }
        } catch (error: unknown) {
          throw new Error(error as string)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if(user){
        token.id = user.id?.toString();
        token.isVerified = user?.isVerified;
        token.isAcceptingMessage = user?.isAcceptingMessage;
        token.userName = user.userName
      }
      return token
    },

    async session({ session, token }) {
      if(token){
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.userName = token.userName;
      }

      return session
    }
  },
  pages:{
    signIn: '/sign-in'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}