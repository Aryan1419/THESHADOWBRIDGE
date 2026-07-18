'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-14 bg-brand-light border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Shield size={12} />
            <span>Privacy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-primary mb-3">
            Privacy Policy
          </h1>
          <p className="text-brand-muted text-sm sm:text-base font-medium max-w-xl mx-auto">
            <strong>The Shadow Bridge by Pratibha Mishra</strong>
            <br />
            Last Updated: July 18, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose-terms space-y-8 text-left">

            {/* Intro */}
            <p className="text-brand-muted text-sm sm:text-[15px] leading-relaxed font-medium">
              The Shadow Bridge (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; &quot;the Platform&quot;) is committed to protecting the privacy of the families, children, Tutors, and Shadow Teachers who use our services. This Privacy Policy explains what information we collect, why we collect it, how we use and protect it, and the choices you have. By using our website and services, you consent to the practices described here.
            </p>
            <p className="text-brand-muted text-sm sm:text-[15px] leading-relaxed font-medium">
              Because our services involve information about children, including sensitive details related to diagnoses and developmental needs, we treat this data with particular care. Please read this policy carefully.
            </p>

            <hr className="border-brand-border" />

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold text-primary">1. Information We Collect</h2>
              
              <div className="space-y-3 pl-4 border-l-2 border-accent/30">
                <h3 className="font-bold text-brand-dark text-sm">From Parents/Guardians (about themselves)</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Name, relationship to child, mobile number, email address, city/location.
                </p>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-accent/30">
                <h3 className="font-bold text-brand-dark text-sm">From Parents/Guardians (about their child)</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Child&apos;s name, date of birth, gender, grade/standard, school and home location, and — where voluntarily provided — information about diagnosis, areas of difficulty (e.g. attention, communication, behavior, learning, social interaction), and any therapies the child is currently receiving.
                </p>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed font-medium">
                  <strong>This information is sensitive personal data.</strong> We collect it only because it is necessary to understand your child&apos;s needs and find a suitable, appropriately trained match. You are never required to disclose more than you are comfortable sharing, though incomplete information may affect our ability to find the best match.
                </div>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-accent/30">
                <h3 className="font-bold text-brand-dark text-sm">From Tutors &amp; Shadow Teachers</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Name, date of birth, gender, contact details, address, educational qualifications, certifications, experience details, areas of specialization or comfort (e.g. experience with ASD, ADHD, learning disabilities), availability, and — for Shadow Teacher registration — identity and qualification documents (e.g. Aadhar card, certificates) and a profile photo.
                </p>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-accent/30">
                <h3 className="font-bold text-brand-dark text-sm">Payment Information</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  When you make a payment (consultation fee or placement fee), payment processing is handled entirely by our payment partner, <strong>Razorpay</strong>. We do not collect, see, or store your full card, UPI, or bank account details on our servers. We retain only the payment status, amount, and transaction reference ID for our records.
                </p>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-accent/30">
                <h3 className="font-bold text-brand-dark text-sm">Automatically Collected Information</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Basic technical data such as browser type, device type, and general usage patterns on our website, used to maintain and improve the Platform.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">2. How We Use Your Information</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                We use the information collected to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>Understand each family&apos;s needs and identify suitable Tutor/Shadow Teacher matches</li>
                <li>Conduct consultations and manage the registration and onboarding process</li>
                <li>Verify the qualifications, identity, and background of Tutors and Shadow Teachers</li>
                <li>Process payments and send payment confirmations</li>
                <li>Send registration confirmations, status updates, and other service-related communications (via email, and SMS in future once enabled)</li>
                <li>Display approved reviews/testimonials publicly (only with your explicit consent at the time of submission, and using only the information you agree to share — e.g. first name/city, not full case details)</li>
                <li>Improve our services and respond to inquiries or complaints</li>
                <li>Comply with legal obligations, including reporting to appropriate authorities where required (e.g. in matters relating to child safety)</li>
              </ul>
              <p className="text-brand-muted text-sm leading-relaxed font-semibold">
                We do <span className="underline">not</span> sell, rent, or trade your personal information, or your child&apos;s information, to any third party for marketing purposes.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">3. Who Can Access Your Information</h2>
              <ul className="list-disc pl-6 space-y-3.5 text-brand-muted text-sm leading-relaxed">
                <li>
                  <strong>Our team (Admin access):</strong> Pratibha Mishra and authorized team members can access registration details, consultation notes, and status information in order to manage matches and provide support. Access is restricted to logged-in, authorized admin accounts only.
                </li>
                <li>
                  <strong>Matched Tutor/Shadow Teacher:</strong> Once a match is proposed or confirmed, relevant information about the child&apos;s needs (not sensitive diagnostic details beyond what is necessary) may be shared with the specific Tutor/Shadow Teacher being matched, so they can prepare to support your child appropriately.
                </li>
                <li>
                  <strong>Service providers:</strong> We share limited data with trusted third-party providers who help us operate the Platform:
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li><strong>Razorpay</strong> (payment processing) — receives payment-related information necessary to process your transaction.</li>
                    <li><strong>Resend</strong> (email delivery) — receives your email address and relevant message content to deliver notifications.</li>
                    <li>Our hosting/database provider, to securely store Platform data.</li>
                  </ul>
                  <span className="block mt-2 italic text-xs">These providers are only given the information necessary to perform their specific function and are expected to handle it securely.</span>
                </li>
                <li>
                  <strong>Legal requirements:</strong> We may disclose information if required by law, court order, or to protect the safety of a child or any individual.
                </li>
              </ul>
              <p className="text-brand-muted text-sm leading-relaxed italic">
                We do not share diagnostic or health-related information about your child with any party beyond what is strictly necessary for matching and safe placement.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">4. Data Storage &amp; Security</h2>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>Your data is stored on secure, access-controlled servers/databases.</li>
                <li>Admin access to registration and family data is restricted to authenticated, authorized personnel only.</li>
                <li>Uploaded documents (e.g. ID proofs, certificates) are stored securely and are only accessible to authorized admin users for verification purposes.</li>
                <li>While we take reasonable measures to protect your data, no method of online storage or transmission is 100% secure, and we cannot guarantee absolute security.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">5. Data Retention</h2>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>We retain your (and your child&apos;s) information for as long as your account is active or as needed to provide our services.</li>
                <li>If a registration does not result in a match, or if you request account closure, we will retain data only as long as reasonably necessary (e.g. for legal, accounting, or dispute-resolution purposes) and will delete or anonymize it thereafter, upon request.</li>
                <li>Payment records may be retained longer where required for financial/tax compliance.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">6. Your Rights</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                As a parent/guardian, Tutor, or Shadow Teacher, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>Request a copy of the personal information we hold about you or your child</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your data, subject to any legal or contractual obligations that may require us to retain certain records</li>
                <li>Withdraw consent for optional data uses (e.g. having your review displayed publicly)</li>
                <li>Ask us questions about how your data is used</li>
              </ul>
              <p className="text-brand-muted text-sm leading-relaxed font-semibold mt-3">
                Under India&apos;s Digital Personal Data Protection Act (DPDP Act, 2023), you may also have specific statutory rights regarding your personal data, including the right to grievance redressal.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">7. Children&apos;s Data</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                Special care is taken with information relating to children:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>We only collect child-related information provided voluntarily by a parent or legal guardian — never directly from a child.</li>
                <li>Sensitive information (diagnosis, therapy details) is used strictly for the purpose of finding an appropriate match and is not disclosed beyond what is necessary for that purpose.</li>
                <li>Parents/guardians may request the deletion of their child&apos;s information at any time, subject to Section 5 above.</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">8. Cookies &amp; Website Usage Data</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                Our website may use basic cookies or similar technologies to ensure the site functions correctly (e.g. keeping you logged in to your dashboard) and to understand general usage patterns. We do not use these to sell your data or serve third-party advertising.
              </p>
            </div>

            {/* Section 9 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">9. Contact Us</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                If you have questions about this Privacy Policy, or wish to exercise any of your rights regarding your data, please contact us:
              </p>
              <div className="bg-brand-light border border-brand-border rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3 text-sm text-brand-dark font-medium">
                  <Mail size={16} className="text-accent shrink-0" />
                  <a href="mailto:aryanbeltharia1419@gmail.com" className="hover:text-accent transition-colors">aryanbeltharia1419@gmail.com</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-dark font-medium">
                  <Phone size={16} className="text-accent shrink-0" />
                  <a href="tel:+919974390725" className="hover:text-accent transition-colors">+91 99743 90725</a>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">10. Changes to This Policy</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will update the &quot;Last Updated&quot; date above when changes are made. Continued use of the Platform after changes are posted constitutes acceptance of the revised policy.
              </p>
            </div>

          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
