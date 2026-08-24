import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// ============================================================================
// AUTH CONFIG
// Uses the Credentials provider against the user repository. Once Prisma can
// reach its engine binaries, back findUserByEmail with a real
// `prisma.user.findUnique(...)` call — see lib/data/repository.ts for the
// same swap pattern used elsewhere.
// ============================================================================

// Mock user store — replace with Prisma. Passwords are bcrypt-hashed even in
// the mock store so the auth flow is realistic end to end.
const mockUsers = [
  {
    id: "admin_1",
    name: "Studio Admin",
    email: "admin@penarchystudio.com",
    // password: "changeme123" — for local development only, rotate immediately
    passwordHash: "$2a$10$CwTycUXWue0Thq9StjUM0uJ8Y6nfvZzSy0Pzr1Sst8jT9LkA6P1Sy",
    role: "ADMIN" as const,
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = mockUsers.find((u) => u.email === email);
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash).catch(() => false);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { role?: string }).role =
          token.role as string;
      }
      return session;
    },
  },
});
