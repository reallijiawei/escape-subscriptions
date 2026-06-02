import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd, { breadcrumbSchema, itemListSchema, faqSchema } from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
import FAQSection from '@/components/FAQSection';
import { categories, software, subscriptionTools } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Browse by Category',
  description: `Find subscription-free alternatives organized by category — design, developer tools, productivity, AI, security, and more. ${software.length}+ one-time purchase and open-source tools across ${categories.length}+ categories.`,
  alternates: { canonical: '/categories' },
  openGraph: {
    title: 'Browse by Category | Escape Subscriptions',
    description: `Find subscription-free alternatives organized by category. ${software.length}+ one-time purchase and open-source tools across ${categories.length}+ categories.`,
    url: '/categories',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Browse by Category | Escape Subscriptions',
    description: `Find subscription-free alternatives organized by category. ${software.length}+ one-time purchase and open-source tools across ${categories.length}+ categories.`,
  },
};

const categoryFaq = [
  {
    question: 'How are software alternatives organized by category?',
    answer: 'Each alternative is tagged with one or more categories based on its primary function. For example, GIMP is in the Design category, while Bitwarden is in Security. This makes it easy to find alternatives within your specific workflow area.',
  },
  {
    question: 'Can a tool appear in multiple categories?',
    answer: 'Yes. Many tools serve multiple purposes. For example, LibreOffice appears in both Productivity and Office categories. You\'ll find the same tool listed under each relevant category.',
  },
  {
    question: 'Which category has the most alternatives?',
    answer: 'Design and Developer Tools tend to have the most alternatives, as these are the areas where subscription costs are highest and open-source alternatives are most mature.',
  },
  {
    question: 'How do I know if an alternative is any good?',
    answer: 'Every tool listed on Escape Subscriptions is tested before being included. Each page shows pros and cons, migration difficulty, and a "Best For" section to help you decide.',
  },
];

export default function CategoriesPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Categories', url: '/categories' },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          categories.map((c, i) => ({ name: c.name, url: `/categories/${c.slug}`, position: i + 1 }))
        )}
      />
      <JsonLd data={faqSchema(categoryFaq)} />
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Browse by <span className="text-amber-400">category</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Find subscription-free alternatives for every type of software.
            </p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <Breadcrumb items={[{ name: 'Categories' }]} />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <p className="text-slate-700 leading-relaxed">
            Looking for a subscription-free alternative but not sure where to start? Browse by category to find one-time purchase and open-source tools for every type of software — from design and video editing to productivity and security. Each category lists both the subscription tools you can replace and the alternatives available.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const catSoftware = software.filter((s) => s.categories.includes(cat.id.toUpperCase().replace('-', '_') as any));
            const catTools = subscriptionTools.filter((t) => t.category === cat.id.toUpperCase().replace('-', '_'));
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover-lift transition-all"
              >
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2">
                  {cat.name}
                </h2>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>{catSoftware.length} alternatives</span>
                  <span>{catTools.length} subscriptions</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
          <FAQSection items={categoryFaq} />
        </div>
      </div>
    </div>
  );
}
