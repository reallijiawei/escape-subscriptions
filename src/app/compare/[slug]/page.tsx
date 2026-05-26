import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ComparisonTable from '@/components/ComparisonTable';
import PricingBadge from '@/components/PricingBadge';
import PlatformBadges from '@/components/PlatformBadges';
import JsonLd, { breadcrumbSchema } from '@/components/JsonLd';
import { getAllComparisons, getComparisonBySlug } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) return {};

  const { software, subscriptionTool } = comparison;
  const title = `${software.name} vs ${subscriptionTool.name} — Which Is Better?`;
  const description = `Compare ${software.name} and ${subscriptionTool.name}: pricing, features, platforms, and whether switching from a subscription is worth it.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/compare/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/compare/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  const { software, subscriptionTool, relation } = comparison;
  const yearlyCost = (subscriptionTool.monthlyPrice || 0) * 12;
  const threeYearCost = yearlyCost * 3;

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/search' },
          { name: `${software.name} vs ${subscriptionTool.name}`, url: `/compare/${slug}` },
        ])}
      />

      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Comparison
            </span>
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-5">
              {software.name}{' '}
              <span className="text-slate-400">vs</span>{' '}
              {subscriptionTool.name}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Is switching from {subscriptionTool.name} to {software.name} worth it?
              Here&apos;s a detailed comparison of pricing, features, and ownership.
            </p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        {/* Quick Verdict */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8 mb-8 animate-fade-in-up">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Verdict</h2>
          {yearlyCost > 0 && (
            <p className="text-lg sm:text-xl font-bold text-slate-900 font-display mb-5">
              Switching to {software.name} saves you{' '}
              <span className="text-emerald-600">{formatPrice(yearlyCost)}/year</span>
              {threeYearCost > 0 && (
                <>
                  {' '}— <span className="text-amber-600">{formatPrice(threeYearCost)}</span> over 3 years
                </>
              )}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">{subscriptionTool.name} costs</p>
              <p className="text-xl font-bold text-slate-900 font-display">{formatPrice(yearlyCost)}/yr</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs text-amber-600 mb-1">3-year cost</p>
              <p className="text-xl font-bold text-amber-700 font-display">{formatPrice(threeYearCost)}</p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs text-emerald-600 mb-1">{software.name} costs</p>
              <p className="text-xl font-bold text-emerald-700 font-display">
                {software.startingPrice ? formatPrice(software.startingPrice) : software.priceText || 'Free'}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8 overflow-hidden">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Feature Comparison</h2>
          <ComparisonTable software={software} subscriptionTool={subscriptionTool} relation={relation} />
        </div>

        {/* What You Gain / Lose */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Switching Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">+</span>
                What you gain with {software.name}
              </h3>
              <ul className="space-y-2.5">
                {relation.whatYouGain.map((item: string, i: number) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <span className="text-emerald-400 mr-2 mt-0.5">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs">−</span>
                What you lose
              </h3>
              <ul className="space-y-2.5">
                {relation.whatYouLose.map((item: string, i: number) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <span className="text-red-400 mr-2 mt-0.5">−</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Who Should Switch */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Who Should Switch?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</span>
                Good candidates for {software.name}
              </h3>
              <ul className="space-y-2.5">
                {relation.bestFor.map((item: string, i: number) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <span className="text-emerald-400 mr-2 mt-0.5">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">✗</span>
                Should keep using {subscriptionTool.name}
              </h3>
              <ul className="space-y-2.5">
                {relation.notFor.map((item: string, i: number) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <span className="text-slate-400 mr-2 mt-0.5">−</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-center grain-bg">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Ready to stop renting {subscriptionTool.name}?
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {software.name} is a {software.pricingType === 'FREE' ? 'free' : software.pricingType === 'FREEMIUM' ? 'free to start' : 'one-time purchase'} alternative that lets you own your tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={software.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
              >
                Try {software.name} free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
              </a>
              <Link
                href={`/alternatives/${subscriptionTool.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-colors"
              >
                See all alternatives to {subscriptionTool.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
