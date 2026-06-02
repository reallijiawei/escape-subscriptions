import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import SoftwareCard from '@/components/SoftwareCard';
import JsonLd, { breadcrumbSchema } from '@/components/JsonLd';
import { subscriptionTools, software, categories } from '@/lib/data';
import SearchResults from './SearchResults';

export const metadata: Metadata = {
  title: 'Browse All Software Alternatives — Search 50+ Tools',
  description:
    'Search free, open-source, and one-time-purchase alternatives to Adobe, Notion, 1Password, and 50+ subscription software. Find your perfect replacement.',
  alternates: { canonical: '/search' },
};

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Search', url: '/search' },
        ])}
      />
      <div className="mb-10">
        <SearchBar placeholder="Search for software alternatives..." />
      </div>

      {/* Server-rendered default content — Google sees this without JS */}
      <div id="default-content">
        <div className="mb-10">
          <h1 className="heading-editorial text-3xl text-slate-900 mb-2">
            Browse Software Alternatives
          </h1>
          <p className="text-slate-500">
            Find free, open-source, and one-time-purchase alternatives to {subscriptionTools.length}+ subscription tools.
          </p>
        </div>

        {/* Category quick links for SEO */}
        <div className="mb-10">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-medium transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
            Popular Subscriptions to Replace
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionTools.map((tool) => (
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

        <div className="mb-12">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
            Alternative Software
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {software.map((sw) => (
              <SoftwareCard key={sw.id} software={sw} showReplaces />
            ))}
          </div>
        </div>

        {/* Popular Comparisons */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Popular Comparisons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { alt: 'GIMP', tool: 'Photoshop', slug: 'gimp-vs-adobe-photoshop' },
              { alt: 'Affinity Photo', tool: 'Photoshop', slug: 'affinity-photo-vs-adobe-photoshop' },
              { alt: 'Obsidian', tool: 'Notion', slug: 'obsidian-vs-notion' },
              { alt: 'Bitwarden', tool: '1Password', slug: 'bitwarden-vs-1password' },
              { alt: 'DaVinci Resolve', tool: 'Premiere Pro', slug: 'davinci-resolve-vs-adobe-premiere-pro' },
              { alt: 'Inkscape', tool: 'Illustrator', slug: 'inkscape-vs-adobe-illustrator' },
            ].map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="group flex items-center justify-between p-3 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 rounded-xl transition-all"
              >
                <span className="text-sm font-medium text-slate-700 group-hover:text-amber-700 transition-colors">
                  {item.alt} vs {item.tool}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400 group-hover:text-amber-500 transition-colors">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Client-side search results — overlays default content when searching */}
      <Suspense
        fallback={
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
