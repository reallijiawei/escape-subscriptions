import { formatPlatform } from '@/lib/utils';

interface PlatformBadgesProps {
  platforms: string[];
}

const platformIcons: Record<string, string> = {
  WINDOWS: '⊞',
  MACOS: '⌘',
  LINUX: '◎',
  IOS: '◉',
  ANDROID: '◈',
  WEB: '◇',
  SELF_HOSTED: '⌂',
  IPAD: '▣',
};

export default function PlatformBadges({ platforms }: PlatformBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {platforms.map((platform) => (
        <span
          key={platform}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/50"
        >
          <span aria-hidden="true" className="text-[10px] opacity-60">{platformIcons[platform] || '○'}</span>
          {formatPlatform(platform)}
        </span>
      ))}
    </div>
  );
}
