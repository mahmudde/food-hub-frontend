import { createAuthClient } from "better-auth/react";

interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  user: {
    additionalFields: {
      role: { type: "string" },
      status: { type: "string" },
    },
  },
  basePath: "/api/v1/auth",
});

export const useSession = authClient.useSession as unknown as () => {
  data: AuthSession | null;
  isPending: boolean;
  error: Error | null;
};

export const { signIn, signUp, signOut } = authClient;
