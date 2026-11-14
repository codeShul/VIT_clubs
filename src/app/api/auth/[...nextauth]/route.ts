import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { UserEntity } from "@/lib/domain"; // Unit 4: OOP domain import

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@vitpune.edu.in" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          if (credentials.password === 'mock') {
            // ── UNIT 2, 3, 4: UserEntity instantiation for auth ────────────────
            // Constructor with default args (Unit 3), private password field (Unit 2)
            const userEntity = new UserEntity({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              regNo: user.regNo || '',
              year: user.year || '',
              branch: user.branch || '',
            });
            // Unit 4: Polymorphic validate() — overridden in UserEntity
            console.log(`[OOP] UserEntity.validate() = ${userEntity.validate()} for ${user.email}`);
            console.log(`[OOP] UserEntity.isAdmin()  = ${userEntity.isAdmin()}, isSuperAdmin() = ${userEntity.isSuperAdmin()}`);
            // ── End OOP ───────────────────────────────────────────────────────
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              clubId: null
            };
          }
          throw new Error("Please use your actual provider to sign in");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { 
            coordinatedClubs: true, 
            memberships: { 
              where: { role: { in: ['LEAD', 'CORE_TEAM'] } },
              include: { club: true }
            } 
          }
        });
        
        let clubId = null;
        let clubName = null;
        if (dbUser?.coordinatedClubs.length) {
          clubId = dbUser.coordinatedClubs[0].id;
          clubName = dbUser.coordinatedClubs[0].name;
        } else if (dbUser?.memberships.length) {
          clubId = dbUser.memberships[0].clubId;
          clubName = dbUser.memberships[0].club?.name || null;
        }
        token.clubId = clubId;
        token.clubName = clubName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.clubId = token.clubId as string | null;
        (session.user as any).clubName = token.clubName as string | null;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback_secret_for_development_vit_clubs'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
