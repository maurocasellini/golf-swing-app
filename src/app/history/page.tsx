"use client";

import { useState, useEffect } from "react";
import { SwingAnalysis } from "@/types/analysis";
import { getAllAnalyses, deleteAnalysis, getScoreTrend, getStorageUsage } from "@/lib/storage";
import HistoryCard from "@/components/features/history/HistoryCard";
import TrendChart from "@/components/features/history/TrendChart";
import Link from "next/link";

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<SwingAnalysis[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAnalyses(getAllAnalyses());
    setIsLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    setAnalyses(getAllAnalyses());
  };

  const trend = getScoreTrend();
  const storage = getStorageUsage();

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Swing History</h1>
        <Link
          href="/analyze"
          className="rounded-lg bg-golf-700 px-4 py-2 text-sm font-semibold text-white hover:bg-golf-800 transition-colors"
        >
          New Analysis
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-gray-200 bg-white">
          <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No analyses yet</h3>
          <p className="text-gray-500 mb-4">Upload a swing video to get started.</p>
          <Link
            href="/analyze"
            className="inline-flex rounded-lg bg-golf-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-golf-800"
          >
            Analyze Your First Swing
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <TrendChart data={trend} />

          <div className="space-y-3">
            {analyses.map((a) => (
              <HistoryCard key={a.id} analysis={a} onDelete={handleDelete} />
            ))}
          </div>

          {/* Storage indicator */}
          <div className="rounded-lg bg-gray-50 px-4 py-3 flex items-center justify-between text-xs text-gray-500">
            <span>Storage: {(storage.usedKB / 1024).toFixed(1)} MB / {(storage.limitKB / 1024).toFixed(0)} MB</span>
            <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${storage.percentage > 80 ? "bg-red-500" : "bg-golf-500"}`}
                style={{ width: `${Math.min(100, storage.percentage)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
