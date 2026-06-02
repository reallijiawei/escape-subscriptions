import Link from 'next/link';
import type { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import SoftwareCard from '@/components/SoftwareCard';
import JsonLd, { websiteSchema, organizationSchema } from '@/components/JsonLd';
import { subscriptionTools, software } from '@/lib/data';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const popularSearches = [
  { label: 'Photoshop alternatives no subscription', href: '/alternatives/adobe-photoshop' },
  { label: 'Notion alternatives no subscription', href: '/alternatives/notion' },
  { label: 'Canva alternatives one-time payment', href: '/alternatives/canva' },
  { label: 'Grammarly alternatives lifetime deal', href: '/alternatives/grammarly' },
  { label: 'Todoist alternatives pay once', href: '/alternatives/todoist' },
  { label: 'Dropbox alternatives open source', href: '/alternatives/dropbox' },
];

const featuredAlternatives = [
  'adobe-photoshop',
  'notion',
  'canva',
  'grammarly',
  'todoist',
  'dropbox',
];

export default function HomePage() {
  const featuredTools = subscriptionTools.filter((t) =>
    featuredAlternatives.includes(t.id)
  );

  const featuredSoftware = software.slice(0, 6);

  return (
    <div>
      <JsonLd data={websiteSchema()} />
      <JsonLd data={organizationSchema()} />
      {/* Hero */}
      <section className="relative bg-slate-900 overflow-hidden grain-bg">
        {/* Geometric accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03]">
          <svg viewBox="0 0 600 600" fill="none">
            <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="1" />
            <circle cx="300" cy="300" r="200" stroke="white" strokeWidth="1" />
            <circle cx="300" cy="300" r="120" stroke="white" strokeWidth="1" />
            <line x1="20" y1="300" x2="580" y2="300" stroke="white" strokeWidth="1" />
            <line x1="300" y1="20" x2="300" y2="580" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Break free from subscriptions
              </span>
            </div>

            <h1 className="heading-editorial text-4xl sm:text-5xl md:text-6xl text-white mb-6 animate-fade-in-up delay-100">
              Tired of software<br />
              <span className="text-amber-400">subscriptions?</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
              Find free, open-source, and one-time purchase alternatives to the tools you&apos;re paying for every month.
            </p>

            <div className="max-w-2xl mx-auto animate-fade-in-up delay-300">
              <SearchBar
                popularSuggestions={[
                  'Photoshop',
                  'Notion',
                  'Canva',
                  'Grammarly',
                  '1Password',
                  'Dropbox',
                ]}
              />
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Stats strip */}
      <section className="relative z-10 -mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">59+</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Subscriptions to replace</p>
              </div>
              <div className="text-center border-x border-slate-200">
                <p className="text-2xl sm:text-3xl font-bold text-amber-600 font-display">123+</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Alternative tools</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">$0</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Cost to use this site</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-editorial text-3xl text-slate-900 mb-3">What are you paying for?</h2>
            <p className="text-slate-500">Find alternatives to the subscriptions you&apos;re tired of.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {popularSearches.map((search, index) => (
              <Link
                key={search.href}
                href={search.href}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-700 hover:text-slate-900 font-medium transition-all hover-lift"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {search.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator CTA */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-10 sm:p-14 text-center grain-bg overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-6 right-8 text-amber-500/10 text-8xl font-display select-none">$</div>
            <div className="absolute bottom-6 left-8 text-amber-500/10 text-6xl font-display select-none">$</div>

            <div className="relative z-10">
              <h2 className="heading-editorial text-3xl sm:text-4xl text-white mb-4">
                How much are you <span className="text-amber-400">actually</span> spending?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Most people underestimate their subscription costs by 40%. See the real number.
              </p>
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25"
              >
                Calculate My Costs
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Alternatives */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="heading-editorial text-3xl text-slate-900 mb-2">Popular to replace</h2>
              <p className="text-slate-500">The subscriptions people are escaping from.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/alternatives/${tool.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover-lift"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {tool.name}
                  </h3>
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                    ${tool.monthlyPrice}/mo
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{tool.description}</p>
                <span className="text-sm text-amber-600 font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  Find alternatives
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Alternatives */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-editorial text-3xl text-slate-900 mb-3">Top alternatives</h2>
            <p className="text-slate-500">Tools you can own, not rent.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredSoftware.map((sw) => (
              <SoftwareCard key={sw.id} software={sw} showReplaces />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Browse All Alternatives
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Alternatives — SEO internal links */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-editorial text-3xl text-slate-900 mb-3">Best alternatives without subscription</h2>
            <p className="text-slate-500">Our most popular guides to replacing subscription software.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { tool: 'Adobe Photoshop', slug: 'adobe-photoshop', savings: '$22/mo' },
              { tool: 'Adobe Acrobat', slug: 'adobe-acrobat', savings: '$13/mo' },
              { tool: 'Notion', slug: 'notion', savings: '$10/mo' },
              { tool: 'Canva', slug: 'canva', savings: '$13/mo' },
              { tool: 'Grammarly', slug: 'grammarly', savings: '$12/mo' },
              { tool: '1Password', slug: '1password', savings: '$3/mo' },
              { tool: 'Dropbox', slug: 'dropbox', savings: '$10/mo' },
              { tool: 'Zoom', slug: 'zoom', savings: '$13/mo' },
              { tool: 'Figma', slug: 'figma', savings: '$15/mo' },
              { tool: 'Adobe Premiere Pro', slug: 'adobe-premiere-pro', savings: '$23/mo' },
              { tool: 'ChatGPT Plus', slug: 'chatgpt-plus', savings: '$20/mo' },
              { tool: 'AutoCAD', slug: 'autocad', savings: '$235/mo' },
            ].map((item) => (
              <Link
                key={item.slug}
                href={`/alternatives/${item.slug}`}
                className="group flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 rounded-xl transition-all"
              >
                <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {item.tool} alternatives
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Save {item.savings}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 bg-slate-900 grain-bg overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
            <svg viewBox="0 0 800 800" fill="none">
              <circle cx="400" cy="400" r="350" stroke="white" strokeWidth="0.5" />
              <circle cx="400" cy="400" r="250" stroke="white" strokeWidth="0.5" />
              <circle cx="400" cy="400" r="150" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-editorial text-4xl sm:text-5xl text-white mb-6">
            Your software should work <span className="text-amber-400">for you</span>,<br />
            not the other way around.
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Own your tools. Own your data. Own your workflow.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25"
          >
            Find Alternatives Now
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
