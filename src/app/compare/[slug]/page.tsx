import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ComparisonTable from '@/components/ComparisonTable';
import PricingBadge from '@/components/PricingBadge';
import PlatformBadges from '@/components/PlatformBadges';
import FAQSection from '@/components/FAQSection';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
import TrustBadge from '@/components/TrustBadge';
import ShareButtons from '@/components/ShareButtons';
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
  const yearlyCost = (subscriptionTool.monthlyPrice || 0) * 12;
  const isFree = software.pricingType === 'FREE' || software.pricingType === 'OPEN_SOURCE';
  const priceStr = software.startingPrice ? `$${software.startingPrice}` : isFree ? 'Free' : software.priceText;

  const title = `${software.name} vs ${subscriptionTool.name} — ${priceStr} Alternative?`;
  const description = yearlyCost > 0
    ? `${subscriptionTool.name} costs $${subscriptionTool.monthlyPrice}/mo ($${yearlyCost}/yr). ${software.name} is ${priceStr}. Honest comparison: what you gain, what you lose, and whether switching is worth it.`
    : `Compare ${software.name} and ${subscriptionTool.name} — pricing, features, platforms, and migration guide. Is the switch worth it?`;

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

  const isFree = software.pricingType === 'FREE' || software.pricingType === 'OPEN_SOURCE';
  const isOss = software.isOpenSource;

  const faqItems = [
    {
      question: `Is ${software.name} a good alternative to ${subscriptionTool.name}?`,
      answer: `Yes, ${software.name} is a solid alternative to ${subscriptionTool.name}. It offers ${isFree ? 'free access' : software.pricingType === 'FREEMIUM' ? 'a free tier' : 'a one-time purchase'} with ${isOss ? 'open source code' : 'professional features'}, making it a great choice for users looking to escape subscriptions. ${software.name} handles the core functionality that most ${subscriptionTool.name} users rely on daily.`,
    },
    {
      question: `How much can I save by switching from ${subscriptionTool.name} to ${software.name}?`,
      answer: `Switching from ${subscriptionTool.name} (${formatPrice(yearlyCost)}/year) to ${software.name} (${software.priceText || 'free'}) can save you approximately ${formatPrice(yearlyCost)} per year, or ${formatPrice(threeYearCost)} over three years. ${software.startingPrice ? `After the one-time $${software.startingPrice} purchase, all savings are pure profit.` : 'The savings start immediately with zero upfront cost.'}`,
    },
    {
      question: `What do I lose by switching from ${subscriptionTool.name} to ${software.name}?`,
      answer: `The main trade-offs include: ${relation.whatYouLose.slice(0, 3).join(', ')}. However, ${software.name} still covers the core functionality most users need. The gaps are typically in advanced features and ecosystem integrations, not daily-use capabilities.`,
    },
    {
      question: `Can I migrate my data from ${subscriptionTool.name} to ${software.name}?`,
      answer: `Yes. Most ${subscriptionTool.name} data can be exported in standard formats (CSV, PDF, or native format) and imported into ${software.name}. The migration difficulty is rated as ${relation.migrationDifficulty.toLowerCase()}, so ${relation.migrationDifficulty === 'EASY' ? 'it should be straightforward' : relation.migrationDifficulty === 'MEDIUM' ? 'it may take some effort' : 'plan for a more involved transition'}.`,
    },
    {
      question: `Is ${software.name} ${isFree ? 'really free' : 'a one-time purchase'}?`,
      answer: isFree
        ? `Yes, ${software.name} is completely free to use${isOss ? ' and open-source' : ''}. There are no hidden costs, no premium tiers, and no feature restrictions for core functionality.`
        : `Yes, ${software.name} costs ${software.priceText || 'a one-time fee'}. You pay once and own it forever — no monthly or annual subscription fees.`,
    },
    {
      question: `Does ${software.name} work on the same platforms as ${subscriptionTool.name}?`,
      answer: `${software.name} is available on ${software.platforms.join(', ').replace(/_/g, ' ').toLowerCase()}. ${software.platforms.length >= 3 ? 'This covers all major platforms, so you can use it on all your devices.' : 'Check the official website for the most up-to-date platform support.'}`,
    },
  ];

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/search' },
          { name: `${software.name} vs ${subscriptionTool.name}`, url: `/compare/${slug}` },
        ])}
      />
      <JsonLd data={faqSchema(faqItems)} />

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
            <div className="mt-4">
              <TrustBadge lastChecked={software.lastCheckedAt} />
            </div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <div className="flex items-center justify-between mb-6">
          <Breadcrumb items={[{ name: 'Compare', href: '/search' }, { name: `${software.name} vs ${subscriptionTool.name}` }]} />
          <ShareButtons title={`${software.name} vs ${subscriptionTool.name}`} url={`/compare/${slug}`} />
        </div>
        {/* Detailed Comparison Intro */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <p className="text-slate-700 leading-relaxed text-base">
            {software.name} and {subscriptionTool.name} both serve {subscriptionTool.commonUseCases?.slice(0, 2).join(' and ').toLowerCase() || 'similar purposes'}, but they differ fundamentally in pricing and ownership. {subscriptionTool.name} costs {formatPrice(subscriptionTool.monthlyPrice || 0)}/month ({formatPrice(yearlyCost)}/year), while {software.name} is {isFree ? 'completely free' : `available for ${software.priceText || 'a one-time purchase'}`}. {isOss ? `As an open-source tool, ${software.name}'s code is publicly auditable and community-driven.` : `${software.name} offers professional features without ongoing fees.`} This comparison breaks down exactly what you gain, what you lose, and whether switching makes sense for your workflow.
          </p>
        </div>

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

        {/* Quick Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Best for</h3>
            <ul className="space-y-1.5">
              {relation.bestFor.slice(0, 3).map((item: string, i: number) => (
                <li key={i} className="flex items-start text-sm text-emerald-800">
                  <span className="text-emerald-500 mr-2 mt-0.5">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Not ideal for</h3>
            <ul className="space-y-1.5">
              {relation.notFor.slice(0, 3).map((item: string, i: number) => (
                <li key={i} className="flex items-start text-sm text-slate-600">
                  <span className="text-slate-400 mr-2 mt-0.5">−</span>
                  {item}
                </li>
              ))}
            </ul>
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

        {/* Migration Guide */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Migration Guide</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Switching from {subscriptionTool.name} to {software.name} is rated as{' '}
            <span className={`font-semibold ${
              relation.migrationDifficulty === 'EASY' ? 'text-emerald-600' :
              relation.migrationDifficulty === 'MEDIUM' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {relation.migrationDifficulty.toLowerCase()}
            </span>.
            Here&apos;s how to make the move:
          </p>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Export your data', desc: `Go to ${subscriptionTool.name}'s settings and export your data in CSV, PDF, or native format. Most tools support bulk export.` },
              { step: '2', title: `Install ${software.name}`, desc: `Download ${software.name} from the official website. ${software.hasFreeTrial ? 'It offers a free trial, so you can test before committing.' : software.pricingType === 'FREE' || software.pricingType === 'OPEN_SOURCE' ? 'It\'s completely free to use.' : `It costs ${software.priceText} — a one-time purchase.`}` },
              { step: '3', title: 'Import and configure', desc: `Import your exported data into ${software.name}. Set up your preferences, shortcuts, and workflows to match your existing setup.` },
              { step: '4', title: 'Run in parallel', desc: `Use both tools side-by-side for a week or two. This lets you verify everything works before fully switching.` },
              { step: '5', title: 'Cancel subscription', desc: `Once you're confident ${software.name} meets your needs, cancel your ${subscriptionTool.name} subscription. You've escaped the subscription!` },
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

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
          <FAQSection items={faqItems} />
        </div>

        {/* Other Alternatives */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Other Alternatives to {subscriptionTool.name}</h2>
          <p className="text-sm text-slate-600 mb-4">
            {software.name} isn&apos;t the only option. See all alternatives to {subscriptionTool.name}:
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/alternatives/${subscriptionTool.slug}`}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
            >
              All {subscriptionTool.name} alternatives
            </Link>
            <Link
              href={`/free-alternatives-to/${subscriptionTool.slug}`}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
            >
              Free alternatives
            </Link>
            <Link
              href={`/open-source-alternatives-to/${subscriptionTool.slug}`}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
            >
              Open source alternatives
            </Link>
          </div>
        </div>

        {/* Related Comparisons */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Related Comparisons</h2>
          <div className="flex flex-wrap gap-2">
            {getAllComparisons()
              .filter((c) => c.subscriptionTool.id === subscriptionTool.id && c.software.id !== software.id)
              .slice(0, 4)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
                >
                  {c.software.name} vs {subscriptionTool.name}
                </Link>
              ))}
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
              <Link
                href={`/free-alternatives-to/${subscriptionTool.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl font-semibold transition-colors"
              >
                Free alternatives
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
