import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap';

export const metadata: Metadata = {
  metadataBase: new URL('https://escapesubscriptions.online'),
  title: {
    default: 'Buy Software Once — One-Time Purchase Alternatives to Subscriptions',
    template: '%s | Escape Subscriptions',
  },
  description:
    'Stop renting your software. Find free, open-source, and one-time purchase alternatives to Adobe, Notion, 1Password, and 50+ subscription tools. Save $500+/year.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Escape Subscriptions',
    title: 'Buy Software Once — One-Time Purchase Alternatives to Subscriptions',
    description:
      'Stop renting your software. Find free, open-source, and one-time purchase alternatives to Adobe, Notion, 1Password, and 50+ subscription tools. Save $500+/year.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Escape Subscriptions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Software Once — One-Time Purchase Alternatives to Subscriptions',
    description:
      'Stop renting your software. Find free, open-source, and one-time purchase alternatives to Adobe, Notion, 1Password, and 50+ subscription tools. Save $500+/year.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONT_URL} rel="stylesheet" />
        {/* Preload critical assets */}
        <link rel="preload" href="/og-image.png" as="image" type="image/png" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Google tag (gtag.js) — deferred for performance */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M11EGLMP1M" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-M11EGLMP1M');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
