import PricingBadge from './PricingBadge';
import PlatformBadges from './PlatformBadges';
import { formatMigrationDifficulty, formatOwnershipLevel, formatCloudDependency } from '@/lib/utils';
import type { Software, SubscriptionTool, AlternativeRelation } from '@/types/software';

interface ComparisonTableProps {
  software: Software;
  subscriptionTool: SubscriptionTool;
  relation: AlternativeRelation;
}

const rows = [
  { label: 'Pricing', key: 'pricing' },
  { label: 'Platforms', key: 'platforms' },
  { label: 'Offline Support', key: 'offline' },
  { label: 'Open Source', key: 'opensource' },
  { label: 'Ownership Level', key: 'ownership' },
  { label: 'Cloud Dependency', key: 'cloud' },
  { label: 'Migration Difficulty', key: 'migration' },
] as const;

export default function ComparisonTable({ software, subscriptionTool, relation }: ComparisonTableProps) {
  const yearlyCost = (subscriptionTool.monthlyPrice || 0) * 12;

  return (
    <div className="overflow-x-auto -mx-6">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3">
              Feature
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3">
              {subscriptionTool.name}
              <span className="block text-[10px] font-normal text-slate-300 mt-0.5">Subscription</span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-amber-500 uppercase tracking-wider w-1/3">
              {software.name}
              <span className="block text-[10px] font-normal text-amber-400 mt-0.5">Alternative</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="px-6 py-4 text-sm font-medium text-slate-600">Pricing</td>
            <td className="px-6 py-4">
              <p className="text-sm font-bold text-slate-900">
                {subscriptionTool.monthlyPrice ? `$${subscriptionTool.monthlyPrice}/mo` : 'Varies'}
              </p>
              {yearlyCost > 0 && (
                <p className="text-xs text-slate-400">${yearlyCost}/year</p>
              )}
            </td>
            <td className="px-6 py-4">
              <PricingBadge type={software.pricingType} priceText={software.priceText} />
            </td>
          </tr>
          <tr className="border-b border-slate-100">
            <td className="px-6 py-4 text-sm font-medium text-slate-600">Platforms</td>
            <td className="px-6 py-4">
              <span className="text-sm text-slate-500">Web, Desktop</span>
            </td>
            <td className="px-6 py-4">
              <PlatformBadges platforms={software.platforms} />
            </td>
          </tr>
          <tr className="border-b border-slate-100">
            <td className="px-6 py-4 text-sm font-medium text-slate-600">Offline Support</td>
            <td className="px-6 py-4">
              <span className="text-sm text-slate-400">Limited</span>
            </td>
            <td className="px-6 py-4">
              {software.isOfflineSupported ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
                  Full offline
                </span>
              ) : (
                <span className="text-sm text-slate-400">Requires internet</span>
              )}
            </td>
          </tr>
          <tr className="border-b border-slate-100">
            <td className="px-6 py-4 text-sm font-medium text-slate-600">Open Source</td>
            <td className="px-6 py-4">
              <span className="text-sm text-slate-400">No</span>
            </td>
            <td className="px-6 py-4">
              {software.isOpenSource ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium">
                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs">✓</span>
                  Open source
                </span>
              ) : (
                <span className="text-sm text-slate-400">Proprietary</span>
              )}
            </td>
          </tr>
          <tr className="border-b border-slate-100">
            <td className="px-6 py-4 text-sm font-medium text-slate-600">Ownership</td>
            <td className="px-6 py-4">
              <span className="text-sm text-red-500 font-medium">Renting</span>
            </td>
            <td className="px-6 py-4">
              <span className={`text-sm font-medium ${
                software.ownershipLevel === 'HIGH' ? 'text-emerald-600' :
                software.ownershipLevel === 'MEDIUM' ? 'text-amber-600' : 'text-red-500'
              }`}>
                {formatOwnershipLevel(software.ownershipLevel)}
              </span>
            </td>
          </tr>
          <tr className="border-b border-slate-100">
            <td className="px-6 py-4 text-sm font-medium text-slate-600">Cloud Dependency</td>
            <td className="px-6 py-4">
              <span className="text-sm text-red-500 font-medium">High</span>
            </td>
            <td className="px-6 py-4">
              <span className={`text-sm font-medium ${
                software.cloudDependency === 'NONE' ? 'text-emerald-600' :
                software.cloudDependency === 'LOW' ? 'text-emerald-500' :
                software.cloudDependency === 'MEDIUM' ? 'text-amber-500' : 'text-red-500'
              }`}>
                {formatCloudDependency(software.cloudDependency)}
              </span>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 text-sm font-medium text-slate-600">Migration</td>
            <td className="px-6 py-4">
              <span className="text-sm text-slate-400">—</span>
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                relation.migrationDifficulty === 'EASY'
                  ? 'bg-emerald-50 text-emerald-700'
                  : relation.migrationDifficulty === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {formatMigrationDifficulty(relation.migrationDifficulty)}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
