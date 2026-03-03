"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SwingAnalysis } from "@/types/analysis";
import { getAnalysisById, deleteAnalysis } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import OverallScore from "@/components/features/analysis/OverallScore";
import PhaseScoreCard from "@/components/features/analysis/PhaseScoreCard";
import CauseEffectChainComponent from "@/components/features/analysis/CauseEffectChain";
import DrillCard from "@/components/features/analysis/DrillCard";
import Link from "next/link";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<SwingAnalysis | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    setAnalysis(getAnalysisById(id));
    setIsLoaded(true);
  }, [params.id]);

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Analysis not found</h1>
        <p className="text-gray-500 mb-4">This analysis may have been deleted.</p>
        <Link href="/history" className="text-golf-700 font-medium hover:underline">
          Back to History
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm("Delete this analysis? This cannot be undone.")) {
      deleteAnalysis(analysis.id);
      router.push("/history");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/history" className="text-sm text-golf-700 hover:underline mb-1 inline-block">
            &larr; Back to History
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            Analysis — {formatDate(analysis.createdAt)}
          </h1>
          <div className="flex gap-3 mt-1 text-sm text-gray-500">
            {analysis.playerInfo?.club && <span>{analysis.playerInfo.club}</span>}
            <span className="capitalize">{analysis.perspective}</span>
            {analysis.playerInfo?.handicap !== undefined && (
              <span>HCP {analysis.playerInfo.handicap}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>

      <OverallScore score={analysis.overallScore} summary={analysis.summary} />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Phase-by-Phase Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analysis.phases.map((phase) => (
            <PhaseScoreCard
              key={phase.phase}
              phase={phase}
              thumbnail={analysis.frameThumbnails?.[phase.phase]}
            />
          ))}
        </div>
      </div>

      {analysis.causeEffectChains.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Cause-Effect Analysis</h3>
          <div className="space-y-3">
            {analysis.causeEffectChains.map((chain, i) => (
              <CauseEffectChainComponent key={i} chain={chain} />
            ))}
          </div>
        </div>
      )}

      {analysis.improvements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Improvement Priorities</h3>
          <div className="space-y-3">
            {analysis.improvements
              .sort((a, b) => a.priority - b.priority)
              .map((drill, i) => (
                <DrillCard key={i} drill={drill} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
