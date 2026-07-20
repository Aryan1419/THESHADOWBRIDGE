'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Mail } from 'lucide-react';
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
            Last Updated: July 20, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose-terms space-y-8 text-left">

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
              
              <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
                <div>
                  <h3 className="font-bold text-brand-dark mb-1">Consultation Fee</h3>
                  <p>The ₹99 consultation fee is <strong>non-refundable</strong> and covers a phone consultation with our team. Booking a consultation does <strong>not</strong> guarantee that a placement will be found or offered.</p>
                </div>

                <div>
                  <h3 className="font-bold text-brand-dark mb-1">Shadow Teacher Placement Fee</h3>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>A one-time Shadow Teacher Placement Fee of <strong>₹5,000</strong> is payable <strong>before interviews begin</strong>, once a family decides to proceed with our Shadow Teacher matching service.</li>
                    <li>This fee covers our sourcing, screening, shortlisting, coordination, and interview arrangement efforts on the family&apos;s behalf — it is a service fee for the work involved in finding suitable candidates, not a guarantee of a specific outcome.</li>
                    <li><strong>Full refund (₹5,000):</strong> If, despite genuine efforts, we are unable to identify any suitable Shadow Teacher option in the parent&apos;s preferred area, the full placement fee will be refunded.</li>
                    <li><strong>Partial refund (₹2,500 — 50%):</strong> If one or more suitable candidates are shared with the parent but the parent chooses not to proceed, due to personal preference or an expectation mismatch, 50% of the placement fee (₹2,500) will be refunded. The remaining ₹2,500 covers the recruitment and screening effort already undertaken.</li>
                    <li><strong>Non-refundable after successful placement:</strong> Once a placement is successfully made and accepted by the parent, the placement fee is non-refundable.</li>
                    <li>Parents may interview shortlisted candidates and request a mutually convenient meeting before confirming a placement.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-brand-dark mb-1">Home Tutor Placement Fee</h3>
                  <p>A one-time Home Tutor Placement Fee of ₹3,000 applies for Home Tutor matches, payable once a match has been confirmed and accepted by the family.</p>
                </div>

                <div>
                  <h3 className="font-bold text-brand-dark mb-1">Notice Period</h3>
                  <p>During the validity of a placement (i.e., while the one-time placement fee of ₹5,000 or ₹3,000 remains in effect for the current academic year), if either the Shadow Teacher wishes to leave, or the parent wishes to discontinue the Shadow Teacher, at least <strong>one month&apos;s advance notice</strong> must be given to the other party. This is to allow both sides reasonable time to make necessary arrangements.</p>
                </div>

                <div>
                  <h3 className="font-bold text-brand-dark mb-1">Post-Placement Support &amp; Replacement (Shadow Teacher)</h3>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>We will conduct initial follow-ups with the family after a Shadow Teacher placement is made.</li>
                    <li><strong>Placement validity is one academic year.</strong> A fresh placement fee applies only if the family requests a new Shadow Teacher after that period. Continuing with the same Shadow Teacher for a subsequent year does not require another placement fee.</li>
                    <li><strong>Replacement may be attempted, at our discretion,</strong> if the placed Shadow Teacher leaves during the validity period for genuine, unavoidable reasons.</li>
                    <li><strong>No replacement will be offered</strong> if the Shadow Teacher leaves due to disrespect, misconduct, unsafe working conditions, unreasonable demands, or non-payment by the parent — as these circumstances are not attributable to us or to the Shadow Teacher&apos;s availability.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-brand-dark mb-1">Salary &amp; Payment Structure (Shadow Teacher Placements)</h3>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>For the <strong>first month</strong> following a confirmed placement, the Shadow Teacher&apos;s salary is split as follows: 50% is retained by The Shadow Bridge as a placement commission, and 50% is paid to the Shadow Teacher.</li>
                    <li><strong>From the second month onwards</strong>, the full salary is paid directly to the Shadow Teacher by the family, and is a private arrangement between the family and the Shadow Teacher, not collected or managed by us.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-brand-dark mb-1">General</h3>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>All payments are processed through our third-party payment gateway (Razorpay). We do not store your card, UPI, or banking details on our servers.</li>
                    <li>We reserve the right to refuse or discontinue our services, at any stage, where false information, misconduct, or safety concerns arise — from either a parent or a Tutor/Shadow Teacher.</li>
                  </ul>
                </div>
              </div>
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
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed italic">
                (This clause typically needs to be reviewed and calibrated by a lawyer to be enforceable in your jurisdiction — please treat this as a placeholder reflecting common practice, not a guarantee of legal protection.)
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
              <ul className="list-disc pl-6 space-y-2 text-brand-muted text-sm leading-relaxed">
                <li><strong>Consultation:</strong> Once a consultation is booked and the ₹99 fee is paid, it cannot be cancelled or refunded, in line with the non-refundable nature of this fee (see Section 5). If you are unable to attend your scheduled consultation, please contact us as soon as possible and we will do our best to reschedule at our discretion.</li>
                <li><strong>Before Placement:</strong> If a parent decides not to proceed after candidates have been shared but before a placement is confirmed, the partial refund terms in Section 5 (50% / ₹2,500) apply.</li>
                <li><strong>After Placement:</strong> Either the family or the Shadow Teacher may end an ongoing placement, subject to the one-month advance notice requirement described in Section 5 (Notice Period). Once a placement is successfully made, the placement fee is non-refundable, and replacement eligibility (not a refund) is governed by the Post-Placement Support &amp; Replacement terms in Section 5.</li>
              </ul>
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
                These Terms are governed by the laws of India. Any disputes arising from these Terms or use of the Platform shall be subject to the exclusive jurisdiction of the courts.
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
                  <a href="mailto:theshadowbridgesupport@gmail.com" className="hover:text-accent transition-colors">theshadowbridgesupport@gmail.com</a>
                </div>
              </div>
            </div>

          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}

