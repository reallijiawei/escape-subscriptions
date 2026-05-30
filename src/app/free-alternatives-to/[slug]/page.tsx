import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import AlternativeComparisonTable from '@/components/AlternativeComparisonTable';
import AlternativeCardList from '@/components/AlternativeCardList';
import FAQSection from '@/components/FAQSection';
import JsonLd, { faqSchema, breadcrumbSchema } from '@/components/JsonLd';
import {
  subscriptionTools,
  getFreeAlternativesForTool,
  getSoftwareForAlternative,
} from '@/lib/data';
import { getSeoContent } from '@/lib/seo-content';
import { formatPrice, formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return subscriptionTools
    .filter((tool) => getFreeAlternativesForTool(tool.id).length > 0)
    .map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = subscriptionTools.find((t) => t.slug === slug);
  if (!tool) return {};

  const title = `Free Alternatives to ${tool.name} — No Subscription Needed`;
  const description = `Discover free and open-source alternatives to ${tool.name}. Compare features, save money, and break free from subscription costs.`;

  return {
    title,
    description,
    alternates: { canonical: `/free-alternatives-to/${slug}` },
    openGraph: { title, description, url: `/free-alternatives-to/${slug}`, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function FreeAlternativesPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = subscriptionTools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const relations = getFreeAlternativesForTool(tool.id);

  if (relations.length === 0) {
    notFound();
  }

  const alternatives = relations
    .map((relation) => {
      const software = getSoftwareForAlternative(relation);
      return software ? { relation, software } : null;
    })
    .filter(Boolean) as { relation: any; software: any }[];

  const yearlyCost = (tool.monthlyPrice || 0) * 12;
  const threeYearCost = yearlyCost * 3;

  const bestOverall = alternatives.find((a) => a.relation.recommendationRank === 1);

  const lastChecked = alternatives.reduce((latest, a) => {
    return a.software.lastCheckedAt > latest ? a.software.lastCheckedAt : latest;
  }, alternatives[0]?.software.lastCheckedAt || '');

  const seoContent = getSeoContent(tool.id);

  const faqItems = [
    {
      question: `Are free alternatives to ${tool.name} any good?`,
      answer: `Yes, many free alternatives to ${tool.name} are excellent. ${bestOverall?.software.name || 'The top pick'} is used by millions of people and offers most of the core features that ${tool.name} provides, without any cost.`,
    },
    {
      question: `What is the best free alternative to ${tool.name}?`,
      answer: `The best free alternative depends on your needs. ${bestOverall?.software.name || 'GIMP'} is the most popular free option that can replace ${tool.name} for most users. It has an active community and regular updates.`,
    },
    {
      question: `Is free software safe to use?`,
      answer: `Free and open-source software is often safer than proprietary alternatives because the code is publicly auditable. ${alternatives.filter((a) => a.software.isOpenSource).length > 0 ? 'Many of the alternatives listed above are open source, meaning their code is transparent and community-reviewed.' : 'Always download from official sources.'}`,
    },
    {
      question: `Will I lose features by switching to a free alternative?`,
      answer: `You may lose some advanced or niche features, but free alternatives cover the core functionality most users need. The trade-off is worth it for the cost savings — ${formatPrice(yearlyCost)}/year that stays in your pocket.`,
    },
    {
      question: `Can I switch back to ${tool.name} if I don't like the free alternative?`,
      answer: `Absolutely. Most free alternatives can export your data in standard formats, making it easy to switch back or try another option. There's no lock-in with free software.`,
    },
  ];

  return (
    <div>
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Free Alternatives', url: '/search' },
          { name: `Free ${tool.name} Alternatives`, url: `/free-alternatives-to/${slug}` },
        ])}
      />

      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Free alternatives
            </span>
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-5">
              Free Alternatives to {tool.name}
              <br />
              <span className="text-emerald-400">No Subscription Needed</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Stop paying {formatPrice(tool.monthlyPrice || 0)}/month for {tool.name}.
              These free and open-source alternatives give you the core features without the subscription.
            </p>
            <div className="mt-4">
              <Link
                href={`/alternatives/${slug}`}
                className="text-amber-400 hover:text-amber-300 underline text-sm transition-colors"
              >
                See all {tool.name} alternatives (including paid)
              </Link>
            </div>
            {lastChecked && (
              <p className="text-xs text-slate-500 mt-4">
                Last updated: {formatDate(lastChecked)}
              </p>
            )}
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        {/* SEO Intro */}
        {seoContent && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
            <p className="text-slate-700 leading-relaxed text-base">
              {seoContent.detailedIntro}
            </p>
            <p className="mt-4 text-sm text-slate-600">
              The following free and open-source alternatives have been evaluated for features, usability, and long-term viability. Each one eliminates the ${formatPrice(tool.monthlyPrice || 0)}/month subscription cost while keeping the core functionality you need.
            </p>
          </div>
        )}

        {/* Savings Highlight */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8 mb-8 animate-fade-in-up">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">How Much You Save</h2>
          <p className="text-lg sm:text-xl font-bold text-slate-900 font-display mb-5">
            Switching to a free alternative saves you{' '}
            <span className="text-emerald-600">{formatPrice(yearlyCost)}/year</span>
            {threeYearCost > 0 && (
              <>
                {' '}— <span className="text-amber-600">{formatPrice(threeYearCost)}</span> over 3 years
              </>
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">{tool.name} costs</p>
              <p className="text-xl font-bold text-slate-900 font-display">{formatPrice(yearlyCost)}/yr</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs text-amber-600 mb-1">3-year cost</p>
              <p className="text-xl font-bold text-amber-700 font-display">{formatPrice(threeYearCost)}</p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs text-emerald-600 mb-1">Free alternative</p>
              <p className="text-xl font-bold text-emerald-700 font-display">$0</p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8 overflow-hidden">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Free Alternatives Comparison</h2>
          <AlternativeComparisonTable alternatives={alternatives} />
        </div>

        {/* Alternative Cards */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Detailed Alternatives</h2>
          <AlternativeCardList
            alternatives={alternatives}
            toolSlug={tool.slug}
            toolName={tool.name}
            bestOverallId={bestOverall?.software.id}
          />
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
          <FAQSection items={faqItems} />
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-center grain-bg">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Ready to stop paying for {tool.name}?
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              These free alternatives let you own your tools without spending a dime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={bestOverall?.software.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors"
              >
                Try {bestOverall?.software.name || 'the best alternative'} free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
              </a>
              <Link
                href={`/alternatives/${slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-colors"
              >
                See all alternatives to {tool.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
