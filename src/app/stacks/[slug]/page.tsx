import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import PricingBadge from '@/components/PricingBadge';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd, { breadcrumbSchema, faqSchema, itemListSchema } from '@/components/JsonLd';
import { stacks, getStackBySlug, getSubscriptionToolBySlug, software } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return stacks.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stack = getStackBySlug(slug);
  if (!stack) return {};

  const toolNames = stack.items
    .map((item) => getSubscriptionToolBySlug(item.subscriptionToolId)?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');

  const title = `${stack.name} Stack — Replace ${toolNames} & Save $${stack.annualSavings}/yr`;
  const description = `The ${stack.name} stack replaces ${toolNames} with free alternatives. Save $${stack.annualSavings}/year. ${stack.description}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/stacks/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/stacks/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function StackPage({ params }: PageProps) {
  const { slug } = await params;
  const stack = getStackBySlug(slug);

  if (!stack) {
    notFound();
  }

  const items = stack.items
    .map((item) => {
      const tool = getSubscriptionToolBySlug(item.subscriptionToolId);
      const alt = software.find((s) => s.id === item.softwareId);
      if (!tool || !alt) return null;
      return { ...item, tool, alt };
    })
    .filter(Boolean) as { subscriptionToolId: string; softwareId: string; note: string; tool: any; alt: any }[];

  const totalMonthly = items.reduce((sum, item) => sum + (item.tool.monthlyPrice || 0), 0);
  const totalYearly = totalMonthly * 12;

  const toolNames = items.map((i) => i.tool.name).join(', ');
  const altNames = items.map((i) => i.alt.name).join(', ');

  const faqItems = [
    {
      question: `What is the ${stack.name} stack?`,
      answer: `The ${stack.name} stack is a curated set of ${items.length} free and open-source tools that replace subscription software. It replaces ${toolNames} — saving approximately ${formatPrice(stack.annualSavings)}/year in subscription fees.`,
    },
    {
      question: `How much does the ${stack.name} stack save?`,
      answer: `The subscription tools in this stack cost ${formatPrice(totalMonthly)}/month (${formatPrice(totalYearly)}/year). The free alternatives cost $0, saving you ${formatPrice(stack.annualSavings)} annually. Over three years, that's ${formatPrice(stack.annualSavings * 3)}.`,
    },
    {
      question: `Can I use just some of the tools in the ${stack.name} stack?`,
      answer: `Absolutely. Each tool in the stack is independent — you can replace one subscription at a time. Start with the tool you use most, get comfortable with the alternative, then move to the next one.`,
    },
    {
      question: `Are the alternatives in the ${stack.name} stack really free?`,
      answer: `Yes. All ${items.length} alternatives (${altNames}) are free or open-source. There are no hidden costs, no premium tiers, and no feature restrictions for the core functionality listed here.`,
    },
  ];

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Stacks', url: '/stacks' },
          { name: stack.name, url: `/stacks/${slug}` },
        ])}
      />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd
        data={itemListSchema(
          items.map((item, i) => ({
            name: item.alt.name,
            url: `/software/${item.alt.slug}`,
            position: i + 1,
          }))
        )}
      />

      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Software Stack
            </span>
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-5">
              <span className="text-amber-400">{stack.icon} {stack.name}</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              {stack.description}
            </p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <Breadcrumb items={[{ name: 'Stacks', href: '/stacks' }, { name: stack.name }]} />
        {/* SEO Intro */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <p className="text-slate-700 leading-relaxed text-base">
            The {stack.name} stack replaces {items.length} subscription tools ({toolNames}) with free and open-source alternatives ({altNames}). Together, these subscriptions cost {formatPrice(totalMonthly)}/month — {formatPrice(totalYearly)}/year that stays in your pocket after switching. Each tool in this stack has been selected for reliability, active development, and feature parity with its subscription counterpart.
          </p>
        </div>

        {/* Savings Summary */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8 mb-8 animate-fade-in-up">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Cost Comparison</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Current monthly cost</p>
              <p className="text-xl font-bold text-slate-900 font-display">{formatPrice(totalMonthly)}/mo</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs text-amber-600 mb-1">Current yearly cost</p>
              <p className="text-xl font-bold text-amber-700 font-display">{formatPrice(totalYearly)}/yr</p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl col-span-2 lg:col-span-1">
              <p className="text-xs text-emerald-600 mb-1">Estimated annual savings</p>
              <p className="text-xl font-bold text-emerald-700 font-display">{formatPrice(stack.annualSavings)}</p>
            </div>
          </div>
        </div>

        {/* Calculator CTA */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 mb-8 text-center">
          <h2 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Calculate Your Savings</h2>
          <p className="text-sm text-amber-600 mb-4">
            See how much you could save by replacing your entire subscription stack with these alternatives.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
          >
            Open Calculator
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        {/* Stack Items */}
        <div className="space-y-4 mb-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 hover-lift"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
                {/* Subscription tool */}
                <div className="flex-1 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Replace</p>
                  <p className="text-lg font-bold text-slate-900">{item.tool.name}</p>
                  <p className="text-sm text-slate-500">
                    {item.tool.monthlyPrice ? `${formatPrice(item.tool.monthlyPrice)}/mo` : 'Subscription'}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Alternative */}
                <div className="flex-1 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">With</p>
                  <Link
                    href={`/software/${item.alt.slug}`}
                    className="text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors"
                  >
                    {item.alt.name}
                  </Link>
                  <div className="mt-1">
                    <PricingBadge type={item.alt.pricingType} priceText={item.alt.priceText} />
                  </div>
                </div>
              </div>

              {item.note && (
                <p className="text-sm text-slate-500">{item.note}</p>
              )}

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                <Link
                  href={`/compare/${item.alt.slug}-vs-${item.tool.slug}`}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Compare →
                </Link>
                <Link
                  href={`/alternatives/${item.tool.slug}`}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  All alternatives →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
          <FAQSection items={faqItems} />
        </div>

        {/* CTA */}
        <div className="bg-slate-100 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">More Stacks</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {stacks
              .filter((s) => s.slug !== slug)
              .map((s) => (
                <Link
                  key={s.id}
                  href={`/stacks/${s.slug}`}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
                >
                  {s.icon} {s.name}
                </Link>
              ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-200">
            <Link href="/categories" className="text-sm text-amber-600 hover:text-amber-700 font-semibold transition-colors">
              Browse by category →
            </Link>
            <Link href="/use-cases" className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors">
              Browse by use case →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
