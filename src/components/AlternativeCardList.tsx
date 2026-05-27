'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AlternativeVoteButtons from './AlternativeVoteButtons';
import PricingBadge from './PricingBadge';

interface AlternativeCard {
  relation: any;
  software: any;
}

interface AlternativeCardListProps {
  alternatives: AlternativeCard[];
  toolSlug: string;
  toolName: string;
  bestOverallId?: string;
}

export default function AlternativeCardList({
  alternatives,
  toolSlug,
  toolName,
  bestOverallId,
}: AlternativeCardListProps) {
  const [communityPickId, setCommunityPickId] = useState<string | null>(null);

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
              return { id: a.software.id, votes: data.votes as number };
            }
          } catch {}
          return { id: a.software.id, votes: 0 };
        })
      );

      const topVoted = results
        .filter((r) => r.votes > 0)
        .sort((a, b) => b.votes - a.votes)[0];

      if (topVoted) {
        setCommunityPickId(topVoted.id);
      }
    }

    fetchVotes();
  }, [alternatives]);

  return (
    <div className="space-y-4">
      {alternatives.map(({ relation, software }, index) => {
        const isCommunityPick = communityPickId === software.id;

        return (
          <div
            key={software.id}
            className={`bg-white rounded-2xl border p-6 sm:p-8 hover-lift ${
              isCommunityPick ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900">
                    <Link
                      href={`/software/${software.slug}`}
                      className="hover:text-amber-600 transition-colors"
                    >
                      {software.name}
                    </Link>
                  </h3>
                  {index === 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">
                      Top Pick
                    </span>
                  )}
                  {isCommunityPick && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                      Community Pick
                    </span>
                  )}
                  {relation.similarityScore != null && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                      {relation.similarityScore}% Match
                    </span>
                  )}
                </div>
                <p className="text-sm text-amber-600 font-medium">{relation.recommendationLabel}</p>
              </div>
              <AlternativeVoteButtons
                softwareId={software.id}
                subscriptionToolId={relation.subscriptionToolId}
              />
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">{software.description}</p>

            {relation.notes && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Editor&apos;s Note</p>
                <p className="text-sm text-amber-800 leading-relaxed">{relation.notes}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">What you gain</p>
                <ul className="space-y-2">
                  {relation.whatYouGain.map((item: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-slate-600">
                      <span className="text-emerald-500 mr-2 mt-0.5">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">What you lose</p>
                <ul className="space-y-2">
                  {relation.whatYouLose.map((item: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-slate-600">
                      <span className="text-red-400 mr-2 mt-0.5">−</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-3 flex-wrap">
                <PricingBadge type={software.pricingType} priceText={software.priceText} />
                <span className="text-xs text-slate-400">
                  Migration: <span className="font-medium text-slate-600">{relation.migrationDifficulty}</span>
                </span>
                {software.requiresAccount && (
                  <span className="text-xs text-slate-400">Requires account</span>
                )}
                {software.hasFreeTrial && (
                  <span className="text-xs text-emerald-500 font-medium">Free trial</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/compare/${software.slug}-vs-${toolSlug}`}
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 font-semibold transition-colors"
                >
                  Compare
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </Link>
                <a
                  href={software.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                >
                  Visit Website
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
