import { MetadataRoute } from 'next';
import { software, subscriptionTools, categories, getAllComparisons, stacks, useCases } from '@/lib/data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://escapesubscriptions.online';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/badge`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const alternativePages: MetadataRoute.Sitemap = subscriptionTools.map((tool) => ({
    url: `${baseUrl}/alternatives/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const softwarePages: MetadataRoute.Sitemap = software.map((sw) => ({
    url: `${baseUrl}/software/${sw.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...categories.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];

  const comparisonPages: MetadataRoute.Sitemap = getAllComparisons().map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const stackPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/stacks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...stacks.map((s) => ({
      url: `${baseUrl}/stacks/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  const useCasePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/use-cases`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...useCases.map((u) => ({
      url: `${baseUrl}/use-cases/${u.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  return [...staticPages, ...alternativePages, ...softwarePages, ...categoryPages, ...comparisonPages, ...stackPages, ...useCasePages];
}
