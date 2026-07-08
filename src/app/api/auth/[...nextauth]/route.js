import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    // ==========================================
    // GOOGLE LOGIN
    // ==========================================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ==========================================
    // EMAIL + PASSWORD LOGIN
    // ==========================================
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
          throw new Error("Email and password are required");
        }

        const email = credentials.email
          .toLowerCase()
          .trim();

        const client = await clientPromise;

        // IMPORTANT:
        // MongoDB Adapter default database
        const db = client.db();

        const user = await db.collection("users").findOne({
          email,
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Google-created users may not have password
        if (!user.password) {
          throw new Error(
            "This account uses Google login"
          );
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || null,
        };
      },
    }),
  ],

  // ==========================================
  // JWT SESSION
  // ==========================================
  session: {
    strategy: "jwt",
  },

  // ==========================================
  // CALLBACKS
  // ==========================================
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id || token.sub;
      }

      return session;
    },
  },

  // ==========================================
  // CUSTOM LOGIN PAGE
  // ==========================================
  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };