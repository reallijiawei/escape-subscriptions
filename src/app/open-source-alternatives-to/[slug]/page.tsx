import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import AlternativeComparisonTable from '@/components/AlternativeComparisonTable';
import AlternativeCardList from '@/components/AlternativeCardList';
import FAQSection from '@/components/FAQSection';
import JsonLd, { faqSchema, breadcrumbSchema, itemListSchema } from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
import TrustBadge from '@/components/TrustBadge';
import {
  subscriptionTools,
  getOpenSourceAlternativesForTool,
  getSoftwareForAlternative,
} from '@/lib/data';
import { getSeoContent } from '@/lib/seo-content';
import { formatPrice } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return subscriptionTools
    .filter((tool) => getOpenSourceAlternativesForTool(tool.id).length > 0)
    .map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = subscriptionTools.find((t) => t.slug === slug);
  if (!tool) return {};

  const relations = getOpenSourceAlternativesForTool(tool.id);
  const alts = relations
    .map((r) => getSoftwareForAlternative(r))
    .filter(Boolean) as { name: string }[];
  const altNames = alts.slice(0, 3).map((a) => a.name).join(', ');
  const yearlyCost = (tool.monthlyPrice || 0) * 12;

  const title = `Open Source ${tool.name} Alternatives — ${altNames.split(',')[0]}, Self-Hosted`;
  const description = `Best open-source alternatives to ${tool.name}: ${altNames}. Self-hostable, auditable code, no vendor lock-in. Save $${yearlyCost}/year vs subscription.`;

  return {
    title,
    description,
    alternates: { canonical: `/open-source-alternatives-to/${slug}` },
    openGraph: { title, description, url: `/open-source-alternatives-to/${slug}`, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function OpenSourceAlternativesPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = subscriptionTools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const relations = getOpenSourceAlternativesForTool(tool.id);

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
      question: `What is the best open-source alternative to ${tool.name}?`,
      answer: `${bestOverall?.software.name || 'The top pick'} is the most popular open-source alternative to ${tool.name}. It has an active community, transparent codebase, and is free to use.`,
    },
    {
      question: `Is open-source software as good as ${tool.name}?`,
      answer: `Open-source software has matured significantly. ${bestOverall?.software.name || 'Many alternatives'} now match ${tool.name} in core functionality. The main differences are usually in polish and enterprise integrations, not fundamental capability.`,
    },
    {
      question: `Can I self-host open-source alternatives to ${tool.name}?`,
      answer: `Many open-source alternatives can be self-hosted, giving you full control over your data. ${alternatives.filter((a) => a.software.platforms?.includes('SELF_HOSTED')).length > 0 ? 'Several options listed above support self-hosting.' : 'Check the individual tool pages for self-hosting options.'}`,
    },
    {
      question: `Is open-source software secure?`,
      answer: `Open-source software is often more secure than proprietary alternatives because the code is publicly auditable. Security researchers and the community can review and report vulnerabilities, leading to faster fixes.`,
    },
    {
      question: `What about support for open-source alternatives?`,
      answer: `Open-source projects typically have community forums, documentation, and chat channels. Some also offer commercial support tiers. The community support is often faster and more helpful than vendor support.`,
    },
  ];

  return (
    <div>
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Open Source Alternatives', url: '/search' },
          { name: `Open Source ${tool.name} Alternatives`, url: `/open-source-alternatives-to/${slug}` },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          alternatives.map((a, i) => ({
            name: a.software.name,
            url: `/software/${a.software.slug}`,
            position: i + 1,
          }))
        )}
      />

      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Open source alternatives
            </span>
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-5">
              Open Source Alternatives to {tool.name}
              <br />
              <span className="text-blue-400">Transparent & Community-Driven</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Replace {tool.name} with open-source software you can inspect, modify, and self-host.
              No vendor lock-in, no hidden costs, full control over your data.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/alternatives/${slug}`}
                className="text-amber-400 hover:text-amber-300 underline text-sm transition-colors"
              >
                See all {tool.name} alternatives (including paid)
              </Link>
              <Link
                href={`/free-alternatives-to/${slug}`}
                className="text-emerald-400 hover:text-emerald-300 underline text-sm transition-colors"
              >
                Free alternatives to {tool.name}
              </Link>
            </div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <Breadcrumb items={[{ name: 'Alternatives', href: '/search' }, { name: `Open Source ${tool.name} Alternatives` }]} />
        {lastChecked && <div className="mb-6"><TrustBadge lastChecked={lastChecked} /></div>}
        {/* SEO Intro */}
        {seoContent && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
            <p className="text-slate-700 leading-relaxed text-base">
              {seoContent.detailedIntro}
            </p>
            <p className="mt-4 text-sm text-slate-600">
              Open-source alternatives give you something subscription software never can: the ability to inspect, modify, and self-host the code. This means full transparency, no vendor lock-in, and the freedom to run the software on your own terms. The following open-source alternatives have been evaluated for features, community health, and long-term viability.
            </p>
          </div>
        )}

        {/* Savings Highlight */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8 mb-8 animate-fade-in-up">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Why Open Source?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs text-blue-600 mb-1">Transparent Code</p>
              <p className="text-sm font-medium text-blue-800">Audit the code yourself. No hidden trackers or data collection.</p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs text-emerald-600 mb-1">Save Per Year</p>
              <p className="text-xl font-bold text-emerald-700 font-display">{formatPrice(yearlyCost)}</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs text-amber-600 mb-1">3-Year Savings</p>
              <p className="text-xl font-bold text-amber-700 font-display">{formatPrice(threeYearCost)}</p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8 overflow-hidden">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Open Source Alternatives Comparison</h2>
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
              Take control with open source
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Replace {tool.name} with software you own and control. No subscriptions, no lock-in.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={bestOverall?.software.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
              >
                Try {bestOverall?.software.name || 'the best alternative'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
              </a>
              <Link
                href={`/alternatives/${slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-colors"
              >
                See all alternatives to {tool.name}
              </Link>
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-colors"
              >
                Calculate savings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
