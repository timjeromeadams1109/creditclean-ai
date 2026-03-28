# CreditClean AI — Claude Code Context

## What This Is
An AI-powered credit repair and financial guidance platform with mobile app support via Capacitor.

## Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: Supabase (client SDK)
- **Auth**: NextAuth v4, bcrypt
- **Payments**: Stripe
- **Mobile**: Capacitor 8 (iOS/Android hybrid)
- **Export**: React PDF
- **Email**: Resend
- **Styling**: Tailwind CSS v4, Framer Motion, CVA, Lucide icons
- **Validation**: Zod
- **Monitoring**: Sentry (client, server, edge)
- **Hosting**: Vercel (web), Capacitor (mobile)

## Rules for This Repo
- Run `npm install` before making changes
- Has quality gate scripts: `npm run security`, `npm run audit`, `npm run quality-gate`
- Capacitor changes require rebuilding native projects — test on web first
- Zod validation on all API routes
- Supabase migrations in `supabase/` directory
- Never deploy without Tim's approval

## Maven Context
This is a Studio Tim product managed by the Maven agent system.
Operator: Tim Adams | Studio Tim
