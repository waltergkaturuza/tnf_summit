import Link from "next/link";
import { Shield, Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Zimbabwe TNF Global Summit 2026",
  description: "Privacy Policy for the Zimbabwe TNF Global Summit 2026 website and registration system.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-theme-primary hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-[#C9921A]/20 border border-[#C9921A]/30 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-[#C9921A]" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy Policy</h1>
            <p className="mt-1 text-sm text-theme-primary">
              Zimbabwe TNF Global Summit 2026 · Last updated: March 2026
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-10 space-y-8 text-sm leading-relaxed text-theme-primary">

          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. Introduction</h2>
            <p>
              The Tripartite Negotiating Forum (TNF) Secretariat (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting the privacy and personal information of delegates, participants, partners, and visitors to the Zimbabwe TNF Global Summit 2026 website and registration platform (&ldquo;the Platform&rdquo;).
            </p>
            <p className="mt-3">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at <span className="text-[#C9921A]">www.tnfzim.org/summit2026</span> or register for the Zimbabwe TNF Global Summit on Inclusive Growth, Decent Work, Beneficiation, and Investment Promotion (&ldquo;the Summit&rdquo;).
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following categories of personal information:</p>
            <div className="space-y-3">
              {[
                { title: "Registration Information", desc: "Name, email address, phone number, job title, organisation, country, and delegate category when you register for the Summit." },
                { title: "Payment Information", desc: "Registration fee payment details processed through secure third-party payment processors. We do not store full payment card details." },
                { title: "Session Preferences", desc: "Session interests, dietary requirements, accommodation preferences, and bilateral meeting requests submitted via the registration form." },
                { title: "Communication Data", desc: "Messages and enquiries submitted via the contact form or sent to our email addresses." },
                { title: "Newsletter Subscriptions", desc: "Email address provided for Summit news and updates subscriptions." },
                { title: "Usage Data", desc: "Technical data including IP address, browser type, pages visited, and time spent on the Platform, collected via analytics tools." },
              ].map((item) => (
                <div key={item.title} className="glass rounded-xl p-4">
                  <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                  <div className="text-sm text-theme-primary">{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect for the following purposes:</p>
            <ul className="space-y-2">
              {[
                "To process and confirm your Summit registration and issue invoices",
                "To communicate Summit updates, programme changes, and important information",
                "To facilitate bilateral meeting pre-bookings via the Summit App",
                "To manage dietary, accommodation, and accessibility requirements",
                "To send newsletters and updates (only where you have consented)",
                "To respond to enquiries and provide customer support",
                "To process payments and maintain financial records",
                "To improve the Platform and our services",
                "To comply with legal obligations",
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
            <h2 className="text-white font-bold text-lg mb-3">4. Information Sharing</h2>
            <p className="mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:
            </p>
            <ul className="space-y-2">
              {[
                "With official Summit partners (ILO, ZIDA, AU Commission, AfCFTA Secretariat) solely for Summit coordination purposes",
                "With payment processing providers under strict data protection agreements",
                "With the Summit App provider for bilateral meeting facilitation (delegate name, organisation and title only)",
                "With government authorities where required by law or legal process",
                "With service providers (venue, logistics) on a need-to-know basis for Summit delivery",
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
            <h2 className="text-white font-bold text-lg mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard technical and organisational security measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. Our Platform is developed and maintained by{" "}
              <a href="https://www.quantistechnologies.co.zw/" target="_blank" rel="noopener noreferrer" className="text-[#C9921A] hover:text-[#F5B730] transition-colors">
                Quantis Technologies
              </a>
              , a certified digital infrastructure company, in accordance with applicable data protection standards.
            </p>
            <p className="mt-3">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. Cookies & Analytics</h2>
            <p>
              Our Platform uses cookies and similar tracking technologies to enhance your experience and gather usage analytics. Cookies are small files placed on your device. You may instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some Platform features may not function properly without cookies.
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. Photography & Video at the Summit</h2>
            <p>
              By attending the Zimbabwe TNF Global Summit 2026, you acknowledge that official photography and video recording will take place at all Summit sessions, social events, and excursions. Images and recordings may be used in official Summit publications, social media, press releases, and future promotional materials. If you do not consent to being photographed or filmed, please notify the TNF Secretariat in writing prior to the Summit.
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">8. Your Rights</h2>
            <p className="mb-3">Subject to applicable law, you have the right to:</p>
            <ul className="space-y-2">
              {[
                "Access the personal information we hold about you",
                "Request correction of inaccurate or incomplete information",
                "Request deletion of your personal information (subject to legal obligations)",
                "Withdraw consent to newsletter subscriptions at any time",
                "Object to processing of your personal information in certain circumstances",
                "Lodge a complaint with a relevant data protection authority",
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
            <h2 className="text-white font-bold text-lg mb-3">9. Retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfil the purposes outlined in this Policy and to comply with our legal obligations. Registration data is typically retained for three years following the Summit for record-keeping and reporting purposes.
            </p>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">10. Contact Us</h2>
            <p className="mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact the TNF Secretariat:
            </p>
            <div className="glass-gold rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 text-[#C9921A]" />
                <a href="mailto:info@tnfzim.com" className="text-[#F5B730] hover:underline">info@tnfzim.com</a>
              </div>
              <div className="text-sm text-theme-primary">Tripartite Negotiating Forum (TNF) Secretariat</div>
              <div className="text-sm text-theme-primary">East Wing Block 3 Celestial Park, Borrowdale, Harare, Zimbabwe</div>
              <div className="text-sm text-theme-primary">+263 242 783030 / 783090</div>
            </div>
          </section>

          <div className="divider-gold" />

          <section>
            <h2 className="text-white font-bold text-lg mb-3">11. Changes to This Policy</h2>
            <p>
              We reserve the right to update this Privacy Policy at any time. We will notify registered delegates of material changes via email. Continued use of the Platform following notification of changes constitutes acceptance of the updated Policy.
            </p>
          </section>

        </div>

        <div className="mt-8 text-center text-xs text-theme-primary">
          Platform developed by{" "}
          <a href="https://www.quantistechnologies.co.zw/" target="_blank" rel="noopener noreferrer" className="text-theme-primary hover:text-[#C9921A] transition-colors font-semibold">
            Quantis Technologies
          </a>
        </div>
      </div>
    </div>
  );
}
