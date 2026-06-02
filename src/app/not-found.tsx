import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Page Not Found | Escape Subscriptions',
  description: 'The page you requested does not exist. Browse our collection of one-time purchase and open-source alternatives to subscription software.',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Page Not Found — Escape Subscriptions',
          description: 'The page you requested does not exist. Browse our collection of one-time purchase and open-source alternatives to subscription software.',
          url: 'https://escapesubscriptions.online/',
          image: 'https://escapesubscriptions.online/og.png',
          isPartOf: {
            '@type': 'WebSite',
            name: 'Escape Subscriptions',
            url: 'https://escapesubscriptions.online',
          },
        }}
      />
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Page not found</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 bg-white border border-slate-200 hover:border-amber-300 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Browse software
          </Link>
        </div>
        <div className="border-t border-slate-200 pt-6 mb-6">
          <p className="text-xs text-slate-400 mb-3">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/calculator" className="text-xs text-slate-500 hover:text-amber-600 transition-colors">Calculator</Link>
            <span className="text-slate-300">·</span>
            <Link href="/categories" className="text-xs text-slate-500 hover:text-amber-600 transition-colors">Categories</Link>
            <span className="text-slate-300">·</span>
            <Link href="/stacks" className="text-xs text-slate-500 hover:text-amber-600 transition-colors">Stacks</Link>
            <span className="text-slate-300">·</span>
            <Link href="/use-cases" className="text-xs text-slate-500 hover:text-amber-600 transition-colors">Use Cases</Link>
            <span className="text-slate-300">·</span>
            <Link href="/about" className="text-xs text-slate-500 hover:text-amber-600 transition-colors">About</Link>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400 mb-3">Popular alternatives:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: '/alternatives/adobe-photoshop', label: 'Photoshop alternatives' },
              { href: '/alternatives/notion', label: 'Notion alternatives' },
              { href: '/alternatives/1password', label: '1Password alternatives' },
              { href: '/alternatives/figma', label: 'Figma alternatives' },
              { href: '/alternatives/grammarly', label: 'Grammarly alternatives' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-lg text-xs text-slate-600 hover:text-slate-900 font-medium transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
