import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import PricingBadge from '@/components/PricingBadge';
import PlatformBadges from '@/components/PlatformBadges';
import { software, getSubscriptionToolBySlug } from '@/lib/data';
import { formatCategory, formatPlatform } from '@/lib/utils';

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

  return {
    title: `${sw.name} — One-Time Purchase Alternative`,
    description: sw.description,
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

  return (
    <div>
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
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
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
              { label: 'Last Checked', value: sw.lastCheckedAt },
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
              { label: 'Last Checked', value: sw.lastCheckedAt, color: 'slate' },
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
