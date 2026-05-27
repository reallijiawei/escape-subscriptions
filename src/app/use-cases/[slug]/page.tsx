import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import SoftwareCard from '@/components/SoftwareCard';
import JsonLd, { breadcrumbSchema } from '@/components/JsonLd';
import { useCases, software, subscriptionTools, getUseCaseBySlug } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return useCases.map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCaseBySlug(slug);
  if (!uc) return {};

  return {
    title: uc.title,
    description: uc.description,
    alternates: { canonical: `/use-cases/${slug}` },
    openGraph: { title: uc.title, description: uc.description, url: `/use-cases/${slug}`, type: 'article' },
    twitter: { card: 'summary_large_image', title: uc.title, description: uc.description },
  };
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params;
  const uc = getUseCaseBySlug(slug);
  if (!uc) notFound();

  const ucSoftware = uc.softwareIds.map((id) => software.find((s) => s.id === id)).filter(Boolean);
  const ucTools = uc.toolIds.map((id) => subscriptionTools.find((t) => t.id === id)).filter(Boolean);
  const yearlyCost = ucTools.reduce((sum, t) => sum + (t!.monthlyPrice || 0) * 12, 0);
  const threeYearCost = yearlyCost * 3;

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Use Cases', url: '/use-cases' },
          { name: uc.persona, url: `/use-cases/${slug}` },
        ])}
      />

      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <span className="text-4xl mb-4 block">{uc.icon}</span>
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              {uc.title}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">{uc.description}</p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        {/* Savings Summary */}
        {yearlyCost > 0 && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8 mb-8 animate-fade-in-up">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">How much you could save</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs text-red-600 mb-1">Current yearly cost</p>
                <p className="text-xl font-bold text-red-700 font-display">{formatPrice(yearlyCost)}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-600 mb-1">3-year cost</p>
                <p className="text-xl font-bold text-amber-700 font-display">{formatPrice(threeYearCost)}</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl col-span-2 md:col-span-1">
                <p className="text-xs text-emerald-600 mb-1">With alternatives</p>
                <p className="text-xl font-bold text-emerald-700 font-display">~$0</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              By switching to the free and open-source alternatives below, {uc.persona.toLowerCase()} can save {formatPrice(yearlyCost)} every year.
            </p>
          </div>
        )}

        {/* Tools you're paying for */}
        {ucTools.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5">
              Tools you're probably paying for
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ucTools.map((tool) => (
                <Link
                  key={tool!.id}
                  href={`/alternatives/${tool!.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover-lift transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {tool!.name}
                    </h3>
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                      {tool!.monthlyPrice ? `$${tool!.monthlyPrice}/mo` : 'Subscription'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{tool!.description}</p>
                  <span className="text-sm text-amber-600 font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Find alternatives
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Alternatives */}
        <div className="mb-10">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5">
            Free & open-source alternatives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ucSoftware.map((sw) => (
              <SoftwareCard key={sw!.id} software={sw!} showReplaces />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-100 rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="text-lg font-bold text-slate-900 mb-2">See exactly how much you'd save</h2>
          <p className="text-sm text-slate-500 mb-4">
            Use our free calculator to add up all your subscriptions and find alternatives.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors"
          >
            Calculate My Costs
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        {/* Other use cases */}
        <div className="mt-10">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5">Other use cases</h2>
          <div className="flex flex-wrap gap-2">
            {useCases
              .filter((u) => u.id !== uc.id)
              .map((u) => (
                <Link
                  key={u.id}
                  href={`/use-cases/${u.slug}`}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
                >
                  {u.icon} {u.persona}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
