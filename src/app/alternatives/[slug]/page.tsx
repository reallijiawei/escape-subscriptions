import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import AlternativeComparisonTable from '@/components/AlternativeComparisonTable';
import QuickRecommendation from '@/components/QuickRecommendation';
import AlternativeCardList from '@/components/AlternativeCardList';
import SubmitRecommendation from '@/components/SubmitRecommendation';
import FAQSection from '@/components/FAQSection';
import EmailSubscribe from '@/components/EmailSubscribe';
import Breadcrumb from '@/components/Breadcrumb';
import TrustBadge from '@/components/TrustBadge';
import JsonLd, { faqSchema, breadcrumbSchema, itemListSchema } from '@/components/JsonLd';
import {
  subscriptionTools,
  getAlternativesForTool,
  getFreeAlternativesForTool,
  getOpenSourceAlternativesForTool,
  getSoftwareForAlternative,
  getSubmissionsForTool,
} from '@/lib/data';
import { getSeoContent } from '@/lib/seo-content';
import { formatPrice, formatDate } from '@/lib/utils';

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

  const relations = getAlternativesForTool(tool.id);
  const alts = relations
    .map((r) => getSoftwareForAlternative(r))
    .filter(Boolean) as { name: string; pricingType: string }[];
  const topAlt = alts[0]?.name || 'free alternatives';
  const freeAlt = alts.find((a) => a.pricingType === 'FREE' || a.pricingType === 'OPEN_SOURCE');
  const yearlyCost = (tool.monthlyPrice || 0) * 12;

  // Title includes top alternative name for better CTR
  const title = freeAlt
    ? `${freeAlt.name}: Free ${tool.name} Alternative (Save $${yearlyCost}/yr)`
    : `${topAlt} vs ${tool.name} — One-Time Purchase, No Subscription`;

  // Description includes specific savings and alternative names
  const altNames = alts.slice(0, 3).map((a) => a.name).join(', ');
  const description = tool.monthlyPrice
    ? `Stop paying $${tool.monthlyPrice}/mo for ${tool.name}. Try ${altNames} instead — free or one-time purchase. Save $${yearlyCost}/year. Honest pros, cons, and migration guide.`
    : `Ditch ${tool.name} subscription for ${altNames}. One-time purchase and open-source alternatives with no recurring fees. Compare features, pricing, and migration tips.`;

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

  const lastChecked = alternatives.reduce((latest, a) => {
    return a.software.lastCheckedAt > latest ? a.software.lastCheckedAt : latest;
  }, alternatives[0]?.software.lastCheckedAt || '');

  const allBestFor = [...new Set(alternatives.flatMap((a) => a.relation.bestFor))];
  const allNotFor = [...new Set(alternatives.flatMap((a) => a.relation.notFor))];

  const freeAlts = getFreeAlternativesForTool(tool.id);
  const ossAlts = getOpenSourceAlternativesForTool(tool.id);

  const submissions = getSubmissionsForTool(tool.id);

  const seoContent = getSeoContent(tool.id);

  const faqItems = seoContent
    ? seoContent.extendedFaq
    : [
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
            {lastChecked && (
              <div className="mt-4">
                <TrustBadge lastChecked={lastChecked} />
              </div>
            )}
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <Breadcrumb items={[{ name: 'Alternatives', href: '/search' }, { name: tool.name }]} />

        {/* Quick Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 mb-6 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <a href="#comparison" className="text-slate-500 hover:text-amber-600 transition-colors">Comparison</a>
          <a href="#features" className="text-slate-500 hover:text-amber-600 transition-colors">Features</a>
          <a href="#migration" className="text-slate-500 hover:text-amber-600 transition-colors">Migration Guide</a>
          <a href="#faq" className="text-slate-500 hover:text-amber-600 transition-colors">FAQ</a>
        </div>

        {/* Detailed Intro — SEO content for enriched tools */}
        {seoContent && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
            <p className="text-slate-700 leading-relaxed text-base">
              {seoContent.detailedIntro}
            </p>
          </div>
        )}

        {/* Why People Look for Alternatives */}
        {tool.commonUseCases && tool.commonUseCases.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
              Why People Look for {tool.name} Alternatives
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Paying {formatPrice(tool.monthlyPrice || 0)}/month for {tool.name} adds up to{' '}
              <span className="font-semibold text-amber-700">{formatPrice(yearlyCost)}/year</span> and{' '}
              <span className="font-semibold text-red-600">{formatPrice(threeYearCost)}</span> over three years.
              Many users search for alternatives because:
            </p>
            <ul className="space-y-2">
              {tool.commonUseCases.map((useCase: string, i: number) => (
                <li key={i} className="flex items-start text-sm text-slate-600">
                  <span className="text-amber-500 mr-2 mt-0.5 font-bold">-</span>
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Recommendation */}
        <QuickRecommendation
          alternatives={alternatives}
          bestOverallId={bestOverall?.software.id}
        />

        {/* Savings Calculator */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cost Comparison</h2>
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-amber-600 transition-colors">
              Visit {tool.name} website
            </a>
          </div>
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
          {/* Cost Over Time Visual */}
          {threeYearCost > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Cost Over Time</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{tool.name} (3 years)</span>
                    <span className="font-bold text-slate-900">{formatPrice(threeYearCost)}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                {bestOverall?.software.startingPrice != null && bestOverall.software.startingPrice > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">{bestOverall.software.name} (one-time)</span>
                      <span className="font-bold text-emerald-700">{formatPrice(bestOverall.software.startingPrice)}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, (bestOverall.software.startingPrice / threeYearCost) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                {bestOverall?.software.startingPrice == null && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">{bestOverall?.software.name || 'Best alternative'} (free)</span>
                      <span className="font-bold text-emerald-700">$0</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '2%' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        <div id="comparison" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8 overflow-hidden">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Comparison Table</h2>
          <AlternativeComparisonTable alternatives={alternatives} />
        </div>

        {/* Key Features to Compare */}
        {seoContent && (
          <div id="features" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
              Key Features to Compare When Choosing a {tool.name} Alternative
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seoContent.keyFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

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

        {/* Who Should Switch */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Who Should Switch?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</span>
                Good candidates for switching
              </h3>
              <div className="flex flex-wrap gap-2">
                {allBestFor.map((item: string, i: number) => (
                  <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">✗</span>
                Should keep using {tool.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {allNotFor.map((item: string, i: number) => (
                  <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-50 text-slate-600 border border-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Migration Guide */}
        {seoContent && (
          <div id="migration" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
              How to Switch from {tool.name}: Step-by-Step Guide
            </h2>
            <ol className="space-y-4">
              {seoContent.migrationSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            {seoContent.switchingNarrative && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {seoContent.switchingNarrative}
                </p>
              </div>
            )}
          </div>
        )}

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

        {/* Email Subscribe */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stay Updated</h2>
          <p className="text-sm text-slate-600 mb-4">
            Get notified when new {tool.name} alternatives are found or prices change. We send a short summary with links — no spam.
          </p>
          <EmailSubscribe toolSlug={slug} toolName={tool.name} />
        </div>

        {/* FAQ */}
        <div id="faq" className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
          <FAQSection items={faqItems} />
        </div>

        {/* Explore by Type */}
        {(freeAlts.length > 0 || ossAlts.length > 0) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Explore by Type</h2>
            <div className="flex flex-wrap gap-3">
              {freeAlts.length > 0 && (
                <Link
                  href={`/free-alternatives-to/${slug}`}
                  className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  Free alternatives to {tool.name}
                </Link>
              )}
              {ossAlts.length > 0 && (
                <Link
                  href={`/open-source-alternatives-to/${slug}`}
                  className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  Open source alternatives to {tool.name}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 mb-8 text-center grain-bg">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Ready to stop paying for {tool.name}?
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {bestOverall?.software.name || 'The top alternative'} is {bestOverall?.software.startingPrice ? `just $${bestOverall.software.startingPrice} one-time` : 'completely free'}. No subscription, no recurring charges.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={bestOverall?.software.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
              >
                Try {bestOverall?.software.name || 'the best alternative'} free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
              </a>
              <Link
                href={`/compare/${bestOverall?.software.slug}-vs-${tool.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-colors"
              >
                See full comparison
              </Link>
            </div>
          </div>
        </div>

        {/* Related Pages — same category first, then others */}
        <div className="bg-slate-100 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Related Alternatives</h2>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const sameCategory = subscriptionTools.filter(
                (t) => t.id !== tool.id && t.category === tool.category
              );
              const others = subscriptionTools.filter(
                (t) => t.id !== tool.id && t.category !== tool.category
              );
              const related = [...sameCategory, ...others].slice(0, 8);
              return related.map((t) => (
                <Link
                  key={t.id}
                  href={`/alternatives/${t.slug}`}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
                >
                  {t.name} alternatives
                </Link>
              ));
            })()}
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Also in {tool.category?.replace(/_/g, ' ').toLowerCase()}:{' '}
            {subscriptionTools
              .filter((t) => t.id !== tool.id && t.category === tool.category)
              .slice(0, 3)
              .map((t, i, arr) => (
                <span key={t.id}>
                  <Link href={`/alternatives/${t.slug}`} className="text-amber-600 hover:text-amber-700">
                    {t.name}
                  </Link>
                  {i < arr.length - 1 ? ', ' : ''}
                </span>
              ))}
          </p>
        </div>
      </div>
    </div>
  );
}
