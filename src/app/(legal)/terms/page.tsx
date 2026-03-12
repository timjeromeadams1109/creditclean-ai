import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — CreditClean AI",
  description:
    "Terms of Service for CreditClean AI credit repair platform.",
};

export default function TermsOfServicePage() {
  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        Terms of Service
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
          <li><a href="#acceptance" className="hover:underline">Acceptance of Terms</a></li>
          <li><a href="#description" className="hover:underline">Description of Service</a></li>
          <li><a href="#not-legal-advice" className="hover:underline">Not Legal Advice</a></li>
          <li><a href="#croa" className="hover:underline">Credit Repair Organizations Act Compliance</a></li>
          <li><a href="#user-responsibilities" className="hover:underline">User Responsibilities</a></li>
          <li><a href="#no-guarantee" className="hover:underline">No Guarantee of Results</a></li>
          <li><a href="#accuracy" className="hover:underline">Accuracy of Information</a></li>
          <li><a href="#data-privacy" className="hover:underline">Data Privacy</a></li>
          <li><a href="#limitation" className="hover:underline">Limitation of Liability</a></li>
          <li><a href="#indemnification" className="hover:underline">Indemnification</a></li>
          <li><a href="#disputes" className="hover:underline">Dispute Resolution</a></li>
          <li><a href="#changes" className="hover:underline">Changes to Terms</a></li>
          <li><a href="#governing-law" className="hover:underline">Governing Law</a></li>
          <li><a href="#contact" className="hover:underline">Contact</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        {/* 1. Acceptance */}
        <section id="acceptance">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            1. Acceptance of Terms
          </h2>
          <p className="mt-3">
            By accessing or using CreditClean AI (the &ldquo;Service&rdquo;), you agree to
            be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to
            these Terms, you must not access or use the Service. Your continued use
            of the Service following any updates to these Terms constitutes your
            acceptance of the revised Terms.
          </p>
        </section>

        {/* 2. Description of Service */}
        <section id="description">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            2. Description of Service
          </h2>
          <p className="mt-3">
            CreditClean AI is a self-help credit repair tool that generates dispute
            letters based on federal consumer protection laws, including the Fair
            Credit Reporting Act (FCRA), the Fair Debt Collection Practices Act
            (FDCPA), and the Fair Credit Billing Act (FCBA).
          </p>
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            CreditClean AI is NOT a law firm, credit repair organization (as
            defined under the Credit Repair Organizations Act, 15 U.S.C. &sect;1679),
            or legal services provider.
          </p>
        </section>

        {/* 3. Not Legal Advice */}
        <section id="not-legal-advice">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            3. Not Legal Advice
          </h2>
          <p className="mt-3">
            All information, templates, letters, and recommendations provided
            through CreditClean AI are for educational and self-help purposes only.
            They do not constitute legal advice. No attorney-client relationship is
            created by your use of this Service.
          </p>
          <p className="mt-3">
            Users should consult with a qualified attorney licensed in their
            jurisdiction for legal advice specific to their situation. The
            information provided by CreditClean AI is not a substitute for
            professional legal counsel.
          </p>
        </section>

        {/* 4. CROA Compliance */}
        <section id="croa">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            4. Credit Repair Organizations Act Compliance
          </h2>
          <p className="mt-3">
            Pursuant to the Credit Repair Organizations Act (15 U.S.C. &sect;1679b),
            CreditClean AI does not:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>
              Make any untrue or misleading representations about our services or
              their effectiveness;
            </li>
            <li>
              Charge or receive any money or other valuable consideration before
              the services are fully performed (a free tier is available to all
              users);
            </li>
            <li>
              Advise any consumer to make any statement to a credit reporting
              agency or creditor that is untrue or misleading, or that should be
              known to be untrue or misleading.
            </li>
          </ol>
          <p className="mt-3">
            You are advised that you have the right to dispute inaccurate
            information in your credit report directly with credit reporting
            agencies at no cost under FCRA &sect;611 (15 U.S.C. &sect;1681i).
          </p>
        </section>

        {/* 5. User Responsibilities */}
        <section id="user-responsibilities">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            5. User Responsibilities
          </h2>
          <p className="mt-3">By using the Service, you agree that you are responsible for:</p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              The accuracy and completeness of all information you enter into the
              platform;
            </li>
            <li>
              Sending your own dispute letters to credit bureaus, creditors, and
              collection agencies;
            </li>
            <li>
              Complying with all applicable federal, state, and local laws in
              connection with your use of the Service;
            </li>
            <li>
              Ensuring that all disputes you submit are truthful, accurate, and
              made in good faith;
            </li>
            <li>
              Not using the platform for any fraudulent, deceptive, or illegal
              purpose.
            </li>
          </ul>
        </section>

        {/* 6. No Guarantee */}
        <section id="no-guarantee">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            6. No Guarantee of Results
          </h2>
          <p className="mt-3">
            Credit repair results vary significantly by individual circumstance. We
            do not guarantee any specific outcome, including but not limited to
            credit score improvement, negative item removal or modification, or any
            particular timeline for results. Past results achieved by other users do
            not guarantee future performance.
          </p>
        </section>

        {/* 7. Accuracy */}
        <section id="accuracy">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            7. Accuracy of Information
          </h2>
          <p className="mt-3">
            While we strive to keep all legal citations, statutory references, and
            dispute letter templates current and accurate, laws and regulations
            change over time. Users should independently verify all legal references
            before relying on them. CreditClean AI is not liable for any errors,
            omissions, or inaccuracies in legal citations or template content.
          </p>
        </section>

        {/* 8. Data Privacy */}
        <section id="data-privacy">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            8. Data Privacy
          </h2>
          <p className="mt-3">
            We collect and store the minimum data necessary to provide the Service.
            We never sell or share your personal information with third parties
            except as required by law or as described in our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
              Privacy Policy
            </Link>
            . All credit report data is encrypted at rest and in transit using
            industry-standard encryption protocols.
          </p>
        </section>

        {/* 9. Limitation of Liability */}
        <section id="limitation">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            9. Limitation of Liability
          </h2>
          <p className="mt-3">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CREDITCLEAN AI AND
            ITS OWNERS, OFFICERS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR
            GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF
            (OR INABILITY TO ACCESS OR USE) THE SERVICE, WHETHER BASED ON WARRANTY,
            CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL
            THEORY, EVEN IF CREDITCLEAN AI HAS BEEN ADVISED OF THE POSSIBILITY OF
            SUCH DAMAGES.
          </p>
          <p className="mt-3">
            In no event shall CreditClean AI&apos;s total liability to you for all
            claims arising from or related to the Service exceed the amount you have
            paid to CreditClean AI in the twelve (12) months preceding the claim.
          </p>
        </section>

        {/* 10. Indemnification */}
        <section id="indemnification">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            10. Indemnification
          </h2>
          <p className="mt-3">
            You agree to indemnify, defend, and hold harmless CreditClean AI, its
            owners, officers, employees, agents, and affiliates from and against any
            and all claims, damages, obligations, losses, liabilities, costs, and
            expenses (including attorney&apos;s fees) arising from: (a) your use of
            the Service; (b) your violation of these Terms; (c) your violation of
            any third-party right, including any intellectual property or privacy
            right; or (d) any claim that your use of the Service caused damage to a
            third party.
          </p>
        </section>

        {/* 11. Dispute Resolution */}
        <section id="disputes">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            11. Dispute Resolution
          </h2>
          <p className="mt-3">
            Any dispute, controversy, or claim arising out of or relating to these
            Terms or the Service shall be resolved through binding arbitration in
            accordance with the rules of the American Arbitration Association (AAA),
            conducted in the State of California. The arbitrator&apos;s decision
            shall be final and binding and may be entered as a judgment in any court
            of competent jurisdiction.
          </p>
          <p className="mt-3">
            Notwithstanding the foregoing, either party may seek injunctive or
            equitable relief in any court of competent jurisdiction. Claims eligible
            for small claims court may be filed in small claims court in lieu of
            arbitration.
          </p>
        </section>

        {/* 12. Changes */}
        <section id="changes">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            12. Changes to Terms
          </h2>
          <p className="mt-3">
            We reserve the right to modify these Terms at any time. When we make
            material changes, we will update the &ldquo;Effective Date&rdquo; at the
            top of this page and, where appropriate, notify you via email or through
            the Service. Your continued use of the Service after any such changes
            constitutes your acceptance of the revised Terms.
          </p>
        </section>

        {/* 13. Governing Law */}
        <section id="governing-law">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            13. Governing Law
          </h2>
          <p className="mt-3">
            These Terms shall be governed by and construed in accordance with the
            laws of the State of California, without regard to its conflict of law
            provisions. Any legal action or proceeding not subject to arbitration
            shall be brought exclusively in the state or federal courts located in
            California.
          </p>
        </section>

        {/* 14. Contact */}
        <section id="contact">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            14. Contact
          </h2>
          <p className="mt-3">
            If you have any questions about these Terms of Service, please contact
            us at{" "}
            <a
              href="mailto:legal@creditclean.ai"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              legal@creditclean.ai
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
