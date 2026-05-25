import softwareData from '@/data/software.json';
import subscriptionToolsData from '@/data/subscription-tools.json';
import alternativeRelationsData from '@/data/alternative-relations.json';
import categoriesData from '@/data/categories.json';
import userVotesData from '@/data/user-votes.json';
import userSubmissionsData from '@/data/user-submissions.json';
import type { Software, SubscriptionTool, AlternativeRelation, UserVote, UserSubmission } from '@/types/software';

export const software: Software[] = softwareData as Software[];
export const subscriptionTools: SubscriptionTool[] = subscriptionToolsData as SubscriptionTool[];
export const alternativeRelations: AlternativeRelation[] = alternativeRelationsData as AlternativeRelation[];
export const categories = categoriesData;
export const userVotes: UserVote[] = userVotesData as UserVote[];
export const userSubmissions: UserSubmission[] = userSubmissionsData as UserSubmission[];

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
