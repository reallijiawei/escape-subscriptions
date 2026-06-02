import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import SoftwareCard from '@/components/SoftwareCard';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/JsonLd';
import { categories, software, subscriptionTools } from '@/lib/data';
import { getCategorySeoContent } from '@/lib/seo-categories';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};

  // Get top tools in this category for the description
  const catTools = subscriptionTools.filter((t) => t.category === category.id);
  const catSoftware = software.filter((s) => s.categories?.includes(category.id as any));
  const toolNames = catTools.slice(0, 3).map((t) => t.name).join(', ');
  const altNames = catSoftware.slice(0, 3).map((s) => s.name).join(', ');

  const title = `${category.name} Software — One-Time Purchase & Free Alternatives`;
  const description = `Stop paying subscriptions for ${category.name.toLowerCase()} tools. Free and one-time-purchase alternatives to ${toolNames || 'popular subscription software'}: ${altNames || 'and more'}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/categories/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/categories/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categorySoftware = software.filter((s) =>
    s.categories.some((c) => c.toLowerCase().replace(/_/g, '-') === slug)
  );
  const categoryTools = subscriptionTools.filter(
    (t) => t.category.toLowerCase().replace(/_/g, '-') === slug
  );

  const seoContent = getCategorySeoContent(slug);

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Categories', url: '/categories' },
          { name: category.name, url: `/categories/${slug}` },
        ])}
      />
      {seoContent && <JsonLd data={faqSchema(seoContent.faq)} />}
      {/* Hero */}
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <span className="text-4xl mb-4 block">{category.icon}</span>
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Best No-Subscription<br />
              <span className="text-amber-400">{category.name} Software</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">{category.description}</p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <Breadcrumb items={[{ name: 'Categories', href: '/categories' }, { name: category.name }]} />
        {/* SEO Intro */}
        {seoContent && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
            <p className="text-slate-700 leading-relaxed text-base">
              {seoContent.detailedIntro}
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Why Choose Non-Subscription {category.name} Software?</h3>
              <ul className="space-y-2">
                {seoContent.whySwitch.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 mt-0.5 font-bold">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {categoryTools.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8 mb-8 animate-fade-in-up">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{category.name} at a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Subscription tools</p>
                <p className="text-xl font-bold text-slate-900 font-display">{categoryTools.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Alternatives found</p>
                <p className="text-xl font-bold text-slate-900 font-display">{categorySoftware.length}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-600 mb-1">Avg monthly cost</p>
                <p className="text-xl font-bold text-amber-700 font-display">
                  ${Math.round(categoryTools.reduce((s, t) => s + (t.monthlyPrice || 0), 0) / categoryTools.length)}
                </p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xs text-emerald-600 mb-1">Potential yearly savings</p>
                <p className="text-xl font-bold text-emerald-700 font-display">
                  ${categoryTools.reduce((s, t) => s + (t.monthlyPrice || 0) * 12, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Common Use Cases */}
        {categoryTools.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Common {category.name} Use Cases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categoryTools.slice(0, 4).map((tool) => (
                <div key={tool.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="text-amber-500 mt-0.5">→</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tool.name}</p>
                    <p className="text-xs text-slate-500">{tool.commonUseCases?.slice(0, 2).join(', ') || tool.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Tools in Category */}
        {categoryTools.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5">
              Popular {category.name} Subscriptions to Replace
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/alternatives/${tool.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover-lift"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {tool.name}
                    </h3>
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                      ${tool.monthlyPrice}/mo
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3 leading-relaxed">{tool.description}</p>
                  <span className="text-sm text-amber-600 font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Find alternatives
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Alternative Software */}
        <div>
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5">
            {category.name} Alternatives
          </h2>
          {categorySoftware.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categorySoftware.map((sw) => (
                <SoftwareCard key={sw.id} software={sw} showReplaces />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">No alternatives found in this category yet.</p>
            </div>
          )}
        </div>

        {/* FAQ */}
        {seoContent && (
          <div className="mt-14">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
            <FAQSection items={seoContent.faq} />
          </div>
        )}

        {/* Related Categories */}
        <div className="mt-14 bg-slate-100 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5">Other Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.id !== category.id)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
