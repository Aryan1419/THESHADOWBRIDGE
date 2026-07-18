'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsConditions() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-14 bg-brand-light border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <FileText size={12} />
            <span>Legal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-primary mb-3">
            Terms &amp; Conditions
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
          <article className="prose-terms space-y-8">

            {/* Intro */}
            <p className="text-brand-muted text-sm sm:text-[15px] leading-relaxed">
              Please read these Terms &amp; Conditions (&quot;Terms&quot;) carefully before using the website and services offered by The Shadow Bridge (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; &quot;the Platform&quot;). By accessing our website, registering as a Parent, Tutor, or Shadow Teacher, or using any of our services, you (&quot;User,&quot; &quot;you&quot;) agree to be bound by these Terms. If you do not agree, please do not use the Platform.
            </p>

            <hr className="border-brand-border" />

            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">1. About Us</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                The Shadow Bridge is a platform that connects families of children requiring additional academic or developmental support with independently trained Home Tutors and Shadow Teachers. We facilitate introductions, conduct consultations, and support the matching process. We are a service marketplace/matching platform — we are <strong>not</strong> an employer of the Tutors or Shadow Teachers listed or matched through our Platform, and we do not directly provide tutoring or shadow-teaching services ourselves.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">2. Eligibility</h2>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>Parents/Guardians registering on behalf of a child must be the child&apos;s legal parent or guardian.</li>
                <li>Tutors and Shadow Teachers registering must be 18 years or older and legally permitted to work in India.</li>
                <li>By registering, you confirm that all information you provide is accurate, current, and complete.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">3. Nature of Our Services</h2>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>We provide a <strong>matching and facilitation service</strong>. We do our best to understand each family&apos;s needs and each professional&apos;s qualifications, and to suggest suitable matches.</li>
                <li>We conduct a screening and interview process for Tutors and Shadow Teachers before they are listed as available on our Platform, including verification of the documents they submit to us.</li>
                <li><strong>We do not guarantee</strong> that any particular match will be successful, that a Tutor/Shadow Teacher will be available at all times, or that outcomes (academic, behavioral, or developmental) will meet any particular expectation.</li>
                <li>Once a match is confirmed, the day-to-day working relationship, supervision, and conduct between the family and the Tutor/Shadow Teacher is between those parties. We remain available for ongoing support, monitoring, and to address concerns, but we are not present during sessions and cannot directly supervise every interaction.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">4. Registration &amp; Accounts</h2>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>You are responsible for maintaining the confidentiality of your account/dashboard access.</li>
                <li>You agree to notify us promptly of any unauthorized use of your account.</li>
                <li>We reserve the right to suspend or terminate any account that provides false information, violates these Terms, or engages in conduct that endangers the safety or wellbeing of a child.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">5. Fees &amp; Payments</h2>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li><strong>Consultation Fee:</strong> ₹99, payable at the time of registration to book an initial consultation. This fee is <strong>non-refundable</strong>, as it covers the cost of our team&apos;s time in reviewing your requirements and conducting the consultation.</li>
                <li><strong>Placement Fee:</strong> ₹5,000 (Shadow Teacher) or ₹3,000 (Home Tutor), payable only once a match has been confirmed and accepted by the family. This is a one-time fee.</li>
                <li>All payments are processed through our third-party payment gateway (Razorpay). We do not store your card, UPI, or banking details on our servers.</li>
                <li><strong>Refund Policy:</strong> Placement fees are non-refundable once a Tutor/Shadow Teacher has been confirmed and onboarding has begun. If a placement fails within the initial period due to reasons attributable to the Tutor/Shadow Teacher, we will offer a replacement match at no additional placement fee, subject to availability.</li>
                <li>Fees paid directly to a Tutor or Shadow Teacher for ongoing sessions (beyond our one-time placement fee) are a private arrangement between the family and the professional, and are not collected or managed by us.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">6. Responsibilities of Parents/Guardians</h2>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>You are responsible for providing accurate information about your child&apos;s needs, diagnosis (if any), and requirements, to help us find a suitable match.</li>
                <li>You are responsible for the safety and supervision of your child during any in-person or online sessions, particularly for younger children, and are encouraged to remain reasonably accessible during sessions, especially in the initial period of a new placement.</li>
                <li>You agree to communicate any concerns about a Tutor or Shadow Teacher&apos;s conduct to us promptly so we can investigate and take appropriate action.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">7. Responsibilities of Tutors &amp; Shadow Teachers</h2>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>You agree to provide accurate information regarding your qualifications, experience, and background, and to submit genuine documents for verification.</li>
                <li>You agree to conduct yourself professionally, ethically, and in the best interests of the child&apos;s safety and wellbeing at all times.</li>
                <li>You agree to maintain confidentiality regarding any personal, medical, or diagnostic information shared with you about a child.</li>
                <li>Any misconduct, breach of trust, or behavior that compromises a child&apos;s safety will result in immediate removal from the Platform and may be reported to appropriate authorities as required by law.</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">8. Child Safety</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                The safety and wellbeing of children is our highest priority. We:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>Conduct interviews and document verification for all Tutors and Shadow Teachers before listing them.</li>
                <li>Encourage parents to report any concerns immediately via our Contact channels.</li>
                <li>Reserve the right to permanently remove any Tutor or Shadow Teacher from the Platform, without prior notice, if we receive credible concerns about conduct or safety.</li>
              </ul>
              <p className="text-brand-muted text-sm leading-relaxed">
                However, we strongly encourage parents to exercise their own judgment, conduct their own additional checks where they see fit, and remain actively involved in monitoring their child&apos;s sessions, particularly in the early stages of any placement.
              </p>
            </div>

            {/* Section 9 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">9. Limitation of Liability</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>We are not liable for the actions, conduct, negligence, or omissions of any Tutor or Shadow Teacher matched through our Platform, as they operate as independent professionals and not as our employees or agents.</li>
                <li>We are not liable for any indirect, incidental, or consequential damages arising from use of our Platform or services.</li>
                <li>Our total liability, if any, arising from your use of the Platform shall not exceed the total fees paid by you to us in the preceding three months.</li>
              </ul>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
                <strong>Note:</strong> This clause typically needs to be reviewed and calibrated by a lawyer to be enforceable in your jurisdiction — please treat this as a placeholder reflecting common practice, not a guarantee of legal protection.
              </div>
            </div>

            {/* Section 10 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">10. Data &amp; Privacy</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                Your use of the Platform is also governed by our <Link href="/privacy" className="text-accent font-bold hover:underline">Privacy Policy</Link>, which explains how we collect, use, store, and protect your personal information and your child&apos;s information, including sensitive data such as health or diagnostic details. Please review it carefully.
              </p>
            </div>

            {/* Section 11 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">11. Reviews &amp; Testimonials</h2>
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li>Reviews may only be submitted by parents who have completed a placement through our Platform.</li>
                <li>All reviews are subject to moderation and approval before being published publicly.</li>
                <li>We reserve the right to reject or remove reviews that are abusive, defamatory, contain private information about a child, or otherwise violate these Terms.</li>
              </ul>
            </div>

            {/* Section 12 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">12. Cancellations</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                Cancellation policies for consultations and placements are determined on a case-by-case basis. Parents who wish to cancel a scheduled consultation or an in-progress placement should contact us directly. Refund eligibility, if any, will depend on the stage of the engagement and the specific circumstances. We will work with you in good faith to find a fair resolution.
              </p>
            </div>

            {/* Section 13 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">13. Modifications to Terms</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                We may update these Terms from time to time. Continued use of the Platform after changes are posted constitutes your acceptance of the revised Terms. We will update the &quot;Last Updated&quot; date at the top of this page when changes are made.
              </p>
            </div>

            {/* Section 14 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">14. Governing Law &amp; Dispute Resolution</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                These Terms are governed by the laws of India. Any disputes arising from these Terms or use of the Platform shall be subject to the exclusive jurisdiction of the courts in Greater Noida, Uttar Pradesh.
              </p>
            </div>

            {/* Section 15 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-primary">15. Contact Us</h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                For any questions about these Terms, please contact us at:
              </p>
              <div className="bg-brand-light border border-brand-border rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3 text-sm text-brand-dark font-medium">
                  <Mail size={16} className="text-accent shrink-0" />
                  <a href="mailto:aryanbeltharia1419@gmail.com" className="hover:text-accent transition-colors">aryanbeltharia1419@gmail.com</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-dark font-medium">
                  <Phone size={16} className="text-accent shrink-0" />
                  <a href="tel:+916396309989" className="hover:text-accent transition-colors">+91 6396309989</a>
                </div>
                <div className="flex items-start gap-3 text-sm text-brand-dark font-medium">
                  <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
                  <span>Delta 1, D-38, Greater Noida, Uttar Pradesh</span>
                </div>
              </div>
            </div>

            <hr className="border-brand-border" />

            {/* Disclaimer */}
            <div className="p-5 bg-brand-light border border-brand-border rounded-2xl space-y-2">
              <p className="text-xs text-brand-muted leading-relaxed italic">
                This document is a starting template and has not been reviewed by a licensed lawyer. Given that this Platform handles payments and sensitive information about minors, we strongly recommend having these Terms reviewed by a qualified lawyer familiar with Indian consumer protection, data protection (DPDP Act), and child safety regulations before publishing them live.
              </p>
            </div>

          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
