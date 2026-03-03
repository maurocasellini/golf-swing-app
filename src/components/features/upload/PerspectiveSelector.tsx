"use client";

import { VideoPerspective } from "@/types/video";
import { cn } from "@/lib/utils";

interface PerspectiveSelectorProps {
  value: VideoPerspective;
  onChange: (perspective: VideoPerspective) => void;
}

export default function PerspectiveSelector({ value, onChange }: PerspectiveSelectorProps) {
  const options: { key: VideoPerspective; label: string; desc: string }[] = [
    { key: "face-on", label: "Face-On", desc: "Camera facing the golfer" },
    { key: "down-the-line", label: "Down-the-Line", desc: "Camera behind, along target line" },
  ];

  return (
    <div className="flex gap-3">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={cn(
            "flex-1 rounded-lg border-2 p-4 text-left transition-all",
            value === opt.key
              ? "border-golf-600 bg-golf-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <p className={cn(
            "font-medium text-sm",
            value === opt.key ? "text-golf-800" : "text-gray-700"
          )}>
            {opt.label}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
        </button>
      ))}
    </div>
  );
}
