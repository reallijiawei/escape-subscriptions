import type { Metadata } from 'next';
import Link from 'next/link';
import SubscriptionCalculator from '@/components/SubscriptionCalculator';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
import { subscriptionTools } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Software Subscription Cost Calculator — See How Much You Overspend',
  description:
    'Calculate how much you spend on software subscriptions per year. Compare with one-time purchase alternatives and see potential savings. Free tool.',
  alternates: {
    canonical: '/calculator',
  },
  openGraph: {
    title: 'Software Subscription Cost Calculator — See How Much You Overspend',
    description:
      'Calculate how much you spend on software subscriptions per year. Compare with one-time purchase alternatives and see potential savings.',
    url: '/calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Software Subscription Cost Calculator — See How Much You Overspend',
    description: 'Calculate how much you spend on software subscriptions per year. Compare with one-time purchase alternatives.',
  },
};

const faqItems = [
  {
    question: 'How does the subscription cost calculator work?',
    answer: 'Select the software subscriptions you currently pay for from our list of 50+ popular tools. The calculator totals your monthly and yearly spend, then shows one-time purchase alternatives that could save you money long-term.',
  },
  {
    question: 'How accurate are the subscription prices?',
    answer: 'We check pricing data weekly and update our database when changes occur. Prices shown are standard retail prices for individual plans — team or enterprise plans may differ. Each tool page shows when it was last verified.',
  },
  {
    question: 'What counts as a subscription?',
    answer: 'Any software you pay for on a recurring basis — monthly or annually. This includes cloud services, SaaS tools, app subscriptions, and premium tiers of freemium products. One-time purchases and free open-source tools are not subscriptions.',
  },
  {
    question: 'How much can I realistically save?',
    answer: 'Most users save $300–$800/year by switching to one-time purchase or free alternatives. Over 3 years, savings often exceed $2,000. The exact amount depends on which tools you use and which alternatives you choose.',
  },
  {
    question: 'Are one-time purchases really forever?',
    answer: 'Yes. When you buy software with a one-time payment, you own that version forever. You may choose to pay for major upgrades later, but your current version keeps working. No subscription, no recurring charges, no sudden price increases.',
  },
  {
    question: 'What about cloud features that require a subscription?',
    answer: 'Some subscription tools include cloud sync, collaboration, and online storage. Many one-time purchase alternatives offer local storage, self-hosted sync, or integrate with free cloud services like Dropbox or Google Drive. Check each alternative\'s features to see what works for you.',
  },
];

export default function CalculatorPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Calculator', url: '/calculator' },
        ])}
      />
      <JsonLd data={faqSchema(faqItems)} />

      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Free tool
            </span>
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-5">
              Subscription Cost<br />
              <span className="text-amber-400">Calculator</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              See how much you spend on software subscriptions every year and discover one-time or open-source alternatives.
            </p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <Breadcrumb items={[{ name: 'Calculator' }]} />

        {/* Calculator */}
        <div className="mb-12">
          <SubscriptionCalculator />
        </div>

        {/* Why Switch */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Why Switch to One-Time Purchase?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '💰', title: 'Save money', desc: 'Pay once instead of forever. Most alternatives pay for themselves in 2–6 months.' },
              { icon: '🔒', title: 'Own your data', desc: 'No cloud dependency. Your files stay on your device, not on someone else\'s server.' },
              { icon: '🛡️', title: 'No price hikes', desc: 'Subscription prices increase every year. One-time purchases don\'t.' },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-slate-50 rounded-xl">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Tools */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Most Expensive Subscriptions</h2>
          <div className="space-y-3">
            {subscriptionTools
              .filter((t) => t.monthlyPrice && t.monthlyPrice > 0)
              .sort((a, b) => (b.monthlyPrice || 0) - (a.monthlyPrice || 0))
              .slice(0, 5)
              .map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/alternatives/${tool.slug}`}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50 rounded-xl transition-colors group"
                >
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{tool.name}</p>
                    <p className="text-sm text-slate-500">{formatPrice(tool.monthlyPrice || 0)}/mo ({formatPrice((tool.monthlyPrice || 0) * 12)}/yr)</p>
                  </div>
                  <span className="text-sm text-amber-600 font-semibold flex items-center gap-1.5">
                    Find alternatives
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.question}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-center grain-bg">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Ready to stop overpaying?
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Browse our database of one-time purchase and free alternatives to popular subscription software.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
              >
                Browse Alternatives
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-colors"
              >
                How we collect data
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
