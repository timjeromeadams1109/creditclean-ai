import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — CreditClean AI",
  description:
    "Refund and cancellation policy for CreditClean AI credit repair platform. CROA-compliant cancellation rights.",
};

export default function RefundPolicyPage() {
  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        Refund &amp; Cancellation Policy
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Effective Date: March 13, 2026
      </p>

      {/* CROA Notice */}
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/50">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          Your Right to Cancel Under Federal Law
        </p>
        <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
          Under the Credit Repair Organizations Act (CROA), 15 U.S.C. &sect;1679e, you
          have the right to cancel your contract with any credit repair organization
          within three (3) business days of signing, without penalty or obligation.
          This right cannot be waived.
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Table of Contents
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-blue-600 dark:text-blue-400">
          <li><a href="#croa-cancellation" className="hover:underline">CROA Right to Cancel</a></li>
          <li><a href="#free-tier" className="hover:underline">Free Tier</a></li>
          <li><a href="#paid-subscriptions" className="hover:underline">Paid Subscriptions</a></li>
          <li><a href="#refund-eligibility" className="hover:underline">Refund Eligibility</a></li>
          <li><a href="#how-to-cancel" className="hover:underline">How to Cancel</a></li>
          <li><a href="#refund-processing" className="hover:underline">Refund Processing</a></li>
          <li><a href="#non-refundable" className="hover:underline">Non-Refundable Items</a></li>
          <li><a href="#state-specific" className="hover:underline">State-Specific Rights</a></li>
          <li><a href="#no-guarantee" className="hover:underline">No Guarantee of Results</a></li>
          <li><a href="#dispute-resolution" className="hover:underline">Dispute Resolution</a></li>
          <li><a href="#contact" className="hover:underline">Contact</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        {/* 1. CROA Right to Cancel */}
        <section id="croa-cancellation">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            1. Your Right to Cancel Under CROA
          </h2>
          <p className="mt-3">
            The Credit Repair Organizations Act (15 U.S.C. &sect;1679 et seq.) provides
            you with the following non-waivable rights:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>Three-Day Cancellation Right:</strong> You may cancel your
              agreement with CreditClean AI within three (3) business days of
              enrollment, for any reason or no reason, and receive a full refund of
              any amounts paid. No explanation is required.
            </li>
            <li>
              <strong>No Upfront Payment for Unperformed Services:</strong> Under 15
              U.S.C. &sect;1679b(b), no credit repair organization may charge or
              receive any money or other valuable consideration for the performance
              of any service which the credit repair organization has agreed to
              perform before such service is fully performed. CreditClean AI
              complies with this requirement.
            </li>
            <li>
              <strong>Right to Sue:</strong> You have the right to sue a credit
              repair organization that violates CROA, and you may recover your
              actual damages, punitive damages, and attorney&apos;s fees.
            </li>
          </ul>
        </section>

        {/* 2. Free Tier */}
        <section id="free-tier">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            2. Free Tier
          </h2>
          <p className="mt-3">
            CreditClean AI offers a free tier that allows you to access basic
            features including credit report analysis and dispute letter generation.
            The free tier requires no payment and no refund applies. You have the
            right to dispute inaccurate items on your credit report yourself, at no
            cost, by contacting the credit bureaus directly under FCRA &sect;611 (15
            U.S.C. &sect;1681i).
          </p>
        </section>

        {/* 3. Paid Subscriptions */}
        <section id="paid-subscriptions">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            3. Paid Subscriptions
          </h2>
          <p className="mt-3">
            Paid subscription plans are billed on a monthly or annual basis through
            Stripe, our third-party payment processor. By subscribing to a paid
            plan, you authorize recurring charges at the agreed-upon interval until
            you cancel.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>Monthly Plans:</strong> Billed monthly. You may cancel at any
              time. Cancellation takes effect at the end of the current billing
              period. No partial-month refunds are issued.
            </li>
            <li>
              <strong>Annual Plans:</strong> Billed annually. You may cancel at any
              time. If you cancel within the first 30 days of an annual
              subscription, you are eligible for a full refund minus the prorated
              value of any services already rendered. After 30 days, no refund is
              available, but you retain access through the end of the paid period.
            </li>
          </ul>
        </section>

        {/* 4. Refund Eligibility */}
        <section id="refund-eligibility">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            4. Refund Eligibility
          </h2>
          <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/50">
            <p className="text-sm font-medium text-teal-900 dark:text-teal-200">
              Refund Summary
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-teal-800 dark:text-teal-300">
              <li>Within 3 business days of enrollment: Full refund (CROA right)</li>
              <li>Within 30 days of annual plan purchase: Full refund minus prorated services</li>
              <li>Monthly plan current billing period: No partial refund; access continues through period end</li>
              <li>Technical issues preventing service access: Prorated refund for affected period</li>
              <li>Duplicate charges or billing errors: Full refund of the erroneous charge</li>
            </ul>
          </div>
          <p className="mt-3">
            Refund requests are evaluated on a case-by-case basis. We strive to
            resolve all concerns fairly and promptly. If you believe you are
            entitled to a refund not covered above, please contact us and we will
            review your request.
          </p>
        </section>

        {/* 5. How to Cancel */}
        <section id="how-to-cancel">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            5. How to Cancel
          </h2>
          <p className="mt-3">
            You may cancel your subscription at any time using any of the following
            methods:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>In-App:</strong> Navigate to Settings &rarr; Billing &rarr;
              Cancel Subscription
            </li>
            <li>
              <strong>Email:</strong> Send a cancellation request to{" "}
              <a href="mailto:support@creditclean.ai" className="text-blue-600 hover:underline dark:text-blue-400">
                support@creditclean.ai
              </a>{" "}
              with the subject line &ldquo;Cancellation Request&rdquo;
            </li>
            <li>
              <strong>Written Notice:</strong> Mail a written cancellation request
              to the address provided in the Contact section below
            </li>
          </ul>
          <p className="mt-3">
            Cancellation requests are processed within one (1) business day.
            You will receive email confirmation when your cancellation has been
            processed. Under CROA, you are not required to provide a reason for
            cancellation.
          </p>
        </section>

        {/* 6. Refund Processing */}
        <section id="refund-processing">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            6. Refund Processing
          </h2>
          <p className="mt-3">
            Approved refunds are processed within five (5) to ten (10) business
            days. Refunds are issued to the original payment method. Depending on
            your financial institution, it may take an additional 5-10 business days
            for the refund to appear on your statement.
          </p>
          <p className="mt-3">
            If you have not received your refund within 15 business days of
            approval, please contact us at{" "}
            <a href="mailto:support@creditclean.ai" className="text-blue-600 hover:underline dark:text-blue-400">
              support@creditclean.ai
            </a>.
          </p>
        </section>

        {/* 7. Non-Refundable Items */}
        <section id="non-refundable">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            7. Non-Refundable Items
          </h2>
          <p className="mt-3">
            The following are not eligible for refund (except as required by the
            CROA 3-day cancellation right or applicable state law):
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              Services that have already been fully performed (e.g., forensic
              reports already generated and delivered)
            </li>
            <li>
              Subscription periods that have already elapsed
            </li>
            <li>
              Dissatisfaction with credit repair outcomes — CreditClean AI does not
              guarantee specific results, and the outcome of disputes is determined
              by the credit bureaus and furnishers, not by CreditClean AI (see
              Section 9 below)
            </li>
          </ul>
        </section>

        {/* 8. State-Specific Rights */}
        <section id="state-specific">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            8. State-Specific Cancellation and Refund Rights
          </h2>
          <p className="mt-3">
            Several states provide additional consumer protections for credit repair
            services that may supplement or exceed the federal CROA protections.
            Where state law provides greater protection than this policy or federal
            law, state law controls. The following is a non-exhaustive summary:
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">California (Cal. Civ. Code &sect;1789.10 et seq.)</p>
              <p className="mt-1 text-sm">
                California&apos;s Credit Services Act requires a written contract, 5-day
                right to cancel, and prohibits collection of any fee before services
                are fully performed. California consumers may cancel at any time and
                receive a refund for services not yet performed.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Texas (Tex. Fin. Code &sect;393 et seq.)</p>
              <p className="mt-1 text-sm">
                Texas Credit Services Organizations Act requires a written contract
                with specific disclosures, a 3-day cancellation right, a $10,000
                surety bond, and prohibits charging fees before services are performed.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">New York (N.Y. Gen. Bus. Law &sect;458-a et seq.)</p>
              <p className="mt-1 text-sm">
                New York prohibits credit repair organizations from charging advance
                fees and provides consumers the right to cancel within 5 business days.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Florida (Fla. Stat. &sect;817.7001 et seq.)</p>
              <p className="mt-1 text-sm">
                Florida&apos;s Credit Repair Services Act provides a 3-day right to
                cancel and prohibits credit repair organizations from making false or
                misleading statements.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Georgia (Ga. Code &sect;16-9-59 et seq.)</p>
              <p className="mt-1 text-sm">
                Georgia provides a 5-business-day right to cancel and prohibits
                advance fees before services are performed.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Illinois (815 ILCS 605/1 et seq.)</p>
              <p className="mt-1 text-sm">
                Illinois Credit Services Organizations Act provides a 5-day right to
                cancel and requires a written contract with mandatory disclosures.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">All Other States</p>
              <p className="mt-1 text-sm">
                If your state provides cancellation or refund rights greater than
                those described in this policy, those state rights apply. CreditClean
                AI will honor the greater protection in every case. Contact us if you
                have questions about your state&apos;s specific protections.
              </p>
            </div>
          </div>
        </section>

        {/* 9. No Guarantee of Results */}
        <section id="no-guarantee">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            9. No Guarantee of Results
          </h2>
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/50">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Important Notice
            </p>
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
              CreditClean AI does not and cannot guarantee any specific outcome from
              the use of its services. Credit bureaus and information furnishers
              independently determine the outcome of disputes. No credit repair
              organization can lawfully guarantee the removal of accurate, timely, and
              verifiable information from a consumer report.
            </p>
          </div>
          <p className="mt-3">
            Dissatisfaction with dispute outcomes (e.g., a bureau verifying a disputed
            item rather than deleting it) does not constitute grounds for a refund.
            CreditClean AI&apos;s service is to generate legally-grounded dispute
            correspondence and analysis tools — the outcome of the dispute process is
            determined by third parties (credit bureaus and furnishers), not by
            CreditClean AI.
          </p>
          <p className="mt-3">
            Under CROA, 15 U.S.C. &sect;1679b(a)(1), it is unlawful for any credit
            repair organization to make any statement that is untrue or misleading —
            including guarantees of specific credit score improvements or item
            removals. CreditClean AI does not make such guarantees.
          </p>
        </section>

        {/* 10. Dispute Resolution */}
        <section id="dispute-resolution">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            10. Refund Dispute Resolution
          </h2>
          <p className="mt-3">
            If you disagree with a refund decision, you may:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>Internal Review:</strong> Request a review by emailing{" "}
              <a href="mailto:legal@creditclean.ai" className="text-blue-600 hover:underline dark:text-blue-400">
                legal@creditclean.ai
              </a>{" "}
              with the subject &ldquo;Refund Dispute.&rdquo; We will respond within
              five (5) business days.
            </li>
            <li>
              <strong>Chargeback:</strong> You retain the right to dispute any charge
              through your credit card issuer or payment provider at any time.
            </li>
            <li>
              <strong>Regulatory Complaint:</strong> You may file a complaint with the
              Federal Trade Commission (FTC) at{" "}
              <span className="font-medium">reportfraud.ftc.gov</span>, the Consumer
              Financial Protection Bureau (CFPB) at{" "}
              <span className="font-medium">consumerfinance.gov/complaint</span>, or
              your state attorney general&apos;s consumer protection division.
            </li>
            <li>
              <strong>Arbitration or Court:</strong> Refund disputes are subject to the
              dispute resolution provisions in our{" "}
              <Link href="/terms#disputes" className="text-blue-600 hover:underline dark:text-blue-400">
                Terms of Service
              </Link>.
            </li>
          </ul>
        </section>

        {/* 11. Contact */}
        <section id="contact">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            11. Contact
          </h2>
          <p className="mt-3">
            For cancellations, refund requests, or questions about this policy:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:support@creditclean.ai" className="text-blue-600 hover:underline dark:text-blue-400">
                support@creditclean.ai
              </a>
            </li>
            <li>
              <strong>Legal:</strong>{" "}
              <a href="mailto:legal@creditclean.ai" className="text-blue-600 hover:underline dark:text-blue-400">
                legal@creditclean.ai
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            This Refund &amp; Cancellation Policy is part of, and subject to, the{" "}
            <Link href="/terms" className="text-blue-600 hover:underline dark:text-blue-400">
              Terms of Service
            </Link>. In the event of a conflict between this policy and applicable
            federal or state law, the law providing greater consumer protection shall
            control.
          </p>
        </section>
      </div>
    </article>
  );
}
