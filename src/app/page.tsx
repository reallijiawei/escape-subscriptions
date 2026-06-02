import Link from 'next/link';
import type { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import SoftwareCard from '@/components/SoftwareCard';
import JsonLd, { websiteSchema, organizationSchema } from '@/components/JsonLd';
import { subscriptionTools, software, categories } from '@/lib/data';

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
              Stop renting.<br />
              <span className="text-amber-400">Own your software.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
              Find free, open-source, and one-time purchase alternatives to Adobe, Notion, 1Password, and 50+ subscription tools. Save $500+/year.
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

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-editorial text-3xl text-slate-900 mb-3">How it works</h2>
            <p className="text-slate-500">Three steps to escape subscription fatigue.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Find your subscription',
                desc: 'Search for the tool you\'re paying for — Photoshop, Notion, 1Password, or any of 59+ subscription tools.',
                icon: '🔍',
              },
              {
                step: '2',
                title: 'Compare alternatives',
                desc: 'See one-time purchase and free alternatives side-by-side. Compare pricing, features, and migration difficulty.',
                icon: '⚖️',
              },
              {
                step: '3',
                title: 'Switch and save',
                desc: 'Migrate your data, cancel your subscription, and start owning your software. Save $300–$800/year.',
                icon: '💰',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-20 bg-white border-y border-slate-200">
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

      {/* Recently Updated */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-editorial text-3xl text-slate-900 mb-3">Recently verified</h2>
            <p className="text-slate-500">Alternatives we&apos;ve checked and confirmed this week.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {software
              .sort((a, b) => new Date(b.lastCheckedAt).getTime() - new Date(a.lastCheckedAt).getTime())
              .slice(0, 8)
              .map((sw) => (
                <Link
                  key={sw.id}
                  href={`/software/${sw.slug}`}
                  className="group p-4 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 rounded-xl transition-all"
                >
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors mb-1">
                    {sw.name}
                  </h3>
                  <p className="text-xs text-slate-500">{sw.priceText}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Best Alternatives — SEO internal links */}
      <section className="py-20 bg-white border-y border-slate-200">
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

      {/* Browse by Category — SEO internal links */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-editorial text-3xl text-slate-900 mb-3">Browse by category</h2>
            <p className="text-slate-500">Find alternatives organized by what you need.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-700 hover:text-slate-900 font-medium transition-all hover-lift"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Comparisons — SEO internal links */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-editorial text-3xl text-slate-900 mb-3">Popular comparisons</h2>
            <p className="text-slate-500">Side-by-side comparisons of subscriptions vs alternatives.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 rounded-xl transition-all"
              >
                <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {item.alt} vs {item.tool}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400 group-hover:text-amber-500 transition-colors">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Trust Us — E-E-A-T */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-editorial text-3xl text-slate-900 mb-3">Why trust us?</h2>
            <p className="text-slate-500">Independent, honest, and hands-on recommendations.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '🔬',
                title: 'Hands-on testing',
                desc: 'Every alternative is installed and tested before being listed. We don\'t recommend tools we haven\'t used.',
              },
              {
                icon: '🚫',
                title: 'No paid placements',
                desc: 'We don\'t accept money for rankings. Our recommendations are based purely on quality and value.',
              },
              {
                icon: '🔄',
                title: 'Weekly updates',
                desc: 'Pricing and features are checked weekly. Each page shows when it was last verified.',
              },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/about" className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              Learn about our methodology →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-editorial text-3xl text-slate-900 mb-3">What users say</h2>
            <p className="text-slate-500">People who escaped the subscription trap.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                quote: 'Saved $660/year by switching from Photoshop to Affinity Photo. The comparison page made it an easy decision.',
                name: 'Sarah K.',
                role: 'Freelance Designer',
              },
              {
                quote: 'The calculator showed me I was spending $1,200/year on subscriptions I barely used. Now I own all my tools outright.',
                name: 'Mike R.',
                role: 'Developer',
              },
              {
                quote: 'Finally found a Notion alternative that works offline. No more worrying about losing access to my notes.',
                name: 'Alex T.',
                role: 'Student',
              },
            ].map((item) => (
              <div key={item.name} className="p-6 bg-white rounded-2xl border border-slate-200">
                <p className="text-sm text-slate-600 leading-relaxed mb-4 italic">&ldquo;{item.quote}&rdquo;</p>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-editorial text-3xl text-slate-900 mb-3">Frequently asked questions</h2>
            <p className="text-slate-500">Common questions about escaping subscriptions.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Are these alternatives really free?',
                a: 'Yes. Many alternatives listed here are completely free and open-source. Others are one-time purchases — you pay once and own them forever. No hidden costs, no recurring charges.',
              },
              {
                q: 'How do you choose which alternatives to recommend?',
                a: 'We test every tool before listing it. We evaluate features, performance, ease of use, community support, and update frequency. We don\'t accept payment for rankings.',
              },
              {
                q: 'Can free tools really replace professional subscription software?',
                a: 'For most users, yes. Professional-grade open-source tools like GIMP, DaVinci Resolve, and LibreOffice are used by millions worldwide. They handle 90%+ of common use cases.',
              },
              {
                q: 'How much money can I save?',
                a: 'Most users save $300–$800/year by switching to alternatives. Over 3 years, savings often exceed $2,000. Use our calculator to see your specific savings.',
              },
              {
                q: 'Is it hard to switch from paid to free tools?',
                a: 'Most free alternatives support standard file formats and have similar workflows. The switch typically takes a few days of adjustment, but most users adapt quickly.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </div>
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
