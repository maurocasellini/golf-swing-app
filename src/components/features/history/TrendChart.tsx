"use client";

interface TrendChartProps {
  data: { date: string; score: number }[];
}

export default function TrendChart({ data }: TrendChartProps) {
  if (data.length < 2) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          Need at least 2 analyses to show trends. Keep practicing!
        </p>
      </div>
    );
  }

  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minScore = Math.max(0, Math.min(...data.map((d) => d.score)) - 10);
  const maxScore = Math.min(100, Math.max(...data.map((d) => d.score)) + 10);

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + (1 - (d.score - minScore) / (maxScore - minScore)) * chartHeight,
    score: d.score,
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const gridLines = [minScore, Math.round((minScore + maxScore) / 2), maxScore];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Score Trend</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {gridLines.map((val) => {
          const y = padding.top + (1 - (val - minScore) / (maxScore - minScore)) * chartHeight;
          return (
            <g key={val}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#f3f4f6" strokeWidth="1" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#9ca3af">
                {val}
              </text>
            </g>
          );
        })}

        {/* Line */}
        <path d={pathD} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points and labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#16a34a" stroke="white" strokeWidth="2" />
            <text x={p.x} y={height - 8} textAnchor="middle" className="text-[9px]" fill="#9ca3af">
              {p.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
