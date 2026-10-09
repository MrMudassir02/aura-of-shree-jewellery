import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: "customer" | "admin";
    isEmailVerified: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: "customer" | "admin";
      isEmailVerified: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "customer" | "admin";
    isEmailVerified: boolean;
  }
}
