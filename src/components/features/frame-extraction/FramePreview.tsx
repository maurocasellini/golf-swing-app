"use client";

import { SwingPhase, SWING_PHASES } from "@/types/analysis";
import { ExtractedFrame } from "@/types/video";
import { cn } from "@/lib/utils";

interface FramePreviewProps {
  frames: Map<SwingPhase, ExtractedFrame>;
  activePhase: SwingPhase;
  onPhaseClick: (phase: SwingPhase) => void;
}

export default function FramePreview({ frames, activePhase, onPhaseClick }: FramePreviewProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {SWING_PHASES.map(({ key, label }) => {
        const frame = frames.get(key);
        const isActive = activePhase === key;

        return (
          <button
            key={key}
            onClick={() => onPhaseClick(key)}
            className={cn(
              "relative aspect-video rounded-lg border-2 overflow-hidden transition-all",
              isActive
                ? "border-golf-600 ring-2 ring-golf-200"
                : frame
                ? "border-golf-300"
                : "border-gray-200 bg-gray-50"
            )}
          >
            {frame ? (
              <img
                src={`data:image/jpeg;base64,${frame.thumbnailBase64}`}
                alt={label}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className={cn(
              "absolute bottom-0 inset-x-0 px-1 py-0.5 text-center text-[10px] font-medium",
              frame ? "bg-black/50 text-white" : "bg-gray-100 text-gray-500"
            )}>
              {label}
            </div>
            {frame && (
              <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-golf-600 flex items-center justify-center">
                <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
