import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search No-Subscription Software',
  description:
    'Search for one-time purchase, open-source, and lifetime alternatives to subscription software.',
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: 'Search No-Subscription Software',
    description:
      'Search for one-time purchase, open-source, and lifetime alternatives to subscription software.',
    url: '/search',
    type: 'website',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
