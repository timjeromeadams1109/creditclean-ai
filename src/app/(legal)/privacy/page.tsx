import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — CreditClean AI",
  description:
    "Privacy Policy for CreditClean AI. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Effective Date: March 11, 2026
      </p>

      {/* Table of Contents */}
      <nav className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Table of Contents
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-blue-600 dark:text-blue-400">
          <li><a href="#info-collect" className="hover:underline">Information We Collect</a></li>
          <li><a href="#info-use" className="hover:underline">How We Use Your Information</a></li>
          <li><a href="#info-not-collect" className="hover:underline">Information We Do NOT Collect</a></li>
          <li><a href="#data-security" className="hover:underline">Data Storage &amp; Security</a></li>
          <li><a href="#data-sharing" className="hover:underline">Data Sharing</a></li>
          <li><a href="#data-retention" className="hover:underline">Data Retention</a></li>
          <li><a href="#your-rights" className="hover:underline">Your Rights</a></li>
          <li><a href="#ccpa" className="hover:underline">California Privacy Rights (CCPA)</a></li>
          <li><a href="#children" className="hover:underline">Children&apos;s Privacy</a></li>
          <li><a href="#cookies" className="hover:underline">Cookies</a></li>
          <li><a href="#changes" className="hover:underline">Changes to This Policy</a></li>
          <li><a href="#contact" className="hover:underline">Contact</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        {/* 1. Info We Collect */}
        <section id="info-collect">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            1. Information We Collect
          </h2>
          <p className="mt-3">
            We collect the following categories of information when you use
            CreditClean AI:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Account information:</strong>{" "}
              Name, email address, and password (hashed).
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Credit report data you enter:</strong>{" "}
              Negative items, account names, balances, dates, and bureau
              information that you manually input into the platform.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Dispute history:</strong>{" "}
              Letters generated, dispute rounds, response tracking, and
              escalation status.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Score tracking data:</strong>{" "}
              Credit scores you manually enter for progress monitoring.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Usage analytics:</strong>{" "}
              Pages visited, features used, and session duration (no
              personally identifiable information is included in analytics).
            </li>
          </ul>
        </section>

        {/* 2. How We Use Info */}
        <section id="info-use">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            2. How We Use Your Information
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>To provide and operate the Service, including generating dispute letters;</li>
            <li>To track your credit repair progress and provide personalized recommendations;</li>
            <li>To improve the platform and develop new features;</li>
            <li>To communicate with you about your account and service updates;</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        {/* 3. Info We Do NOT Collect */}
        <section id="info-not-collect">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            3. Information We Do NOT Collect
          </h2>
          <p className="mt-3">
            CreditClean AI is designed to minimize the sensitive data we handle:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Full Social Security Numbers:</strong>{" "}
              We only store the last 4 digits if you choose to include them for
              letter personalization.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Credit card numbers:</strong>{" "}
              All payment processing is handled by Stripe. We never see or store
              your full credit card information.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Actual credit reports:</strong>{" "}
              You manually enter individual items. We do not pull, import, or
              store full credit reports.
            </li>
          </ul>
        </section>

        {/* 4. Data Security */}
        <section id="data-security">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            4. Data Storage &amp; Security
          </h2>
          <p className="mt-3">We take the security of your data seriously:</p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Encryption in transit:</strong>{" "}
              All data transmitted between your browser and our servers is
              encrypted using 256-bit TLS (HTTPS).
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Encryption at rest:</strong>{" "}
              Data stored in our database is encrypted using AES-256.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Hosting:</strong>{" "}
              Our database is hosted on Supabase, which is SOC 2 Type II
              compliant.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Data residency:</strong>{" "}
              All data is stored in data centers located within the United
              States.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Authentication:</strong>{" "}
              Passwords are hashed using bcrypt with appropriate salt rounds.
            </li>
          </ul>
        </section>

        {/* 5. Data Sharing */}
        <section id="data-sharing">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            5. Data Sharing
          </h2>
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            We do NOT sell your personal data. We never have and we never will.
          </p>
          <p className="mt-3">
            We share data only with the following service providers, solely for the
            purpose of operating the Service:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Stripe:</strong>{" "}
              Payment processing only. Stripe&apos;s privacy policy governs
              their handling of your payment data.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Supabase:</strong>{" "}
              Database hosting and authentication services.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Vercel:</strong>{" "}
              Application hosting and content delivery.
            </li>
          </ul>
          <p className="mt-3">
            We may also disclose your information if required to do so by law, court
            order, or governmental regulation, or if we believe disclosure is
            necessary to protect our rights, your safety, or the safety of others.
          </p>
        </section>

        {/* 6. Data Retention */}
        <section id="data-retention">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            6. Data Retention
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Active accounts:</strong>{" "}
              Your data is retained for as long as your account remains active.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Account deletion:</strong>{" "}
              Upon receiving a deletion request, all personal data and credit
              report data will be permanently and irreversibly deleted within 30
              calendar days.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Inactive accounts:</strong>{" "}
              Accounts with no activity for 24 months may be flagged for
              deletion. We will notify you before taking action.
            </li>
          </ul>
        </section>

        {/* 7. Your Rights */}
        <section id="your-rights">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            7. Your Rights
          </h2>
          <p className="mt-3">You have the right to:</p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Access</strong>{" "}
              your personal data and request a copy of the information we hold
              about you;
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Correct</strong>{" "}
              any inaccurate or incomplete personal data;
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Delete</strong>{" "}
              your account and all associated data;
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Export</strong>{" "}
              your data in a machine-readable format;
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Opt out</strong>{" "}
              of marketing communications at any time.
            </li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:privacy@creditclean.ai"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              privacy@creditclean.ai
            </a>
            . We will respond to all requests within 30 days.
          </p>
        </section>

        {/* 8. CCPA */}
        <section id="ccpa">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            8. California Privacy Rights (CCPA)
          </h2>
          <p className="mt-3">
            If you are a California resident, the California Consumer Privacy Act
            (CCPA) provides you with additional rights regarding your personal
            information, including:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              The right to know what personal information we collect, use, and
              disclose;
            </li>
            <li>
              The right to request deletion of your personal information;
            </li>
            <li>
              The right to opt out of the sale of your personal information (we
              do not sell personal information);
            </li>
            <li>
              The right to non-discrimination for exercising your privacy rights.
            </li>
          </ul>
          <p className="mt-3">
            To submit a CCPA request, contact us at{" "}
            <a
              href="mailto:privacy@creditclean.ai"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              privacy@creditclean.ai
            </a>{" "}
            with the subject line &ldquo;CCPA Request.&rdquo;
          </p>
        </section>

        {/* 9. Children */}
        <section id="children">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            9. Children&apos;s Privacy
          </h2>
          <p className="mt-3">
            CreditClean AI is not intended for use by individuals under the age of
            18. We do not knowingly collect personal information from children. If
            you believe we have inadvertently collected information from a minor,
            please contact us immediately and we will delete such information.
          </p>
        </section>

        {/* 10. Cookies */}
        <section id="cookies">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            10. Cookies
          </h2>
          <p className="mt-3">
            CreditClean AI uses only essential cookies required for the proper
            functioning of the Service:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Session cookies:</strong>{" "}
              Used to maintain your authenticated session.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Authentication cookies:</strong>{" "}
              Used to verify your identity and keep you logged in.
            </li>
          </ul>
          <p className="mt-3">
            We do not use tracking cookies, advertising cookies, or third-party
            analytics cookies. We do not participate in cross-site tracking.
          </p>
        </section>

        {/* 11. Changes */}
        <section id="changes">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            11. Changes to This Policy
          </h2>
          <p className="mt-3">
            We may update this Privacy Policy from time to time. When we make
            material changes, we will notify you by email and/or by posting a
            prominent notice on the Service. The &ldquo;Effective Date&rdquo; at the
            top of this page will be updated accordingly.
          </p>
        </section>

        {/* 12. Contact */}
        <section id="contact">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            12. Contact
          </h2>
          <p className="mt-3">
            If you have any questions about this Privacy Policy or how we handle
            your data, please contact us at{" "}
            <a
              href="mailto:privacy@creditclean.ai"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              privacy@creditclean.ai
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
