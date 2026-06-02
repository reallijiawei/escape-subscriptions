import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { breadcrumbSchema } from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Embed Badge',
  description: 'Embed the Escape Subscriptions badge on your website to show visitors your software is listed as a trusted subscription-free alternative. Free badge code for HTML, Markdown, and React.',
  alternates: {
    canonical: '/badge',
  },
  openGraph: {
    title: 'Embed Badge | Escape Subscriptions',
    description: 'Embed the Escape Subscriptions badge on your website to show visitors your software is listed as a trusted subscription-free alternative.',
    url: '/badge',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Embed Badge | Escape Subscriptions',
    description: 'Embed the Escape Subscriptions badge on your website to show visitors your software is listed as a trusted subscription-free alternative.',
  },
};

const SITE = 'https://escapesubscriptions.online';

const htmlCode = `<a href="${SITE}" target="_blank" rel="noopener noreferrer">
  <img src="${SITE}/badge.svg" alt="Listed on Escape Subscriptions" width="220" height="36" />
</a>`;

const markdownCode = `[![Listed on Escape Subscriptions](${SITE}/badge.svg)](${SITE})`;

const reactCode = `<a href="${SITE}" target="_blank" rel="noopener noreferrer">
  <img src="${SITE}/badge.svg" alt="Listed on Escape Subscriptions" width={220} height={36} />
</a>`;

export default function BadgePage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Embed Badge', url: '/badge' },
        ])}
      />
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              For Developers
            </span>
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-5">
              Embed Our <span className="text-amber-400">Badge</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Show your visitors that your software is listed on Escape Subscriptions. Copy the code below and paste it into your website.
            </p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <Breadcrumb items={[{ name: 'Embed Badge' }]} />
        {/* Badge Preview */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-8 mb-8 animate-fade-in-up">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Preview</h2>
          <div className="flex items-center justify-center p-8 bg-slate-50 rounded-xl">
            <img src="/badge.svg" alt="Listed on Escape Subscriptions" width={220} height={36} />
          </div>
        </div>

        {/* HTML */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">HTML</h2>
          <pre className="bg-slate-900 text-slate-300 rounded-xl p-4 overflow-x-auto text-sm leading-relaxed">
            <code>{htmlCode}</code>
          </pre>
        </div>

        {/* Markdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Markdown</h2>
          <pre className="bg-slate-900 text-slate-300 rounded-xl p-4 overflow-x-auto text-sm leading-relaxed">
            <code>{markdownCode}</code>
          </pre>
        </div>

        {/* React */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">React / JSX</h2>
          <pre className="bg-slate-900 text-slate-300 rounded-xl p-4 overflow-x-auto text-sm leading-relaxed">
            <code>{reactCode}</code>
          </pre>
        </div>

        {/* Learn More */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 text-center">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Learn More</h2>
          <p className="text-sm text-slate-500 mb-5">
            Escape Subscriptions helps users find one-time purchase and open-source alternatives to subscription software.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/about"
              className="px-5 py-2.5 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-700 hover:text-slate-900 font-medium transition-all"
            >
              About our methodology
            </Link>
            <Link
              href="/search"
              className="px-5 py-2.5 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-700 hover:text-slate-900 font-medium transition-all"
            >
              Browse alternatives
            </Link>
            <Link
              href="/calculator"
              className="px-5 py-2.5 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-sm text-slate-700 hover:text-slate-900 font-medium transition-all"
            >
              Calculate savings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
