import Link from 'next/link';
import Image from 'next/image';
import { Award, CheckCircle2 } from 'lucide-react';

export default function ResourceAuthorCard({
  publishedDate = 'September 27, 2026',
  updatedDate = 'November 18, 2026',
}: {
  publishedDate?: string;
  updatedDate?: string;
}) {
  return (
    <aside
      aria-label="Author and Clinical Reviewer"
      className="bg-white border border-brand-border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-brand-border shrink-0 bg-brand-light">
        <Image
          src="/images/founder_pratibha.jpg"
          alt="Pratibha Mishra — Founder & Lead Educational Mentor at The Shadow Bridge"
          width={64}
          height={64}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
            <Award size={12} /> Written &amp; Clinically Reviewed By
          </span>
          <span className="text-xs text-brand-muted">
            • Published {publishedDate} • Updated {updatedDate}
          </span>
        </div>
        <p className="font-serif font-bold text-primary text-base">
          <Link href="/founder-story" className="hover:underline">
            Pratibha Mishra
          </Link>{' '}
          <span className="font-sans text-xs font-semibold text-brand-muted">
            — Founder &amp; Lead Educational Mentor
          </span>
        </p>
        <p className="text-xs text-brand-muted leading-relaxed flex items-start gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
          <span>
            11+ years in Special Education &amp; Shadow Teacher Supervision; Diplomas in Child Psychology, School Counselling, and Special Education.
          </span>
        </p>
      </div>
    </aside>
  );
}
