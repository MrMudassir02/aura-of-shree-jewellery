import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

import { checkRateLimit } from "@/lib/rate-limit";
import { authUseCases } from "@/server/use-cases/AuthUseCases";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  secret: authSecret,

  // NextAuth applies its secure cookie defaults in production.
  useSecureCookies: process.env.NODE_ENV === "production",

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },

  jwt: {
    maxAge: 8 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.trim().toLowerCase();

        // Persistent MongoDB-backed limit: 5 attempts per email per 15 minutes.
        const rateLimit = await checkRateLimit(
          `login:${normalizedEmail}`,
          5,
          15 * 60 * 1000,
        );

        if (!rateLimit.allowed) {
          return null;
        }

        const user = await authUseCases.validateCredentials(
          normalizedEmail,
          credentials.password,
        );

        if (!user) {
          return null;
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isEmailVerified = user.isEmailVerified;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "customer" | "admin";
        session.user.isEmailVerified = token.isEmailVerified as boolean;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
