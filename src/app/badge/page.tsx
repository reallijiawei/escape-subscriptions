import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
import FAQSection from '@/components/FAQSection';

export const metadata: Metadata = {
  title: 'Embed Badge | Escape Subscriptions',
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

const badgeFaq = [
  {
    question: 'Who can use the Escape Subscriptions badge?',
    answer: 'Any software listed on Escape Subscriptions can display the badge. If your tool is a free, open-source, or one-time purchase alternative to a subscription service, and it appears in our database, you are welcome to use the badge.',
  },
  {
    question: 'What size should the badge be?',
    answer: 'The badge SVG is designed to display at 220×36 pixels, but it scales cleanly to any size. We recommend keeping it at least 160px wide for readability.',
  },
  {
    question: 'Does the badge affect my site\'s SEO?',
    answer: 'The badge links to Escape Subscriptions with a standard follow link. It can help your SEO by providing a relevant backlink from a directory in your niche. We do not use nofollow or sponsored attributes.',
  },
  {
    question: 'How do I get my software listed?',
    answer: 'Use the recommendation form on any alternatives page to suggest your tool. We review submissions based on features, pricing model, and community health. Most reviews are completed within a week.',
  },
];

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
      <JsonLd data={faqSchema(badgeFaq)} />
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

        {/* Why Use the Badge */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Why Use the Badge?</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            The Escape Subscriptions badge signals to your visitors that your software has been reviewed and listed as a subscription-free alternative. It builds trust with users who are actively looking for tools they can own rather than rent.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Displaying the badge on your website or GitHub README helps users discover your tool through our directory, and provides a relevant backlink that can improve your search engine rankings. The badge is free to use for any listed software.
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
          <FAQSection items={badgeFaq} />
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
