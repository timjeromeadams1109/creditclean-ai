import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — CreditClean AI",
  description:
    "Legal disclaimer for CreditClean AI. Not legal advice. Not a credit repair organization.",
};

export default function DisclaimerPage() {
  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        Disclaimer
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
          <li><a href="#general" className="hover:underline">General Disclaimer</a></li>
          <li><a href="#not-legal-advice" className="hover:underline">Not Legal Advice</a></li>
          <li><a href="#no-attorney" className="hover:underline">No Attorney-Client Relationship</a></li>
          <li><a href="#no-guarantee" className="hover:underline">No Guarantee of Results</a></li>
          <li><a href="#legal-accuracy" className="hover:underline">Legal Information Accuracy</a></li>
          <li><a href="#croa-notice" className="hover:underline">Credit Repair Organizations Act Notice</a></li>
          <li><a href="#federal-rights" className="hover:underline">Your Rights Under Federal Law</a></li>
          <li><a href="#third-party" className="hover:underline">Third-Party Services</a></li>
          <li><a href="#liability" className="hover:underline">Liability Limitation</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        {/* 1. General Disclaimer */}
        <section id="general">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            1. General Disclaimer
          </h2>
          <p className="mt-3">
            CreditClean AI provides tools and information for consumers to exercise
            their rights under federal and state consumer protection laws, including
            the Fair Credit Reporting Act (FCRA), the Fair Debt Collection Practices
            Act (FDCPA), and the Fair Credit Billing Act (FCBA).
          </p>
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            CreditClean AI is not a law firm, credit repair organization, credit
            counseling agency, or legal services provider. We do not provide legal
            representation or legal advice of any kind.
          </p>
        </section>

        {/* 2. Not Legal Advice */}
        <section id="not-legal-advice">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            2. Not Legal Advice
          </h2>
          <p className="mt-3">
            Nothing on this platform constitutes legal advice. The dispute letters,
            legal citations, forensic analysis results, and recommendations provided
            by CreditClean AI are based on publicly available federal statutes,
            regulations, and case law. They are provided for educational and
            self-help purposes only.
          </p>
          <p className="mt-3">
            The information provided should not be relied upon as a substitute for
            consultation with a qualified attorney who can provide advice tailored to
            your specific circumstances. Laws vary by jurisdiction, and the
            applicability of any legal strategy depends on the particular facts of
            your situation.
          </p>
        </section>

        {/* 3. No Attorney-Client Relationship */}
        <section id="no-attorney">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            3. No Attorney-Client Relationship
          </h2>
          <p className="mt-3">
            Use of CreditClean AI does not create an attorney-client relationship
            between you and CreditClean AI, its owners, or any of its employees or
            affiliates. No confidential or privileged relationship is formed by your
            use of the Service.
          </p>
          <p className="mt-3">
            If you need legal representation in connection with a credit reporting
            dispute, debt collection matter, or any other consumer protection issue,
            we recommend consulting a qualified consumer rights attorney licensed in
            your jurisdiction. You may find attorneys through your state bar
            association or the National Association of Consumer Advocates (NACA).
          </p>
        </section>

        {/* 4. No Guarantee of Results */}
        <section id="no-guarantee">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            4. No Guarantee of Results
          </h2>
          <p className="mt-3">
            CreditClean AI makes no guarantees, representations, or warranties
            regarding:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Credit score improvement of any amount;</li>
            <li>Removal or modification of any negative item from your credit report;</li>
            <li>The timeline within which you may see results;</li>
            <li>The accuracy of credit score impact estimates.</li>
          </ul>
          <p className="mt-3">
            Credit repair outcomes depend on many factors beyond our control,
            including but not limited to:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>The accuracy and completeness of the information you provide;</li>
            <li>The specific circumstances surrounding each credit item;</li>
            <li>The actions and responses of third parties, including credit bureaus, creditors, and debt collectors;</li>
            <li>Changes in applicable laws and regulations;</li>
            <li>Your diligence in following through with sending disputes and tracking responses.</li>
          </ul>
        </section>

        {/* 5. Legal Information Accuracy */}
        <section id="legal-accuracy">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            5. Legal Information Accuracy
          </h2>
          <p className="mt-3">
            While we make every reasonable effort to keep legal citations, statutory
            references, regulatory guidance, and case law current and accurate, the
            law is subject to change through legislative action, judicial decisions,
            and regulatory updates.
          </p>
          <p className="mt-3">
            We strongly recommend verifying all legal references independently
            before relying on them in any dispute or legal proceeding. CreditClean AI
            is not liable for any actions taken based on information that may be
            outdated, incomplete, or inaccurate.
          </p>
        </section>

        {/* 6. CROA Notice */}
        <section id="croa-notice">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            6. Credit Repair Organizations Act Notice
          </h2>
          <p className="mt-3">
            Under the Credit Repair Organizations Act (15 U.S.C. &sect;1679 et
            seq.), you have the following rights:
          </p>
          <ol className="mt-3 list-decimal space-y-3 pl-6">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">
                Right to self-dispute at no cost:
              </strong>{" "}
              You have the right to dispute inaccurate information in your credit
              report directly with the credit reporting agencies (Equifax,
              Experian, and TransUnion) at no charge under FCRA &sect;611 (15
              U.S.C. &sect;1681i).
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">
                Right to cancel:
              </strong>{" "}
              You have the right to cancel any contract with a credit repair
              organization within three (3) business days of signing.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">
                Right to file complaints:
              </strong>{" "}
              You have the right to file a complaint with the Federal Trade
              Commission (FTC) at{" "}
              <a
                href="https://www.ftc.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                ftc.gov
              </a>{" "}
              or with your state attorney general if you believe a credit repair
              organization has violated your rights.
            </li>
          </ol>
        </section>

        {/* 7. Your Rights Under Federal Law */}
        <section id="federal-rights">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            7. Your Rights Under Federal Law
          </h2>
          <p className="mt-3">
            You can dispute inaccurate items on your credit report yourself, for
            free, by writing directly to the credit reporting agencies under FCRA
            &sect;611 (15 U.S.C. &sect;1681i). The credit bureaus are required by
            law to investigate your dispute within 30 days (or 45 days under certain
            circumstances) and notify you of the results.
          </p>
          <p className="mt-3">
            CreditClean AI is a tool designed to help you exercise these existing
            rights more effectively and efficiently. It is not a substitute for your
            right to self-dispute, and it does not create any rights beyond those
            already provided by law.
          </p>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Key federal laws referenced by CreditClean AI:</strong>
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-700 dark:text-blue-300">
              <li>Fair Credit Reporting Act (FCRA) — 15 U.S.C. &sect;1681 et seq.</li>
              <li>Fair Debt Collection Practices Act (FDCPA) — 15 U.S.C. &sect;1692 et seq.</li>
              <li>Fair Credit Billing Act (FCBA) — 15 U.S.C. &sect;1666 et seq.</li>
              <li>Credit Repair Organizations Act (CROA) — 15 U.S.C. &sect;1679 et seq.</li>
            </ul>
          </div>
        </section>

        {/* 8. Third-Party Services */}
        <section id="third-party">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            8. Third-Party Services
          </h2>
          <p className="mt-3">
            CreditClean AI is not affiliated with, endorsed by, or sponsored by
            Equifax, Experian, TransUnion, the Consumer Financial Protection Bureau
            (CFPB), the Federal Trade Commission (FTC), or any other government
            agency or credit reporting entity. All references to these organizations
            are for informational purposes only.
          </p>
          <p className="mt-3">
            Any links to third-party websites or resources are provided for your
            convenience. We do not control, endorse, or assume responsibility for
            the content or practices of any third-party sites.
          </p>
        </section>

        {/* 9. Liability Limitation */}
        <section id="liability">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            9. Liability Limitation
          </h2>
          <p className="mt-3">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CREDITCLEAN AI, ITS
            OWNERS, OFFICERS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE
            FOR ANY DAMAGES ARISING FROM YOUR USE OF THE PLATFORM, INCLUDING BUT NOT
            LIMITED TO:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Denied credit applications or adverse action taken by lenders;</li>
            <li>Emotional distress or mental anguish;</li>
            <li>Lost business opportunities or economic harm;</li>
            <li>
              Any other direct, indirect, incidental, special, consequential, or
              punitive damages resulting from your credit repair activities or
              reliance on information provided by the Service.
            </li>
          </ul>
          <p className="mt-3">
            You acknowledge that you use CreditClean AI at your own risk and that
            you are solely responsible for any actions you take based on the
            information and tools provided.
          </p>
        </section>
      </div>
    </article>
  );
}
