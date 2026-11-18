import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-light/40">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
        <div className="max-w-xl w-full bg-white border border-brand-border rounded-3xl p-8 sm:p-12 text-center shadow-sm space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">
            Error 404 — Page Not Found
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-primary">
            We couldn&apos;t find that page
          </h1>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
            The link you followed may have moved or been updated. Explore our shadow teacher programs, home tutoring, therapy sessions, or educational guides below.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/"
              className="btn-gradient px-6 py-3 rounded-full text-sm font-bold text-white shadow"
            >
              Return Home
            </Link>
            <Link
              href="/services"
              className="px-5 py-3 rounded-full text-sm font-bold border border-brand-border text-primary hover:bg-brand-light transition-colors"
            >
              Explore Services
            </Link>
            <Link
              href="/therapies"
              className="px-5 py-3 rounded-full text-sm font-bold border border-brand-border text-primary hover:bg-brand-light transition-colors"
            >
              Therapy Programs
            </Link>
            <Link
              href="/resources"
              className="px-5 py-3 rounded-full text-sm font-bold border border-brand-border text-primary hover:bg-brand-light transition-colors"
            >
              Parent Guides
            </Link>
            <Link
              href="/book"
              className="px-5 py-3 rounded-full text-sm font-bold border border-secondary/30 text-secondary hover:bg-secondary/5 transition-colors"
            >
              Book Consultation (₹99)
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
