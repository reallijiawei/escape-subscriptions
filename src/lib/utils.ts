import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatPricingType(pricingType: string): string {
  const map: Record<string, string> = {
    ONE_TIME_PURCHASE: 'One-time Purchase',
    LIFETIME_DEAL: 'Lifetime Deal',
    OPEN_SOURCE: 'Open Source',
    FREE: 'Free',
    FREEMIUM: 'Freemium',
    SUBSCRIPTION_WITH_FREE_PLAN: 'Subscription (Free Plan)',
    SUBSCRIPTION: 'Subscription',
  };
  return map[pricingType] || pricingType;
}

export function formatPlatform(platform: string): string {
  const map: Record<string, string> = {
    WINDOWS: 'Windows',
    MACOS: 'macOS',
    LINUX: 'Linux',
    IOS: 'iOS',
    ANDROID: 'Android',
    WEB: 'Web',
    SELF_HOSTED: 'Self-hosted',
    IPAD: 'iPad',
  };
  return map[platform] || platform;
}

export function formatCategory(category: string): string {
  const map: Record<string, string> = {
    DESIGN: 'Design',
    PRODUCTIVITY: 'Productivity',
    WRITING: 'Writing',
    VIDEO_AUDIO: 'Video & Audio',
    DEVELOPER_TOOLS: 'Developer Tools',
    BUSINESS: 'Business',
    SECURITY: 'Security',
    STORAGE: 'Storage',
    AI_TOOLS: 'AI Tools',
    EDUCATION: 'Education',
    ENTERTAINMENT: 'Entertainment',
    SCREEN_RECORDING: 'Screen Recording & Demos',
  };
  return map[category] || category;
}

export function formatMigrationDifficulty(difficulty: string): string {
  const map: Record<string, string> = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
  };
  return map[difficulty] || difficulty;
}

export function formatOwnershipLevel(level: string): string {
  const map: Record<string, string> = {
    HIGH: 'Full ownership',
    MEDIUM: 'Partial ownership',
    LOW: 'Limited ownership',
  };
  return map[level] || level;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatCloudDependency(level: string): string {
  const map: Record<string, string> = {
    NONE: 'No cloud needed',
    LOW: 'Mostly offline',
    MEDIUM: 'Hybrid',
    HIGH: 'Cloud required',
  };
  return map[level] || level;
}
