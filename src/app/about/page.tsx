import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About — How We Find Subscription-Free Software Alternatives',
  description:
    'Learn how Escape Subscriptions evaluates and recommends one-time purchase and open-source alternatives. Our methodology, data sources, and editorial process.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About — How We Find Subscription-Free Software Alternatives',
    description:
      'Learn how Escape Subscriptions evaluates and recommends one-time purchase and open-source alternatives. Our methodology, data sources, and editorial process.',
    url: '/about',
    type: 'website',
  },
};

const faqItems = [
  {
    question: 'How does Escape Subscriptions find alternatives?',
    answer:
      'We manually research each subscription tool and its alternatives. We evaluate pricing, features, platform support, community health, update frequency, and migration difficulty. Every recommendation is tested before being listed.',
  },
  {
    question: 'How often is the data updated?',
    answer:
      'We check pricing and feature data weekly. When a tool changes pricing, adds a new feature, or a new alternative launches, we update our listings within days. Each software page shows when it was last verified.',
  },
  {
    question: 'Is Escape Subscriptions affiliated with any software company?',
    answer:
      'No. We are an independent project. We do not accept payment for recommendations or rankings. Some outbound links may be affiliate links, but this never influences our editorial recommendations.',
  },
  {
    question: 'Why focus on one-time purchase and open-source software?',
    answer:
      'Subscription fatigue is real. We believe software should be owned, not rented. One-time purchase and open-source alternatives give users control over their tools, their data, and their budget.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ])}
      />
      <JsonLd data={faqSchema(faqItems)} />

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
          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="heading-editorial text-2xl text-slate-900 mb-4 diagonal-accent">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              Too many great tools have moved to subscription models, locking users into recurring payments
              they don&apos;t need. We believe you should be able to pay once and own your software forever.
              That&apos;s why we built Escape Subscriptions — a search engine and directory for finding
              one-time purchase, open-source, offline, and lifetime alternatives to subscription software.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              We track {`50+`} subscription tools and {`100+`} alternatives across design, development,
              productivity, security, and more. Every listing includes honest pros and cons, migration difficulty
              ratings, and real pricing data — not marketing fluff.
            </p>
          </div>

          {/* Methodology */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="heading-editorial text-2xl text-slate-900 mb-4 diagonal-accent">Our Methodology</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              We take a systematic approach to evaluating alternatives. Here&apos;s how each tool gets assessed:
            </p>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Identify the subscription pain', desc: 'We document what the subscription tool does well, what it costs, and where users feel the most friction.' },
                { step: '2', title: 'Research alternatives', desc: 'We search for one-time purchase, open-source, and free alternatives. We check GitHub stars, community activity, update frequency, and user reviews.' },
                { step: '3', title: 'Test and compare', desc: 'We install and test each alternative. We compare core features, performance, learning curve, and ecosystem integrations.' },
                { step: '4', title: 'Document trade-offs', desc: 'We list what you gain, what you lose, and who should (and shouldn\'t) switch. No tool is perfect — we\'re honest about limitations.' },
                { step: '5', title: 'Keep it current', desc: 'We re-check pricing and features weekly. When a tool changes, we update our data within days.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center text-amber-700 font-bold text-sm">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What We Offer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="heading-editorial text-2xl text-slate-900 mb-4 diagonal-accent">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🔍', title: 'Comprehensive Database', desc: '50+ subscription tools and 100+ alternatives, all in one place.' },
                { icon: '📊', title: 'Honest Comparisons', desc: 'Pricing, features, migration difficulty, and risk analysis — no marketing BS.' },
                { icon: '🧮', title: 'Cost Calculator', desc: 'See exactly how much you can save by switching to alternatives.' },
                { icon: '📋', title: 'Migration Guides', desc: 'Step-by-step help to make the switch painless.' },
                { icon: '📦', title: 'Software Stacks', desc: 'Curated bundles of tools that work well together.' },
                { icon: '👤', title: 'Use Case Guides', desc: 'Recommendations tailored to freelancers, students, developers, and more.' },
              ].map((item) => (
                <div key={item.title} className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="heading-editorial text-2xl text-slate-900 mb-4 diagonal-accent">Data Sources & Transparency</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our data comes from:
            </p>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>Official websites</strong> — pricing pages, feature lists, and documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>GitHub repositories</strong> — stars, commit frequency, contributor count, and release history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>Community forums</strong> — Reddit, Hacker News, and product review sites</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>Hands-on testing</strong> — we install and use each tool before recommending it</span>
              </li>
            </ul>
            <p className="text-slate-500 text-sm mt-4">
              Each software page shows a &ldquo;Last verified&rdquo; date so you know how fresh the data is.
            </p>
          </div>

          {/* Editorial Independence */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="heading-editorial text-2xl text-slate-900 mb-4 diagonal-accent">Editorial Independence</h2>
            <p className="text-slate-600 leading-relaxed">
              We do not accept payment for recommendations or rankings. Our goal is to help users find the best
              tool for their needs, not to promote any particular product. If we list an affiliate link, it&apos;s
              clearly marked and never influences our editorial judgment. We would rather recommend a free tool
              that works well than a paid tool that doesn&apos;t.
            </p>
          </div>

          {/* Team */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="heading-editorial text-2xl text-slate-900 mb-4 diagonal-accent">Who Runs This?</h2>
            <p className="text-slate-600 leading-relaxed">
              Escape Subscriptions is run by a small team of software enthusiasts who are tired of the
              subscription economy. We use the tools we recommend and test every alternative before listing it.
              Our goal is simple: help you find software you can own, not rent.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Have a suggestion or found an error? Reach out at{' '}
              <a href="mailto:hello@escapesubscriptions.online" className="text-amber-600 hover:text-amber-700">
                hello@escapesubscriptions.online
              </a>
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="heading-editorial text-2xl text-slate-900 mb-6 diagonal-accent">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqItems.map((item, i) => (
                <div key={i}>
                  <h3 className="font-bold text-slate-900 mb-2">{item.question}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
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
