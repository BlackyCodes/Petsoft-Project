import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs"; // Import the bcrypt module
import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validations";

const config = {
  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      //runs on every login
      async authorize(credentials) {
        const validatedFormData = authSchema.safeParse(credentials);

        if (!validatedFormData.success) {
          return null;
        }

        const { email, password } = validatedFormData.data;
        const user = await getUserByEmail(email);

        if (!user) {
          console.log("no user found");
          return null;
        }
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordMatch) {
          console.log("Invalid Credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    //runs on every request with middleware
    authorized: ({ request, auth }) => {
      const isLoggedIn = !!auth?.user;
      const isTryingToAccesApp = request.nextUrl.pathname.includes("/app");
      if (!isLoggedIn && isTryingToAccesApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAccesApp && !auth?.user.hasAccess) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }

      if (isLoggedIn && isTryingToAccesApp && auth?.user.hasAccess) {
        return true;
      }
      if(isLoggedIn && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname.includes("/signup") ) && auth?.user.hasAccess){
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if (isLoggedIn && !isTryingToAccesApp && !auth?.user.hasAccess) {
        if (
            (   request.nextUrl.pathname === "/login" ||
                request.nextUrl.pathname.includes("/signup")) 
       
        ) {
          return Response.redirect(new URL("/payment", request.nextUrl));
        }

        return true;
      }

      if (!isLoggedIn && !isTryingToAccesApp) {
        return true;
      }

      return false;
    },
    jwt: async ({ token, user,trigger }) => {
      if (user) {
        // on sign in
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      if(trigger === "update"){
   const userFromDb =   await getUserByEmail(token.email)
   if(userFromDb){
      token.hasAccess = userFromDb.hasAccess
   }

     
      }
      return token;
    },
    session: async ({ session, token }) => {
   
        session.user.id = token.userId;
        session.user.hasAccess = token.hasAccess;
  
      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
