import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Escape Subscriptions',
  description:
    'Learn about our mission to help users find one-time purchase, open-source, and lifetime alternatives to subscription software.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Escape Subscriptions',
    description:
      'Learn about our mission to help users find one-time purchase, open-source, and lifetime alternatives to subscription software.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="animate-fade-in-up">
            <h1 className="heading-editorial text-4xl sm:text-5xl md:text-6xl text-white mb-6">
              Software should be <span className="text-amber-400">owned</span>,<br />
              not rented.
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
              We help people escape the subscription trap and find tools they can buy once, use forever, or run locally.
            </p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
        <div className="prose prose-slate max-w-none">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="heading-editorial text-2xl text-slate-900 mb-4 diagonal-accent">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-0">
              Too many great tools have moved to subscription models, locking users into recurring payments
              they don&apos;t need. We believe you should be able to pay once and own your software forever.
              That&apos;s why we built Escape Subscriptions — a search engine and directory for finding
              one-time purchase, open-source, offline, and lifetime alternatives to subscription software.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="heading-editorial text-2xl text-slate-900 mb-4 diagonal-accent">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🔍', title: 'Comprehensive Database', desc: 'Subscription software and their alternatives, all in one place.' },
                { icon: '📊', title: 'Detailed Comparisons', desc: 'Pricing, features, migration difficulty, and risk analysis.' },
                { icon: '🧮', title: 'Cost Calculator', desc: 'See exactly how much you can save by switching.' },
                { icon: '📋', title: 'Migration Guides', desc: 'Step-by-step help to make the switch painless.' },
              ].map((item) => (
                <div key={item.title} className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="heading-editorial text-2xl text-slate-900 mb-4 diagonal-accent">How It Works</h2>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Search', desc: 'Type the subscription software you want to replace.' },
                { step: '02', title: 'Compare', desc: 'See alternatives with pricing, features, and risk levels.' },
                { step: '03', title: 'Switch', desc: 'Follow migration guides and start saving money.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-700 font-bold text-sm font-display">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-center grain-bg">
            <div className="relative z-10">
              <h2 className="heading-editorial text-2xl text-white mb-4">Ready to escape?</h2>
              <p className="text-slate-400 mb-6">
                Start finding alternatives to the software you&apos;re tired of paying for.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25"
              >
                Find Alternatives Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
