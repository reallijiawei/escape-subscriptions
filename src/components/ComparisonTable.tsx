import PricingBadge from './PricingBadge';
import PlatformBadges from './PlatformBadges';
import { formatMigrationDifficulty, formatOwnershipLevel, formatCloudDependency } from '@/lib/utils';
import type { Software, SubscriptionTool, AlternativeRelation } from '@/types/software';

interface ComparisonTableProps {
  software: Software;
  subscriptionTool: SubscriptionTool;
  relation: AlternativeRelation;
}

export default function ComparisonTable({ software, subscriptionTool, relation }: ComparisonTableProps) {
  const yearlyCost = (subscriptionTool.monthlyPrice || 0) * 12;

  const comparisonRows = [
    {
      label: 'Pricing',
      sub: (
        <>
          <p className="text-sm font-bold text-slate-900">
            {subscriptionTool.monthlyPrice ? `$${subscriptionTool.monthlyPrice}/mo` : 'Varies'}
          </p>
          {yearlyCost > 0 && <p className="text-xs text-slate-400">${yearlyCost}/year</p>}
        </>
      ),
      alt: <PricingBadge type={software.pricingType} priceText={software.priceText} />,
    },
    {
      label: 'Platforms',
      sub: <span className="text-sm text-slate-500">Web, Desktop</span>,
      alt: <PlatformBadges platforms={software.platforms} />,
    },
    {
      label: 'Offline Support',
      sub: <span className="text-sm text-slate-400">Limited</span>,
      alt: software.isOfflineSupported ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
          <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
          Full offline
        </span>
      ) : (
        <span className="text-sm text-slate-400">Requires internet</span>
      ),
    },
    {
      label: 'Open Source',
      sub: <span className="text-sm text-slate-400">No</span>,
      alt: software.isOpenSource ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium">
          <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs">✓</span>
          Open source
        </span>
      ) : (
        <span className="text-sm text-slate-400">Proprietary</span>
      ),
    },
    {
      label: 'Ownership',
      sub: <span className="text-sm text-red-500 font-medium">Renting</span>,
      alt: (
        <span className={`text-sm font-medium ${
          software.ownershipLevel === 'HIGH' ? 'text-emerald-600' :
          software.ownershipLevel === 'MEDIUM' ? 'text-amber-600' : 'text-red-500'
        }`}>
          {formatOwnershipLevel(software.ownershipLevel)}
        </span>
      ),
    },
    {
      label: 'Cloud Dependency',
      sub: <span className="text-sm text-red-500 font-medium">High</span>,
      alt: (
        <span className={`text-sm font-medium ${
          software.cloudDependency === 'NONE' ? 'text-emerald-600' :
          software.cloudDependency === 'LOW' ? 'text-emerald-500' :
          software.cloudDependency === 'MEDIUM' ? 'text-amber-500' : 'text-red-500'
        }`}>
          {formatCloudDependency(software.cloudDependency)}
        </span>
      ),
    },
    {
      label: 'Migration',
      sub: <span className="text-sm text-slate-400">—</span>,
      alt: (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
          relation.migrationDifficulty === 'EASY'
            ? 'bg-emerald-50 text-emerald-700'
            : relation.migrationDifficulty === 'MEDIUM'
            ? 'bg-amber-50 text-amber-700'
            : 'bg-red-50 text-red-700'
        }`}>
          {formatMigrationDifficulty(relation.migrationDifficulty)}
        </span>
      ),
    },
  ];

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto -mx-6">
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
            {comparisonRows.map((row, i) => (
              <tr key={row.label} className={i < comparisonRows.length - 1 ? 'border-b border-slate-100' : ''}>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.label}</td>
                <td className="px-6 py-4">{row.sub}</td>
                <td className="px-6 py-4">{row.alt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {comparisonRows.map((row) => (
          <div key={row.label} className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{row.label}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{subscriptionTool.name}</p>
                {row.sub}
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{software.name}</p>
                {row.alt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
