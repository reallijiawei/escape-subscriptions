export type PricingType =
  | 'ONE_TIME_PURCHASE'
  | 'LIFETIME_DEAL'
  | 'OPEN_SOURCE'
  | 'FREE'
  | 'FREEMIUM'
  | 'SUBSCRIPTION_WITH_FREE_PLAN'
  | 'SUBSCRIPTION';

export type Platform =
  | 'WINDOWS'
  | 'MACOS'
  | 'LINUX'
  | 'IOS'
  | 'ANDROID'
  | 'WEB'
  | 'SELF_HOSTED'
  | 'IPAD';

export type Category =
  | 'DESIGN'
  | 'PRODUCTIVITY'
  | 'WRITING'
  | 'VIDEO_AUDIO'
  | 'DEVELOPER_TOOLS'
  | 'BUSINESS'
  | 'SECURITY'
  | 'STORAGE'
  | 'AI_TOOLS'
  | 'EDUCATION'
  | 'ENTERTAINMENT'
  | 'SCREEN_RECORDING';

export type OwnershipLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type CloudDependency = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
export interface Software {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  pricingType: PricingType;
  priceText: string;
  startingPrice: number | null;
  currency: string | null;
  platforms: Platform[];
  categories: Category[];
  isOpenSource: boolean;
  isOfflineSupported: boolean;
  requiresAccount: boolean;
  hasFreeTrial: boolean;
  ownershipLevel: OwnershipLevel;
  cloudDependency: CloudDependency;
  bestFor: string[];
  pros: string[];
  cons: string[];
  replaces: string[];
  affiliateUrl: string | null;
  lastCheckedAt: string;
}

export interface SubscriptionTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  currency: string;
  category: Category;
  commonUseCases: string[];
}

export type MigrationDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface AlternativeRelation {
  id: string;
  subscriptionToolId: string;
  softwareId: string;
  recommendationRank: number;
  recommendationLabel: string;
  similarityScore: number;
  migrationDifficulty: MigrationDifficulty;
  whatYouGain: string[];
  whatYouLose: string[];
  bestFor: string[];
  notFor: string[];
  notes: string;
  votes?: number;
}

export interface UserVote {
  id: string;
  softwareId: string;
  subscriptionToolId: string;
  vote: 'up' | 'down';
  createdAt: string;
}

export interface UserSubmission {
  id: string;
  subscriptionToolId: string;
  softwareName: string;
  websiteUrl: string;
  reason: string;
  createdAt: string;
}
