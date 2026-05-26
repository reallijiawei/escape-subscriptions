import softwareData from '@/data/software.json';
import subscriptionToolsData from '@/data/subscription-tools.json';
import alternativeRelationsData from '@/data/alternative-relations.json';
import categoriesData from '@/data/categories.json';
import userVotesData from '@/data/user-votes.json';
import userSubmissionsData from '@/data/user-submissions.json';
import stacksData from '@/data/stacks.json';
import type { Software, SubscriptionTool, AlternativeRelation, UserVote, UserSubmission } from '@/types/software';

export const software: Software[] = softwareData as Software[];
export const subscriptionTools: SubscriptionTool[] = subscriptionToolsData as SubscriptionTool[];
export const alternativeRelations: AlternativeRelation[] = alternativeRelationsData as AlternativeRelation[];
export const categories = categoriesData;
export const userVotes: UserVote[] = userVotesData as UserVote[];
export const userSubmissions: UserSubmission[] = userSubmissionsData as UserSubmission[];

export interface StackItem {
  subscriptionToolId: string;
  softwareId: string;
  note: string;
}

export interface Stack {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  annualSavings: number;
  items: StackItem[];
}

export const stacks: Stack[] = stacksData as Stack[];

export function getStackBySlug(slug: string): Stack | undefined {
  return stacks.find((s) => s.slug === slug);
}

export function getSoftwareBySlug(slug: string): Software | undefined {
  return software.find((s) => s.slug === slug);
}

export function getSubscriptionToolBySlug(slug: string): SubscriptionTool | undefined {
  return subscriptionTools.find((t) => t.slug === slug);
}

export function getAlternativesForTool(toolId: string): AlternativeRelation[] {
  return alternativeRelations
    .filter((r) => r.subscriptionToolId === toolId)
    .sort((a, b) => a.recommendationRank - b.recommendationRank);
}

export function getSoftwareForAlternative(relation: AlternativeRelation): Software | undefined {
  return software.find((s) => s.id === relation.softwareId);
}

export function searchSoftware(query: string): (Software | SubscriptionTool)[] {
  const lowerQuery = query.toLowerCase();
  const matchedSoftware = software.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
  );
  const matchedTools = subscriptionTools.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery)
  );
  return [...matchedTools, ...matchedSoftware];
}

export function getSoftwareByCategory(category: string): Software[] {
  return software.filter((s) => s.categories.includes(category as any));
}

export function getToolsByCategory(category: string): SubscriptionTool[] {
  return subscriptionTools.filter((t) => t.category === category);
}

export function getVotesForSoftware(softwareId: string, subscriptionToolId: string): number {
  const relevant = userVotes.filter(
    (v) => v.softwareId === softwareId && v.subscriptionToolId === subscriptionToolId
  );
  return relevant.reduce((sum, v) => sum + (v.vote === 'up' ? 1 : -1), 0);
}

export function getSubmissionsForTool(toolId: string): UserSubmission[] {
  return userSubmissions.filter((s) => s.subscriptionToolId === toolId);
}

export interface Comparison {
  software: Software;
  subscriptionTool: SubscriptionTool;
  relation: AlternativeRelation;
  slug: string;
}

export function getAllComparisons(): Comparison[] {
  return alternativeRelations
    .map((relation) => {
      const sw = software.find((s) => s.id === relation.softwareId);
      const tool = subscriptionTools.find((t) => t.id === relation.subscriptionToolId);
      if (!sw || !tool) return null;
      return {
        software: sw,
        subscriptionTool: tool,
        relation,
        slug: `${sw.slug}-vs-${tool.slug}`,
      };
    })
    .filter(Boolean) as Comparison[];
}

export function getComparisonBySlug(slug: string): Comparison | undefined {
  const parts = slug.split('-vs-');
  if (parts.length < 2) return undefined;

  // Find the split point: everything before first "-vs-" is software slug, rest is tool slug
  const vsIndex = slug.indexOf('-vs-');
  const softwareSlug = slug.substring(0, vsIndex);
  const toolSlug = slug.substring(vsIndex + 4);

  const sw = software.find((s) => s.slug === softwareSlug);
  const tool = subscriptionTools.find((t) => t.slug === toolSlug);
  if (!sw || !tool) return undefined;

  const relation = alternativeRelations.find(
    (r) => r.softwareId === sw.id && r.subscriptionToolId === tool.id
  );
  if (!relation) return undefined;

  return { software: sw, subscriptionTool: tool, relation, slug };
}
