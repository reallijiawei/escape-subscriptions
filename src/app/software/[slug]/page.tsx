import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import PricingBadge from '@/components/PricingBadge';
import PlatformBadges from '@/components/PlatformBadges';
import FAQSection from '@/components/FAQSection';
import JsonLd, { softwareApplicationSchema, breadcrumbSchema, faqSchema } from '@/components/JsonLd';
import { software, subscriptionTools, getSubscriptionToolBySlug, getFreeAlternativesForTool } from '@/lib/data';
import { getSoftwareSeoContent } from '@/lib/seo-software';
import Breadcrumb from '@/components/Breadcrumb';
import TrustBadge from '@/components/TrustBadge';
import { formatCategory, formatPlatform, formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return software.map((sw) => ({
    slug: sw.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sw = software.find((s) => s.slug === slug);
  if (!sw) return {};

  const replacesNames = sw.replaces
    .map((r) => subscriptionTools.find((t) => t.slug === r)?.name)
    .filter(Boolean);
  const replacesStr = replacesNames.length > 0 ? replacesNames.slice(0, 2).join(' & ') : '';
  const isFree = sw.pricingType === 'FREE' || sw.pricingType === 'OPEN_SOURCE';
  const price = sw.startingPrice ? `$${sw.startingPrice} one-time` : isFree ? 'Free' : sw.priceText;

  const title = replacesStr
    ? `${sw.name} — ${price} ${replacesStr} Alternative`
    : `${sw.name} — ${price} ${isFree ? 'Open Source' : 'One-Time Purchase'} Software`;

  const description = replacesStr
    ? `${sw.name} is a ${price} alternative to ${replacesNames.join(', ')}. ${isFree ? 'No subscription, open source, self-hostable.' : 'Pay once, own forever.'} ${sw.description}`
    : `${sw.name}: ${price} software. ${sw.description}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/software/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/software/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SoftwarePage({ params }: PageProps) {
  const { slug } = await params;
  const sw = software.find((s) => s.slug === slug);

  if (!sw) {
    notFound();
  }

  const replacesTools = sw.replaces
    .map((replaceSlug) => getSubscriptionToolBySlug(replaceSlug))
    .filter(Boolean);

  const seoContent = getSoftwareSeoContent(sw.id);

  return (
    <div>
      <JsonLd
        data={softwareApplicationSchema({
          name: sw.name,
          description: sw.description,
          url: `https://escapesubscriptions.online/software/${slug}`,
          pricingType: sw.pricingType,
          priceText: sw.priceText,
          platforms: sw.platforms,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Software', url: '/search' },
          { name: sw.name, url: `/software/${slug}` },
        ])}
      />
      {seoContent && <JsonLd data={faqSchema(seoContent.faq)} />}
      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <div className="mb-4">
              <PricingBadge type={sw.pricingType} priceText={sw.priceText} />
            </div>
            <h1 className="heading-editorial text-4xl sm:text-5xl text-white mb-5">{sw.name}</h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-6">{sw.description}</p>
            <PlatformBadges platforms={sw.platforms} />
            <div className="mt-4">
              <TrustBadge lastChecked={sw.lastCheckedAt} />
            </div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <Breadcrumb items={[{ name: 'Software', href: '/search' }, { name: sw.name }]} />
        {/* SEO Intro */}
        {seoContent && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
            <p className="text-slate-700 leading-relaxed text-base">
              {seoContent.detailedIntro}
            </p>
            {seoContent.whyChoose.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Why Choose {sw.name}?</h3>
                <ul className="space-y-2">
                  {seoContent.whyChoose.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-emerald-500 mt-0.5 font-bold">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Basic Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              { label: 'Pricing', value: sw.priceText },
              { label: 'Platforms', value: sw.platforms.map(formatPlatform).join(', ') },
              { label: 'Categories', value: sw.categories.map(formatCategory).join(', ') },
              { label: 'Open Source', value: sw.isOpenSource ? 'Yes' : 'No' },
              { label: 'Offline Support', value: sw.isOfflineSupported ? 'Yes' : 'No' },
              { label: 'Account Required', value: sw.requiresAccount ? 'Yes' : 'No' },
              { label: 'Free Trial', value: sw.hasFreeTrial ? 'Yes' : 'No' },
              { label: 'Last Checked', value: formatDate(sw.lastCheckedAt) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{item.label}</span>
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ownership & Dependency */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Ownership & Dependency</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Ownership', value: sw.ownershipLevel, color: sw.ownershipLevel === 'HIGH' ? 'emerald' : sw.ownershipLevel === 'MEDIUM' ? 'amber' : 'red' },
              { label: 'Cloud Dependency', value: sw.cloudDependency, color: sw.cloudDependency === 'NONE' || sw.cloudDependency === 'LOW' ? 'emerald' : sw.cloudDependency === 'MEDIUM' ? 'amber' : 'red' },
              { label: 'Last Checked', value: formatDate(sw.lastCheckedAt), color: 'slate' },
            ].map((item) => (
              <div key={item.label} className={`p-4 rounded-xl ${item.color === 'emerald' ? 'bg-emerald-50' : item.color === 'amber' ? 'bg-amber-50' : item.color === 'red' ? 'bg-red-50' : 'bg-slate-50'}`}>
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className="font-bold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Best For */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Best For</h2>
          <div className="flex flex-wrap gap-2">
            {sw.bestFor.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Replaces */}
        {replacesTools.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Replaces</h2>
            <div className="space-y-3">
              {replacesTools.map((tool) => (
                <Link
                  key={tool!.id}
                  href={`/alternatives/${tool!.slug}`}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50 rounded-xl transition-colors group"
                >
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{tool!.name}</p>
                    <p className="text-sm text-slate-500">${tool!.monthlyPrice}/month</p>
                  </div>
                  <span className="text-sm text-amber-600 font-semibold flex items-center gap-1.5">
                    View alternatives
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* See All Alternatives */}
        {replacesTools.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">See All Alternatives</h2>
            <div className="space-y-3">
              {replacesTools.map((tool) => {
                const freeAlts = getFreeAlternativesForTool(tool!.id);
                return (
                  <div key={tool!.id} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Link
                      href={`/alternatives/${tool!.slug}`}
                      className="text-sm text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                    >
                      All alternatives to {tool!.name}
                    </Link>
                    {freeAlts.length > 0 && (
                      <Link
                        href={`/free-alternatives-to/${tool!.slug}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                      >
                        Free alternatives to {tool!.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4">Pros</h2>
            <ul className="space-y-3">
              {sw.pros.map((pro, i) => (
                <li key={i} className="flex items-start text-sm text-slate-600">
                  <span className="text-emerald-500 mr-2 mt-0.5 font-bold">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-4">Cons</h2>
            <ul className="space-y-3">
              {sw.cons.map((con, i) => (
                <li key={i} className="flex items-start text-sm text-slate-600">
                  <span className="text-red-400 mr-2 mt-0.5 font-bold">−</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        {seoContent && (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
            <FAQSection items={seoContent.faq} />
          </div>
        )}

        {/* Compare with */}
        {replacesTools.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Compare {sw.name} with alternatives
            </h2>
            <div className="flex flex-wrap gap-2">
              {replacesTools.map((t) => (
                <Link
                  key={t!.id}
                  href={`/compare/${sw.slug}-vs-${t!.slug}`}
                  className="px-4 py-2 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl text-sm text-amber-700 font-medium transition-all"
                >
                  {sw.name} vs {t!.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* See Also — links to alternatives pages */}
        {replacesTools.length > 0 && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              {sw.name} replaces these subscriptions
            </h2>
            <div className="flex flex-wrap gap-2">
              {replacesTools.map((t) => (
                <Link
                  key={t!.id}
                  href={`/alternatives/${t!.slug}`}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
                >
                  Alternatives to {t!.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Software */}
        {sw.categories.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Related Software
            </h2>
            <div className="flex flex-wrap gap-2">
              {software
                .filter((s) => s.id !== sw.id && s.categories.some((c) => sw.categories.includes(c)))
                .slice(0, 6)
                .map((s) => (
                  <Link
                    key={s.id}
                    href={`/software/${s.slug}`}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
                  >
                    {s.name}
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <a
            href={sw.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all hover:shadow-lg"
          >
            Visit Official Website
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
