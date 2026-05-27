import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap';

export const metadata: Metadata = {
  metadataBase: new URL('https://escapesubscriptions.online'),
  title: {
    default: 'Escape Subscriptions — Tired of Software Subscriptions?',
    template: '%s | Escape Subscriptions',
  },
  description:
    'A site for people tired of software subscriptions. Find free, open-source, and one-time purchase alternatives to the tools draining your wallet.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Escape Subscriptions',
    title: 'Escape Subscriptions — Tired of Software Subscriptions?',
    description:
      'A site for people tired of software subscriptions. Find free, open-source, and one-time purchase alternatives to the tools draining your wallet.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Escape Subscriptions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Escape Subscriptions — Tired of Software Subscriptions?',
    description:
      'A site for people tired of software subscriptions. Find free, open-source, and one-time purchase alternatives to the tools draining your wallet.',
    images: ['/og-image.svg'],
  },
  verification: {
    // TODO: Replace with your actual Google Search Console verification code
    // Get it from: https://search.google.com/search-console → Add property → HTML tag method
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.svg',
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
        {/* Google tag (gtag.js) */}
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
