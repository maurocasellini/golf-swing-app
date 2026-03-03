"use client";

import Link from "next/link";
import { SwingAnalysis } from "@/types/analysis";
import { formatDate, getScoreBgColor } from "@/lib/utils";

interface HistoryCardProps {
  analysis: SwingAnalysis;
  onDelete: (id: string) => void;
}

export default function HistoryCard({ analysis, onDelete }: HistoryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow">
      {/* Thumbnail */}
      {analysis.frameThumbnails?.impact ? (
        <img
          src={`data:image/jpeg;base64,${analysis.frameThumbnails.impact}`}
          alt="Impact frame"
          className="h-14 w-20 rounded-md object-cover flex-shrink-0"
        />
      ) : (
        <div className="h-14 w-20 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {formatDate(analysis.createdAt)}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {analysis.playerInfo?.club && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {analysis.playerInfo.club}
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 capitalize">
            {analysis.perspective}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${getScoreBgColor(analysis.overallScore)}`} />
            <span className="text-lg font-bold text-gray-900">{analysis.overallScore}</span>
          </div>
        </div>

        <Link
          href={`/history/${analysis.id}`}
          className="rounded-lg bg-golf-50 px-3 py-1.5 text-sm font-medium text-golf-700 hover:bg-golf-100 transition-colors"
        >
          View
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            if (confirm("Delete this analysis?")) onDelete(analysis.id);
          }}
          className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
