import Link from 'next/link';
import type { Metadata } from 'next';
import { categories, software, subscriptionTools } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Browse by Category',
  description: 'Find subscription-free alternatives organized by category. Design, developer tools, productivity, AI, and more.',
  alternates: { canonical: '/categories' },
};

export default function CategoriesPage() {
  return (
    <div>
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
      </div>
    </div>
  );
}
