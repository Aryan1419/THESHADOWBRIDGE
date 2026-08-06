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
            Last Updated: 06/08/2026
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
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold text-primary">5. Fees &amp; Payments</h2>
              
              {/* Consultation Fee */}
              <div className="space-y-2">
                <h3 className="font-bold text-primary text-base">Consultation Fee</h3>
                <ul className="list-disc pl-6 space-y-1.5 text-brand-muted text-sm leading-relaxed">
                  <li>A consultation fee of ₹99 is mandatory before initiating either the Shadow Teacher or Home Tutor placement process. The consultation is conducted via phone call or video call to understand the child/student&apos;s requirements, learning goals, preferred timings, location, and other relevant details.</li>
                  <li>This fee is <strong>non-refundable</strong>. Booking a consultation does <strong>not</strong> guarantee that a placement will be found or offered.</li>
                </ul>
              </div>

              <hr className="border-brand-border/60" />

              {/* 5A. Shadow Teacher Placement */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-primary text-base">5A. Shadow Teacher Placement</h3>
                
                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">One-Time Placement Fee</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>A one-time, non-recurring Shadow Teacher Placement Fee of <strong>₹5,000</strong> is payable <strong>before interviews begin</strong>, once a family decides to proceed with our Shadow Teacher matching service.</li>
                    <li>This fee covers our sourcing, screening, shortlisting, coordination, and interview arrangement efforts — it is a service fee for the work involved, not a guarantee of a specific outcome.</li>
                  </ul>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">Refund Policy — Before Placement</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li><strong>Full refund (₹5,000):</strong> If, despite genuine efforts, we are unable to identify even a single suitable Shadow Teacher option in the parent&apos;s preferred area or due to other operational constraints, the full placement fee will be refunded.</li>
                    <li><strong>Partial refund (₹2,500 — 50%):</strong> If one or more suitable candidates are shared with the parent but the parent chooses not to proceed with any of them for personal reasons or an expectation mismatch, 50% of the placement fee (₹2,500) will be refunded. The remaining ₹2,500 covers the recruitment and screening effort already undertaken.</li>
                    <li><strong>Non-refundable after placement:</strong> Once the parent confirms a Shadow Teacher and the Shadow Teacher has commenced, the placement fee is non-refundable.</li>
                    <li>Parents may interview shortlisted candidates and request a mutually convenient meeting before confirming a placement.</li>
                  </ul>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">First Month Commission</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>The first month&apos;s agreed salary is shared as follows: 50% is payable to The Shadow Bridge as placement and recruitment commission, and 50% is paid to the Shadow Teacher.</li>
                    <li>From the second month onwards, the full salary is paid directly to the Shadow Teacher by the family, unless otherwise agreed. This is a private arrangement between the family and the Shadow Teacher, not collected or managed by us.</li>
                  </ul>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">Placement Validity, Notice &amp; Replacement</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Placement validity is one academic year. A fresh placement fee applies only if the family requests a new Shadow Teacher after that period. Continuing with the same Shadow Teacher for a subsequent year does not require another placement fee.</li>
                    <li><strong>Notice Period:</strong> During the validity of the placement, if either the Shadow Teacher wishes to leave, or the parent wishes to discontinue the Shadow Teacher, at least <strong>one month&apos;s advance notice</strong> must be given to the other party, to allow reasonable time for necessary arrangements.</li>
                    <li>Replacement may be attempted, at our discretion, if the placed Shadow Teacher leaves during the validity period for genuine, unavoidable reasons.</li>
                    <li>No replacement will be offered if the Shadow Teacher leaves due to disrespect, misconduct, unsafe working conditions, unreasonable demands, or non-payment by the parent.</li>
                    <li>We will conduct initial follow-ups with the family after a Shadow Teacher placement is made.</li>
                  </ul>
                </div>
              </div>

              <hr className="border-brand-border/60" />

              {/* 5B. Home Tutor Placement */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-primary text-base">5B. Home Tutor Placement</h3>
                
                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">One-Time Placement Fee</h4>
                  <p>After the consultation, if the parent decides to proceed with our tutor placement service, a one-time, non-recurring placement fee of <strong>₹3,000</strong> is payable before the tutor search process begins.</p>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">Refund Policy — Before Placement</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li><strong>Full refund (₹3,000):</strong> If The Shadow Bridge is unable to provide even a single suitable tutor option due to non-availability in the requested location or other operational constraints, the entire placement fee will be refunded.</li>
                    <li><strong>Partial refund (₹1,500 — 50%):</strong> If one or more suitable tutor options are shared with the parent, but the parent chooses not to proceed with any of the available options for personal reasons, 50% of the placement fee (₹1,500) will be refunded.</li>
                    <li><strong>Non-refundable after placement:</strong> Once the parent confirms a tutor and the tutor has commenced classes, the placement fee becomes non-refundable.</li>
                  </ul>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">First Month Commission</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>The first month&apos;s tuition fee is shared as follows: 50% of the first month&apos;s agreed tuition fee is payable to The Shadow Bridge as placement and recruitment commission, and the remaining 50% is paid to the tutor.</li>
                    <li>From the second month onwards, parents may pay the tutor directly, unless otherwise agreed.</li>
                  </ul>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">Tutor Replacement Policy</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>If the assigned tutor discontinues the tuition due to personal reasons, the original placement fee remains valid for <strong>3 months</strong> from the tutor&apos;s joining date.</li>
                    <li>During this validity period, The Shadow Bridge will make reasonable efforts to arrange a suitable replacement tutor at no additional placement fee.</li>
                    <li>If a suitable replacement is not available in the requested location within the validity period, the parent will be eligible for a <strong>40% refund of the original placement fee (₹1,200)</strong>.</li>
                    <li>If a replacement tutor is successfully arranged within the validity period, no refund will be applicable.</li>
                  </ul>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">Notice Period</h4>
                  <p>During the validity of the placement, if either the tutor wishes to leave, or the parent wishes to discontinue the tutor, at least <strong>one month&apos;s advance notice</strong> must be given to the other party, to allow reasonable time for necessary arrangements.</p>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">General Conditions</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Tutor selection is based on the student&apos;s requirements, tutor availability, location, qualifications, and schedule compatibility.</li>
                    <li>While every effort is made to provide the most suitable tutor, The Shadow Bridge cannot guarantee a specific tutor, gender, qualification, or availability.</li>
                    <li>Any changes to tuition timings, subject requirements, or location after confirmation may require a fresh tutor search and may be subject to additional charges.</li>
                  </ul>
                </div>
              </div>

              <hr className="border-brand-border/60" />

              {/* 5C. School Collaboration & Placement Services */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-primary text-base">5C. School Collaboration &amp; Placement Services</h3>
                
                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">Consultation Booking Fee</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>A consultation booking fee of <strong>₹199</strong> is payable at the time of submitting a school requirement form to schedule a dedicated assessment call with our Lead Educational Specialist. This fee is non-refundable.</li>
                  </ul>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">One-Time Placement Fee</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Once the consultation call is completed and requirements are finalized, a one-time, non-recurring placement fee of <strong>₹5,000</strong> is payable before educator profile shortlisting and school interviews begin.</li>
                  </ul>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">First Month Commission</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>The school agrees to pay <strong>50% of the first month&apos;s agreed salary</strong> of the selected Shadow Teacher as a one-time recruitment commission to The Shadow Bridge.</li>
                    <li>From the second month onwards, no monthly or recurring commission is levied on the school by The Shadow Bridge.</li>
                  </ul>
                </div>

                <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                  <h4 className="font-bold text-brand-dark">Educator Replacement &amp; Notice</h4>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>In case of unsatisfactory performance or if a placed Shadow Teacher leaves during the placement period, The Shadow Bridge provides a replacement guarantee at no extra placement fee, subject to a reasonable advance notice of at least one month.</li>
                  </ul>
                </div>
              </div>

              <hr className="border-brand-border/60" />

              {/* General (All Services) */}
              <div className="space-y-2 text-brand-muted text-sm leading-relaxed">
                <h3 className="font-bold text-primary text-base">General (All Services)</h3>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>All payments are processed through our third-party payment gateway (Razorpay). We do not store your card, UPI, or banking details on our servers.</li>
                  <li>We reserve the right to refuse or discontinue our services, at any stage, where false information, misconduct, or safety concerns arise — from either a parent or a Tutor/Shadow Teacher.</li>
                </ul>
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
                <li><strong>Consultation:</strong> Once a consultation is booked and the ₹99 fee is paid, it cannot be cancelled or refunded. If you are unable to attend your scheduled consultation, please contact us as soon as possible and we will do our best to reschedule at our discretion.</li>
                <li><strong>Before Placement:</strong> If a parent decides not to proceed after candidates have been shared but before a placement is confirmed, the partial refund terms in Section 5A (Shadow Teacher) or Section 5B (Home Tutor) apply, as relevant.</li>
                <li><strong>After Placement:</strong> Either the family or the Shadow Teacher/Tutor may end an ongoing placement, subject to the one-month advance notice requirement described in Section 5A/5B. Once a placement is successfully made, the placement fee is non-refundable, and replacement eligibility (not a refund) is governed by the Replacement Policy terms in the relevant section.</li>
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

