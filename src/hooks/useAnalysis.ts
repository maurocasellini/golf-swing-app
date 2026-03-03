"use client";

import { useState } from "react";
import { SwingAnalysis } from "@/types/analysis";
import { ExtractedFrame } from "@/types/video";
import { LaunchMonitorData } from "@/types/launch-monitor";
import { generateId } from "@/lib/utils";
import { saveAnalysis } from "@/lib/storage";

interface AnalysisState {
  status: "idle" | "analyzing" | "complete" | "error";
  result: SwingAnalysis | null;
  error: string | null;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    status: "idle",
    result: null,
    error: null,
  });

  async function analyze(
    frames: ExtractedFrame[],
    playerInfo?: { handicap?: number; club?: string },
    launchMonitorData?: LaunchMonitorData
  ) {
    setState({ status: "analyzing", result: null, error: null });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frames: frames.map((f) => ({
            phase: f.phase,
            imageBase64: f.imageBase64,
            perspective: f.perspective,
          })),
          playerInfo,
          launchMonitorData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed (${response.status})`);
      }

      const analysisResult = await response.json();

      const fullAnalysis: SwingAnalysis = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...analysisResult,
        playerInfo,
        perspective: frames[0]?.perspective || "face-on",
        frameThumbnails: Object.fromEntries(
          frames.map((f) => [f.phase, f.thumbnailBase64])
        ),
      };

      saveAnalysis(fullAnalysis);
      setState({ status: "complete", result: fullAnalysis, error: null });
      return fullAnalysis;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setState({ status: "error", result: null, error: message });
      return null;
    }
  }

  function reset() {
    setState({ status: "idle", result: null, error: null });
  }

  return { ...state, analyze, reset };
}
