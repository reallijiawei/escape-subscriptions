import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import AlternativeComparisonTable from '@/components/AlternativeComparisonTable';
import AlternativeVoteButtons from '@/components/AlternativeVoteButtons';
import SubmitRecommendation from '@/components/SubmitRecommendation';
import FAQSection from '@/components/FAQSection';
import PricingBadge from '@/components/PricingBadge';
import JsonLd, { faqSchema, breadcrumbSchema } from '@/components/JsonLd';
import {
  subscriptionTools,
  getAlternativesForTool,
  getSoftwareForAlternative,
  getVotesForSoftware,
  getSubmissionsForTool,
} from '@/lib/data';
import { formatPrice } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return subscriptionTools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = subscriptionTools.find((t) => t.slug === slug);
  if (!tool) return {};

  const title = `Best ${tool.name} Alternatives Without Subscription in 2026`;
  const description = `Looking for a no-subscription alternative to ${tool.name}? Compare one-time purchase, open-source, offline, and lifetime alternatives with pricing, pros, cons, and migration tips.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/alternatives/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/alternatives/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function AlternativePage({ params }: PageProps) {
  const { slug } = await params;
  const tool = subscriptionTools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const relations = getAlternativesForTool(tool.id);
  const alternatives = relations
    .map((relation) => {
      const software = getSoftwareForAlternative(relation);
      return software ? { relation, software } : null;
    })
    .filter(Boolean) as { relation: any; software: any }[];

  const yearlyCost = (tool.monthlyPrice || 0) * 12;
  const threeYearCost = yearlyCost * 3;

  const bestOverall = alternatives.find((a) => a.relation.recommendationRank === 1);
  const bestFree = alternatives.find(
    (a) => a.software.pricingType === 'OPEN_SOURCE' || a.software.pricingType === 'FREE'
  );
  const bestOffline = alternatives.find((a) => a.software.isOfflineSupported);

  // Compute community pick based on votes
  const alternativesWithVotes = alternatives.map((a) => ({
    ...a,
    totalVotes: (a.relation.votes || 0) + getVotesForSoftware(a.software.id, a.relation.subscriptionToolId),
  }));
  const communityPick = alternativesWithVotes
    .filter((a) => a.totalVotes > 0)
    .sort((a, b) => b.totalVotes - a.totalVotes)[0];

  const submissions = getSubmissionsForTool(tool.id);

  const faqItems = [
    {
      question: `Is there a one-time purchase alternative to ${tool.name}?`,
      answer: `Yes, there are several one-time purchase alternatives to ${tool.name}. ${bestOverall?.software.name || 'Affinity Photo'} is a popular choice that offers professional features without a subscription.`,
    },
    {
      question: `What is the best free alternative to ${tool.name}?`,
      answer: `The best free alternative depends on your needs. ${bestFree?.software.name || 'GIMP'} is a popular free and open-source option that can replace ${tool.name} for many users.`,
    },
    {
      question: `What is the best open-source alternative to ${tool.name}?`,
      answer: `Open-source alternatives offer transparency and community support. ${bestFree?.software.name || 'GIMP'} is one of the most popular open-source alternatives to ${tool.name}.`,
    },
    {
      question: `Can I replace ${tool.name} completely?`,
      answer: `For most users, yes. While ${tool.name} has some unique features, the alternatives listed above can handle the majority of common use cases. The migration difficulty varies by tool.`,
    },
    {
      question: `What do I lose if I switch from ${tool.name}?`,
      answer: `Switching may mean losing some advanced features, integrations, or workflows specific to ${tool.name}. However, you gain cost savings, often better privacy, and freedom from subscription fees.`,
    },
  ];

  return (
    <div>
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Alternatives', url: '/search' },
          { name: `${tool.name} Alternatives`, url: `/alternatives/${slug}` },
        ])}
      />
      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Alternatives guide
            </span>
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-5">
              Best {tool.name} Alternatives<br />
              <span className="text-amber-400">Without Subscription</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              {tool.description} But its subscription pricing makes many users look for one-time purchase or open-source alternatives.
            </p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        {/* Quick Recommendation */}
        {bestOverall && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8 mb-8 animate-fade-in-up">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Quick Recommendation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestOverall && (
                <Link
                  href={`/software/${bestOverall.software.slug}`}
                  className="group p-5 bg-emerald-50 border border-emerald-100 rounded-xl hover:border-emerald-200 transition-colors"
                >
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Best overall</p>
                  <p className="text-lg font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors">
                    {bestOverall.software.name}
                  </p>
                </Link>
              )}
              {bestFree && (
                <Link
                  href={`/software/${bestFree.software.slug}`}
                  className="group p-5 bg-blue-50 border border-blue-100 rounded-xl hover:border-blue-200 transition-colors"
                >
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Best free/OSS</p>
                  <p className="text-lg font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
                    {bestFree.software.name}
                  </p>
                </Link>
              )}
              {bestOffline && bestOffline.software.id !== bestOverall?.software.id && (
                <Link
                  href={`/software/${bestOffline.software.slug}`}
                  className="group p-5 bg-slate-100 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                >
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Best offline</p>
                  <p className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                    {bestOffline.software.name}
                  </p>
                </Link>
              )}
              {communityPick && communityPick.software.id !== bestOverall?.software.id && (
                <Link
                  href={`/software/${communityPick.software.slug}`}
                  className="group p-5 bg-amber-50 border border-amber-200 rounded-xl hover:border-amber-300 transition-colors"
                >
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Community pick</p>
                  <p className="text-lg font-bold text-amber-900 group-hover:text-amber-700 transition-colors">
                    {communityPick.software.name}
                  </p>
                  <p className="text-xs text-amber-500 mt-1">{communityPick.totalVotes} vote{communityPick.totalVotes !== 1 ? 's' : ''}</p>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Savings Calculator */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Cost Comparison</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Monthly</p>
              <p className="text-xl font-bold text-slate-900 font-display">{formatPrice(tool.monthlyPrice || 0)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Yearly</p>
              <p className="text-xl font-bold text-slate-900 font-display">{formatPrice(yearlyCost)}</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs text-amber-600 mb-1">3-Year Cost</p>
              <p className="text-xl font-bold text-amber-700 font-display">{formatPrice(threeYearCost)}</p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs text-emerald-600 mb-1">Alternative</p>
              <p className="text-xl font-bold text-emerald-700 font-display">
                {bestOverall?.software.startingPrice
                  ? formatPrice(bestOverall.software.startingPrice)
                  : 'Free'}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8 overflow-hidden">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Comparison Table</h2>
          <AlternativeComparisonTable alternatives={alternatives} />
        </div>

        {/* Alternative Cards */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Detailed Alternatives</h2>
          <div className="space-y-4">
            {alternativesWithVotes.map(({ relation, software, totalVotes }, index) => (
              <div
                key={software.id}
                className={`bg-white rounded-2xl border p-6 sm:p-8 hover-lift ${
                  communityPick?.software.id === software.id ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">
                        <Link
                          href={`/software/${software.slug}`}
                          className="hover:text-amber-600 transition-colors"
                        >
                          {software.name}
                        </Link>
                      </h3>
                      {index === 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">
                          Top Pick
                        </span>
                      )}
                      {communityPick?.software.id === software.id && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                          Community Pick
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-amber-600 font-medium">{relation.recommendationLabel}</p>
                  </div>
                  <AlternativeVoteButtons
                    softwareId={software.id}
                    subscriptionToolId={relation.subscriptionToolId}
                    initialVotes={totalVotes}
                  />
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed">{software.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">What you gain</p>
                    <ul className="space-y-2">
                      {relation.whatYouGain.map((item: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-slate-600">
                          <span className="text-emerald-500 mr-2 mt-0.5">+</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">What you lose</p>
                    <ul className="space-y-2">
                      {relation.whatYouLose.map((item: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-slate-600">
                          <span className="text-red-400 mr-2 mt-0.5">−</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-3 flex-wrap">
                    <PricingBadge type={software.pricingType} priceText={software.priceText} />
                    <span className="text-xs text-slate-400">
                      Migration: <span className="font-medium text-slate-600">{relation.migrationDifficulty}</span>
                    </span>
                  </div>
                  <a
                    href={software.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                  >
                    Visit Website
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who Should Switch */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Who Should Switch?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</span>
                Good candidates
              </h3>
              <ul className="space-y-2.5">
                {alternatives[0]?.relation.bestFor.map((item: string, i: number) => (
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
                Should keep using {tool.name}
              </h3>
              <ul className="space-y-2.5">
                {alternatives[0]?.relation.notFor.map((item: string, i: number) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <span className="text-slate-400 mr-2 mt-0.5">−</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Recommendation */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Community Recommendations</h2>
          <SubmitRecommendation subscriptionToolId={tool.id} toolName={tool.name} />
        </div>

        {/* User-Submitted Recommendations */}
        {submissions.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">User-Recommended Alternatives</h2>
            <div className="flex flex-wrap gap-2">
              {submissions.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-sm font-medium text-amber-800"
                >
                  {s.websiteUrl ? (
                    <a
                      href={s.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-600 transition-colors"
                    >
                      {s.softwareName}
                    </a>
                  ) : (
                    s.softwareName
                  )}
                  {s.reason && (
                    <span className="text-amber-400 text-xs" title={s.reason}>*</span>
                  )}
                </span>
              ))}
            </div>
            {submissions.some((s) => s.reason) && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                {submissions.filter((s) => s.reason).map((s) => (
                  <p key={s.id} className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{s.softwareName}:</span> {s.reason}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
          <FAQSection items={faqItems} />
        </div>

        {/* Related Pages */}
        <div className="bg-slate-100 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Related Alternatives</h2>
          <div className="flex flex-wrap gap-2">
            {subscriptionTools
              .filter((t) => t.id !== tool.id)
              .slice(0, 6)
              .map((t) => (
                <Link
                  key={t.id}
                  href={`/alternatives/${t.slug}`}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
                >
                  {t.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
