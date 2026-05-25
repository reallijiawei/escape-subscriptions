interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Escape Subscriptions',
    url: 'https://escapesubscriptions.online',
    description:
      'Find one-time payment, open-source, offline, and lifetime alternatives to expensive software subscriptions.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://escapesubscriptions.online/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Escape Subscriptions',
    url: 'https://escapesubscriptions.online',
    logo: 'https://escapesubscriptions.online/favicon.svg',
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://escapesubscriptions.online${item.url}`,
    })),
  };
}

export function faqSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export function softwareApplicationSchema(sw: {
  name: string;
  description: string;
  url: string;
  pricingType: string;
  priceText?: string;
  platforms: string[];
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: sw.name,
    description: sw.description,
    url: sw.url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: sw.platforms.join(', '),
  };

  if (sw.pricingType === 'FREE' || sw.pricingType === 'OPEN_SOURCE') {
    schema.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    };
  } else if (sw.priceText) {
    schema.offers = {
      '@type': 'Offer',
      price: sw.priceText,
      priceCurrency: 'USD',
    };
  }

  return schema;
}
