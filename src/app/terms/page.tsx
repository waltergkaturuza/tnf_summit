import Link from "next/link";
import { FileText, Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Use | TNF Global Summit 2026",
  description: "Terms of Use for the TNF Global Summit 2026 website and registration platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-[#C9921A]/20 border border-[#C9921A]/30 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-[#C9921A]" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Terms of Use</h1>
            <p className="text-slate-400 mt-1 text-sm">
              TNF Global Summit 2026 · Last updated: March 2026
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-10 space-y-8 text-slate-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the TNF Global Summit 2026 website and registration platform (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Use. If you do not agree to these terms, please discontinue use of the Platform immediately.
            </p>
            <p className="mt-3">
              The Platform is operated by the Tripartite Negotiating Forum (TNF) Secretariat (&ldquo;the Organiser&rdquo;) and developed and maintained by{" "}
              <a href="https://www.quantistechnologies.co.zw/" target="_blank" rel="noopener noreferrer" className="text-[#C9921A] hover:text-[#F5B730] transition-colors font-semibold">
                Quantis Technologies
              </a>
              .
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Platform Use</h2>
            <p className="mb-3">When using the Platform, you agree to:</p>
            <ul className="space-y-2">
              {[
                "Provide accurate, complete, and current information during registration",
                "Use the Platform only for its intended purposes — Summit registration, programme access, and information",
                "Not attempt to gain unauthorised access to any part of the Platform or its systems",
                "Not use the Platform for any unlawful, harmful, or fraudulent purpose",
                "Not reproduce, distribute, or commercially exploit Platform content without written consent from the TNF Secretariat",
                "Not transmit viruses, malware, or any harmful code",
                "Respect the intellectual property rights of the Organiser and third parties",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9921A] mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. Registration & Fees</h2>
            <div className="space-y-3">
              <p>
                <span className="text-white font-semibold">3.1 Registration:</span> All delegate registrations are subject to confirmation by the TNF Secretariat. A registration is only confirmed upon receipt of full payment and written confirmation from the Secretariat.
              </p>
              <p>
                <span className="text-white font-semibold">3.2 Early Bird Rates:</span> Early bird registration rates apply to registrations received and paid in full by 30 June 2026. After this date, standard rates apply automatically.
              </p>
              <p>
                <span className="text-white font-semibold">3.3 Payment:</span> An invoice will be issued within 24 hours of registration submission. Payment is due within 14 days of invoice date. The Organiser reserves the right to cancel unconfirmed registrations where payment is not received.
              </p>
              <p>
                <span className="text-white font-semibold">3.4 Cancellations and Refunds:</span> Cancellations received in writing before 31 July 2026 will receive a 50% refund. No refunds are available for cancellations received after 31 July 2026. Substitutions of registered delegates are permitted at no additional charge with prior written notice to the Secretariat.
              </p>
              <p>
                <span className="text-white font-semibold">3.5 Delegate Categories:</span> Delegates must register under the correct category. The Organiser reserves the right to reassign registrations to the appropriate category and issue revised invoices accordingly.
              </p>
            </div>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. Summit Code of Conduct</h2>
            <p className="mb-3">All delegates, speakers, sponsors, and staff are required to observe the following code of conduct during the Summit:</p>
            <ul className="space-y-2">
              {[
                "Treat all participants with dignity, respect, and professionalism",
                "Refrain from harassment, discrimination, or intimidation of any kind",
                "Comply with all venue rules and regulations at Elephant Hills Resort",
                "Dress appropriately as per the specified dress codes for each event",
                "Respect the confidentiality of closed or restricted sessions",
                "Not engage in any activity that disrupts the conduct of the Summit",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9921A] mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              The Organiser reserves the right to remove any delegate from the Summit premises for violations of this code without refund.
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Intellectual Property</h2>
            <p>
              All content on the Platform, including but not limited to text, graphics, logos, programme documents, session materials, recordings, and photographs, is the property of the TNF Secretariat or its content providers and is protected by applicable intellectual property laws.
            </p>
            <p className="mt-3">
              Delegates and media may use official Summit content for non-commercial reporting and communication purposes, provided that proper attribution is given to the TNF Global Summit 2026 and the TNF Secretariat.
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. Programme Changes</h2>
            <p>
              The Organiser reserves the right to modify the Summit programme, including session topics, speakers, times, and rooms, without prior notice. Every effort will be made to notify registered delegates of material changes via the Summit App and email communications. No refunds will be issued solely on the basis of programme changes.
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, the TNF Secretariat, its officers, employees, partners, and service providers shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of the Platform or attendance at the Summit, including but not limited to personal injury, loss of property, travel disruption, or force majeure events.
            </p>
            <p className="mt-3">
              In the event of Summit postponement, cancellation, or significant modification due to circumstances beyond the Organiser&apos;s reasonable control (including but not limited to natural disasters, pandemics, or government restrictions), the Organiser will endeavour to offer alternative arrangements or partial refunds at its discretion.
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">8. Third-Party Links</h2>
            <p>
              The Platform may contain links to third-party websites including partner organisations, payment processors, and the Summit App. These links are provided for convenience only. The TNF Secretariat is not responsible for the content, privacy practices, or terms of any third-party websites.
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">9. Governing Law</h2>
            <p>
              These Terms of Use shall be governed by and construed in accordance with the laws of the Republic of Zimbabwe. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Zimbabwe.
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">10. Contact</h2>
            <p className="mb-4">For questions regarding these Terms of Use, please contact:</p>
            <div className="glass-gold rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 text-[#C9921A]" />
                <a href="mailto:info@tnfzim.com" className="text-[#F5B730] hover:underline">info@tnfzim.com</a>
              </div>
              <div className="text-slate-400 text-sm">Tripartite Negotiating Forum (TNF) Secretariat</div>
              <div className="text-slate-400 text-sm">East Wing Block 3 Celestial Park, Borrowdale, Harare, Zimbabwe</div>
              <div className="text-slate-400 text-sm">+263 242 783030 / 783090</div>
            </div>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">11. Amendments</h2>
            <p>
              The TNF Secretariat reserves the right to amend these Terms of Use at any time. Updated terms will be posted on the Platform and, where appropriate, notified to registered delegates by email. Continued use of the Platform after amendments constitutes acceptance of the updated terms.
            </p>
          </section>

        </div>

        <div className="mt-8 text-center text-slate-600 text-xs">
          Platform developed by{" "}
          <a href="https://www.quantistechnologies.co.zw/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#C9921A] transition-colors font-semibold">
            Quantis Technologies
          </a>
        </div>
      </div>
    </div>
  );
}
