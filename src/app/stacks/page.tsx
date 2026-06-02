import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd, { breadcrumbSchema } from '@/components/JsonLd';
import { stacks, getSoftwareForAlternative, getSubscriptionToolBySlug, software } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'No-Subscription Software Stacks',
  description:
    'Pre-built software bundles organized by role. Replace your subscription stack with one-time purchase and open-source alternatives.',
  alternates: {
    canonical: '/stacks',
  },
  openGraph: {
    title: 'No-Subscription Software Stacks',
    description:
      'Pre-built software bundles organized by role. Replace your subscription stack with one-time purchase and open-source alternatives.',
    url: '/stacks',
    type: 'website',
  },
};

export default function StacksPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Stacks', url: '/stacks' },
        ])}
      />
      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Software Stacks
            </span>
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-5">
              No-Subscription<br />
              <span className="text-amber-400">Software Stacks</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Pre-built software bundles for every role. Replace your entire subscription stack with one-time purchase and open-source alternatives.
            </p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stacks.map((stack) => (
            <Link
              key={stack.id}
              href={`/stacks/${stack.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover-lift hover:border-amber-300 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl">{stack.icon}</span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {stack.name}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">{stack.items.length} tools</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{stack.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">Estimated annual savings</span>
                <span className="text-sm font-bold text-emerald-600">{formatPrice(stack.annualSavings)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
