import { MetadataRoute } from 'next';
import { software, subscriptionTools, categories, getAllComparisons, stacks, useCases, getFreeAlternativesForTool, getOpenSourceAlternativesForTool } from '@/lib/data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://escapesubscriptions.online';
  // Use build date as lastModified for static pages — more honest than new Date() on every build
  const buildDate = new Date('2026-06-02');

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: buildDate, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/search`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/calculator`, lastModified: buildDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: buildDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/badge`, lastModified: buildDate, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const alternativePages: MetadataRoute.Sitemap = subscriptionTools.map((tool) => {
    // Use the most recent lastCheckedAt from software that replaces this tool
    const relatedSoftware = software.filter((sw) => sw.replaces.includes(tool.id));
    const latestCheck = relatedSoftware
      .map((sw) => sw.lastCheckedAt ? new Date(sw.lastCheckedAt).getTime() : 0)
      .sort((a, b) => b - a)[0];
    return {
      url: `${baseUrl}/alternatives/${tool.slug}`,
      lastModified: latestCheck ? new Date(latestCheck) : buildDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
  });

  // Use actual lastCheckedAt for software pages when available
  const softwarePages: MetadataRoute.Sitemap = software.map((sw) => ({
    url: `${baseUrl}/software/${sw.slug}`,
    lastModified: sw.lastCheckedAt ? new Date(sw.lastCheckedAt) : buildDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/categories`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.8 },
    ...categories.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: buildDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];

  const comparisonPages: MetadataRoute.Sitemap = getAllComparisons().map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: c.software.lastCheckedAt ? new Date(c.software.lastCheckedAt) : buildDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const stackPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/stacks`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.8 },
    ...stacks.map((s) => ({
      url: `${baseUrl}/stacks/${s.slug}`,
      lastModified: buildDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  const useCasePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/use-cases`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.8 },
    ...useCases.map((u) => ({
      url: `${baseUrl}/use-cases/${u.slug}`,
      lastModified: buildDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  const freeAlternativePages: MetadataRoute.Sitemap = subscriptionTools
    .filter((tool) => getFreeAlternativesForTool(tool.id).length > 0)
    .map((tool) => {
      const freeAlts = getFreeAlternativesForTool(tool.id);
      const latestCheck = freeAlts
        .map((r) => { const sw = software.find((s) => s.id === r.softwareId); return sw?.lastCheckedAt ? new Date(sw.lastCheckedAt).getTime() : 0; })
        .sort((a, b) => b - a)[0];
      return {
        url: `${baseUrl}/free-alternatives-to/${tool.slug}`,
        lastModified: latestCheck ? new Date(latestCheck) : buildDate,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      };
    });

  const openSourceAlternativePages: MetadataRoute.Sitemap = subscriptionTools
    .filter((tool) => getOpenSourceAlternativesForTool(tool.id).length > 0)
    .map((tool) => {
      const ossAlts = getOpenSourceAlternativesForTool(tool.id);
      const latestCheck = ossAlts
        .map((r) => { const sw = software.find((s) => s.id === r.softwareId); return sw?.lastCheckedAt ? new Date(sw.lastCheckedAt).getTime() : 0; })
        .sort((a, b) => b - a)[0];
      return {
        url: `${baseUrl}/open-source-alternatives-to/${tool.slug}`,
        lastModified: latestCheck ? new Date(latestCheck) : buildDate,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      };
    });

  return [...staticPages, ...alternativePages, ...softwarePages, ...categoryPages, ...comparisonPages, ...stackPages, ...useCasePages, ...freeAlternativePages, ...openSourceAlternativePages];
}
