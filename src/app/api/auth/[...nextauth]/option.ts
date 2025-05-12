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
  pages:{
    signIn: '/sign-in'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}