"use client";

import { useState } from "react";
import { PhaseAnalysis, SWING_PHASES } from "@/types/analysis";
import { getScoreBgColor, getSeverityColor, cn } from "@/lib/utils";

interface PhaseScoreCardProps {
  phase: PhaseAnalysis;
  thumbnail?: string;
}

export default function PhaseScoreCard({ phase, thumbnail }: PhaseScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const phaseInfo = SWING_PHASES.find((p) => p.key === phase.phase);

  return (
    <div
      className={cn(
        "rounded-xl border bg-white transition-all cursor-pointer",
        isExpanded ? "border-golf-300 shadow-md" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        {thumbnail && (
          <img
            src={`data:image/jpeg;base64,${thumbnail}`}
            alt={phaseInfo?.label}
            className="h-12 w-16 rounded-md object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm">{phaseInfo?.label || phase.phase}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getScoreBgColor(phase.score)}`}
                style={{ width: `${phase.score}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 w-8 text-right">{phase.score}</span>
          </div>
        </div>
        <svg
          className={cn("h-5 w-5 text-gray-400 transition-transform flex-shrink-0", isExpanded && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3 animate-fade-in">
          {/* Observations */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Observations</h4>
            <ul className="space-y-1">
              {phase.observations.map((obs, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-golf-600 mt-0.5">•</span>
                  {obs}
                </li>
              ))}
            </ul>
          </div>

          {/* Faults */}
          {phase.faults.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Faults</h4>
              <div className="space-y-2">
                {phase.faults.map((fault, i) => (
                  <div key={i} className={`rounded-lg border p-3 ${getSeverityColor(fault.severity)}`}>
                    <p className="text-sm font-medium">{fault.description}</p>
                    <p className="text-xs mt-1 opacity-80">
                      <span className="font-medium">Cause:</span> {fault.rootCause}
                    </p>
                    <p className="text-xs mt-0.5 opacity-80">
                      <span className="font-medium">Effect:</span> {fault.downstreamEffect}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
