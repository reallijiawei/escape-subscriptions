import { formatDate } from '@/lib/utils';

export default function TrustBadge({ lastChecked }: { lastChecked?: string }) {
  return (
    <div className="flex items-center gap-3 text-xs text-slate-400">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700">
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        Independently verified
      </span>
      {lastChecked && (
        <span className="text-slate-400">
          Last checked: {formatDate(lastChecked)}
        </span>
      )}
    </div>
  );
}
