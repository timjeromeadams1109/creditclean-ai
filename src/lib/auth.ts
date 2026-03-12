import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getServiceSupabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Check owner account
        const ownerEmail = process.env.OWNER_EMAIL;
        const ownerPassword = process.env.OWNER_PASSWORD;
        if (ownerEmail && ownerPassword && credentials.email === ownerEmail) {
          const isHash = ownerPassword.startsWith("$2");
          const valid = isHash
            ? await compare(credentials.password, ownerPassword)
            : credentials.password === ownerPassword;
          if (valid) {
            return { id: "owner", name: "Owner", email: ownerEmail };
          }
        }

        // Check database
        try {
          const supabase = getServiceSupabase();
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, email, full_name, password_hash, role")
            .eq("email", credentials.email.toLowerCase())
            .single();

          if (profile?.password_hash) {
            const valid = await compare(credentials.password, profile.password_hash);
            if (valid) {
              return { id: profile.id, name: profile.full_name ?? profile.email, email: profile.email };
            }
          }
        } catch { /* fall through */ }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "user";
        token.subscriptionTier = "free";
      }

      // Owner role
      if (token.email === process.env.OWNER_EMAIL) {
        token.role = "owner";
        token.subscriptionTier = "premium";
        return token;
      }

      // Refresh from DB
      if (token.id && token.id !== "owner") {
        try {
          const supabase = getServiceSupabase();
          const { data } = await supabase
            .from("profiles")
            .select("subscription_tier, role")
            .eq("id", token.id)
            .single();
          if (data) {
            token.subscriptionTier = data.subscription_tier ?? "free";
            token.role = data.role ?? "user";
          }
        } catch { /* keep existing */ }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
        (session.user as Record<string, unknown>).role = token.role;
        (session.user as Record<string, unknown>).subscriptionTier = token.subscriptionTier;
      }
      return session;
    },
  },
};
