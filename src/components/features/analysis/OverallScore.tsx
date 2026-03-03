"use client";

import { getScoreLabel } from "@/lib/utils";

interface OverallScoreProps {
  score: number;
  summary: string;
}

export default function OverallScore({ score, summary }: OverallScoreProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 75) return { stroke: "#16a34a", bg: "bg-green-50", text: "text-green-700" };
    if (s >= 60) return { stroke: "#ca8a04", bg: "bg-yellow-50", text: "text-yellow-700" };
    if (s >= 45) return { stroke: "#f97316", bg: "bg-orange-50", text: "text-orange-700" };
    return { stroke: "#dc2626", bg: "bg-red-50", text: "text-red-700" };
  };

  const colors = getColor(score);

  return (
    <div className={`rounded-2xl ${colors.bg} p-8 flex flex-col sm:flex-row items-center gap-6`}>
      <div className="relative flex-shrink-0">
        <svg width="160" height="160" viewBox="0 0 100 100" className="transform -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="7" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-score-fill"
            style={{ strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900">{score}</span>
          <span className={`text-sm font-medium ${colors.text}`}>{getScoreLabel(score)}</span>
        </div>
      </div>
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Swing Analysis</h2>
        <p className="text-gray-600 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
