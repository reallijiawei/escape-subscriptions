'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Alternative {
  software: { id: string; slug: string; name: string; pricingType: string; isOfflineSupported: boolean };
  relation: { subscriptionToolId: string };
}

interface QuickRecommendationProps {
  alternatives: Alternative[];
  bestOverallId?: string;
  bestFreeId?: string;
  bestOfflineId?: string;
}

export default function QuickRecommendation({
  alternatives,
  bestOverallId,
  bestFreeId,
  bestOfflineId,
}: QuickRecommendationProps) {
  const [communityPick, setCommunityPick] = useState<{ id: string; name: string; slug: string; votes: number } | null>(null);

  useEffect(() => {
    async function fetchVotes() {
      const results = await Promise.all(
        alternatives.map(async (a) => {
          try {
            const res = await fetch(
              `/api/vote?softwareId=${encodeURIComponent(a.software.id)}&subscriptionToolId=${encodeURIComponent(a.relation.subscriptionToolId)}`
            );
            if (res.ok) {
              const data = await res.json();
              return { ...a.software, votes: data.votes as number };
            }
          } catch {}
          return { ...a.software, votes: 0 };
        })
      );

      const topVoted = results
        .filter((r) => r.votes > 0)
        .sort((a, b) => b.votes - a.votes)[0];

      if (topVoted) {
        setCommunityPick({ id: topVoted.id, name: topVoted.name, slug: topVoted.slug, votes: topVoted.votes });
      }
    }

    fetchVotes();
  }, [alternatives]);

  const bestOverall = alternatives.find((a) => a.software.id === bestOverallId);
  const bestFree = alternatives.find((a) => a.software.id === bestFreeId);
  const bestOffline = alternatives.find((a) => a.software.id === bestOfflineId);

  const showCommunityPick = communityPick && communityPick.id !== bestOverallId;

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8 mb-8 animate-fade-in-up">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Quick Recommendation</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bestOverall && (
          <Link
            href={`/software/${bestOverall.software.slug}`}
            className="group p-5 bg-emerald-50 border border-emerald-100 rounded-xl hover:border-emerald-200 transition-colors"
          >
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Best overall</p>
            <p className="text-lg font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors">
              {bestOverall.software.name}
            </p>
          </Link>
        )}
        {bestFree && (
          <Link
            href={`/software/${bestFree.software.slug}`}
            className="group p-5 bg-blue-50 border border-blue-100 rounded-xl hover:border-blue-200 transition-colors"
          >
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Best free/OSS</p>
            <p className="text-lg font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
              {bestFree.software.name}
            </p>
          </Link>
        )}
        {bestOffline && bestOfflineId !== bestOverallId && (
          <Link
            href={`/software/${bestOffline.software.slug}`}
            className="group p-5 bg-slate-100 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Best offline</p>
            <p className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
              {bestOffline.software.name}
            </p>
          </Link>
        )}
        {showCommunityPick ? (
          <Link
            href={`/software/${communityPick.slug}`}
            className="group p-5 bg-amber-50 border border-amber-200 rounded-xl hover:border-amber-300 transition-colors"
          >
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Community pick</p>
            <p className="text-lg font-bold text-amber-900 group-hover:text-amber-700 transition-colors">
              {communityPick.name}
            </p>
            <p className="text-xs text-amber-500 mt-1">{communityPick.votes} vote{communityPick.votes !== 1 ? 's' : ''}</p>
          </Link>
        ) : (
          !bestOffline || bestOfflineId === bestOverallId ? null : <div />
        )}
      </div>
    </div>
  );
}
