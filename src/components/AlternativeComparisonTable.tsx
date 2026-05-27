import Link from 'next/link';
import PricingBadge from './PricingBadge';
import PlatformBadges from './PlatformBadges';
import AlternativeVoteButtons from './AlternativeVoteButtons';
import { formatMigrationDifficulty, formatOwnershipLevel } from '@/lib/utils';
import { getVotesForSoftware } from '@/lib/data';
import type { Software, AlternativeRelation, PricingType } from '@/types/software';

interface AlternativeComparisonTableProps {
  alternatives: {
    relation: AlternativeRelation;
    software: Software;
  }[];
}

const pricingGroups: { label: string; types: PricingType[] }[] = [
  { label: 'Free / Open Source', types: ['OPEN_SOURCE', 'FREE'] },
  { label: 'Freemium', types: ['FREEMIUM', 'SUBSCRIPTION_WITH_FREE_PLAN'] },
  { label: 'One-time Purchase', types: ['ONE_TIME_PURCHASE', 'LIFETIME_DEAL'] },
];

function groupAlternatives(alternatives: AlternativeComparisonTableProps['alternatives']) {
  const grouped: { label: string; items: AlternativeComparisonTableProps['alternatives'] }[] = [];

  for (const group of pricingGroups) {
    const items = alternatives.filter((a) => group.types.includes(a.software.pricingType));
    if (items.length > 0) {
      grouped.push({ label: group.label, items });
    }
  }

  const categorizedIds = new Set(pricingGroups.flatMap((g) => g.types));
  const remaining = alternatives.filter((a) => !categorizedIds.has(a.software.pricingType));
  if (remaining.length > 0) {
    grouped.push({ label: 'Other', items: remaining });
  }

  return grouped;
}

export default function AlternativeComparisonTable({ alternatives }: AlternativeComparisonTableProps) {
  const grouped = groupAlternatives(alternatives);

  return (
    <div className="space-y-6">
      {grouped.map((group) => (
        <div key={group.label}>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
            {group.label}
          </h3>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto -mx-6">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Tool</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Match</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Platform</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Offline</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">OSS</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Ownership</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Migration</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Vote</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map(({ relation, software }) => (
                  <tr
                    key={software.id}
                    className="border-b border-slate-100 hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/software/${software.slug}`}
                          className="font-bold text-slate-900 hover:text-amber-600 transition-colors"
                        >
                          {software.name}
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">{relation.recommendationLabel}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {relation.similarityScore != null && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          {relation.similarityScore}%
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <PricingBadge type={software.pricingType} priceText={software.priceText} />
                    </td>
                    <td className="px-4 py-4">
                      <PlatformBadges platforms={software.platforms} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      {software.isOfflineSupported ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs">✓</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {software.isOpenSource ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">✓</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-medium ${
                          software.ownershipLevel === 'HIGH'
                            ? 'text-emerald-700'
                            : software.ownershipLevel === 'MEDIUM'
                            ? 'text-amber-700'
                            : 'text-red-600'
                        }`}
                      >
                        {formatOwnershipLevel(software.ownershipLevel)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                          relation.migrationDifficulty === 'EASY'
                            ? 'bg-emerald-50 text-emerald-700'
                            : relation.migrationDifficulty === 'MEDIUM'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {formatMigrationDifficulty(relation.migrationDifficulty)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <AlternativeVoteButtons
                        softwareId={software.id}
                        subscriptionToolId={relation.subscriptionToolId}
                        initialVotes={(relation.votes || 0) + getVotesForSoftware(software.id, relation.subscriptionToolId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {group.items.map(({ relation, software }) => (
              <div key={software.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/software/${software.slug}`}
                        className="font-bold text-slate-900 hover:text-amber-600 transition-colors"
                      >
                        {software.name}
                      </Link>
                      {relation.similarityScore != null && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          {relation.similarityScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{relation.recommendationLabel}</p>
                  </div>
                  <AlternativeVoteButtons
                    softwareId={software.id}
                    subscriptionToolId={relation.subscriptionToolId}
                    initialVotes={(relation.votes || 0) + getVotesForSoftware(software.id, relation.subscriptionToolId)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Pricing</span>
                    <PricingBadge type={software.pricingType} priceText={software.priceText} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Migration</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                        relation.migrationDifficulty === 'EASY'
                          ? 'bg-emerald-50 text-emerald-700'
                          : relation.migrationDifficulty === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {formatMigrationDifficulty(relation.migrationDifficulty)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Ownership</span>
                    <span
                      className={`text-xs font-medium ${
                        software.ownershipLevel === 'HIGH'
                          ? 'text-emerald-700'
                          : software.ownershipLevel === 'MEDIUM'
                          ? 'text-amber-700'
                          : 'text-red-600'
                      }`}
                    >
                      {formatOwnershipLevel(software.ownershipLevel)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Platform</span>
                    <PlatformBadges platforms={software.platforms} />
                  </div>
                </div>

                <div className="flex gap-3 mt-3 pt-3 border-t border-slate-100">
                  {software.isOfflineSupported && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">✓</span>
                      Offline
                    </span>
                  )}
                  {software.isOpenSource && (
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                      <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">✓</span>
                      Open Source
                    </span>
                  )}
                  {software.requiresAccount && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      Account required
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
