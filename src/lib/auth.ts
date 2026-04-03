import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getServiceSupabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 }, // 24 hours — stolen tokens expire rather than living forever
  jwt: { maxAge: 24 * 60 * 60 }, // 24 hours
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

        // Check owner account — owner bypasses MFA (hardcoded credential)
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
    async jwt({ token, user, trigger, session: updatedSession }) {
      if (user) {
        token.id = user.id;
        token.role = "user";
        token.subscriptionTier = "free";
        token.mfaPending = false;
        // Stamp token issuance time on fresh sign-in
        token.iat = Math.floor(Date.now() / 1000);
      }

      // Client called update({ mfaPending: false }) after successful MFA verify
      if (trigger === "update" && updatedSession?.mfaPending === false) {
        token.mfaPending = false;
      }

      // Rotate token timestamp every hour so clients must re-verify
      const tokenAge = Math.floor(Date.now() / 1000) - ((token.iat as number) ?? 0);
      if (tokenAge > 3600) {
        token.iat = Math.floor(Date.now() / 1000);
      }

      // Owner bypasses MFA — hardcoded credential account
      if (token.email === process.env.OWNER_EMAIL) {
        token.role = "owner";
        token.subscriptionTier = "premium";
        token.mfaPending = false;
        return token;
      }

      // Refresh from DB — on fresh login also check mfa_enabled
      if (token.id && token.id !== "owner") {
        try {
          const supabase = getServiceSupabase();
          const { data } = await supabase
            .from("profiles")
            .select("subscription_tier, role, mfa_enabled")
            .eq("id", token.id as string)
            .single();
          if (data) {
            token.subscriptionTier = data.subscription_tier ?? "free";
            token.role = data.role ?? "user";
            // Only set mfaPending on fresh login (user object present).
            // If the token already has mfaPending=false it means the user
            // already passed MFA this session — do not re-gate them.
            if (user && data.mfa_enabled) {
              token.mfaPending = true;
            }
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
        (session.user as Record<string, unknown>).mfaPending =
          (token.mfaPending as boolean) ?? false;
      }
      return session;
    },
  },
};
