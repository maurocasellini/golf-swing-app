"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { SwingPhase, SWING_PHASES } from "@/types/analysis";
import { cn } from "@/lib/utils";

interface FrameTimelineProps {
  duration: number;
  currentTime: number;
  activePhase: SwingPhase;
  capturedPhases: Set<SwingPhase>;
  timestamps: Partial<Record<SwingPhase, number>>;
  onSeek: (time: number) => void;
  onPhaseSelect: (phase: SwingPhase) => void;
}

const PHASE_COLORS: Record<SwingPhase, string> = {
  address: "bg-blue-500",
  takeaway: "bg-indigo-500",
  top: "bg-purple-500",
  transition: "bg-pink-500",
  "mid-downswing": "bg-red-500",
  impact: "bg-orange-500",
  "follow-through": "bg-yellow-500",
  finish: "bg-green-500",
};

export default function FrameTimeline({
  duration,
  currentTime,
  activePhase,
  capturedPhases,
  timestamps,
  onSeek,
  onPhaseSelect,
}: FrameTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getTimeFromPosition = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || duration <= 0) return 0;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return ratio * duration;
    },
    [duration]
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      const time = getTimeFromPosition(e.clientX);
      onSeek(time);
    },
    [getTimeFromPosition, onSeek]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      const time = getTimeFromPosition(e.clientX);
      onSeek(time);
    };

    const handleUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, getTimeFromPosition, onSeek]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Phase selector buttons */}
      <div className="flex flex-wrap gap-1.5">
        {SWING_PHASES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onPhaseSelect(key)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
              activePhase === key
                ? "bg-golf-700 text-white shadow-sm"
                : capturedPhases.has(key)
                ? "bg-golf-100 text-golf-800 ring-1 ring-golf-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {capturedPhases.has(key) && "✓ "}
            {label}
          </button>
        ))}
      </div>

      {/* Timeline track */}
      <div
        ref={trackRef}
        className="relative h-10 cursor-pointer rounded-lg bg-gray-200"
        onClick={handleTrackClick}
        onMouseDown={() => setIsDragging(true)}
      >
        {/* Progress fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-l-lg bg-golf-200"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Phase markers */}
        {Object.entries(timestamps).map(([phase, time]) => {
          if (time === undefined || duration <= 0) return null;
          const left = (time / duration) * 100;
          return (
            <div
              key={phase}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-1.5 rounded-full",
                PHASE_COLORS[phase as SwingPhase]
              )}
              style={{ left: `${left}%` }}
              title={`${SWING_PHASES.find((p) => p.key === phase)?.label}: ${time.toFixed(2)}s`}
            />
          );
        })}

        {/* Playhead */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-3 rounded-full bg-golf-700 border-2 border-white shadow-md"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{currentTime.toFixed(2)}s</span>
        <span>{duration.toFixed(2)}s</span>
      </div>
    </div>
  );
}
