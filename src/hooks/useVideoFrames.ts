"use client";

import { useState, useCallback, useRef } from "react";
import { SwingPhase } from "@/types/analysis";
import { ExtractedFrame, VideoPerspective } from "@/types/video";
import { extractFrameAtTime } from "@/lib/frame-extraction";

export function useVideoFrames() {
  const [frames, setFrames] = useState<Map<SwingPhase, ExtractedFrame>>(new Map());
  const [isExtracting, setIsExtracting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const setVideoElement = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
  }, []);

  const captureFrame = useCallback(
    async (phase: SwingPhase, timestamp: number, perspective: VideoPerspective) => {
      const video = videoRef.current;
      if (!video) throw new Error("Video element not available");

      setIsExtracting(true);
      try {
        const { imageBase64, thumbnailBase64 } = await extractFrameAtTime(video, timestamp);
        const frame: ExtractedFrame = {
          phase,
          timestamp,
          imageBase64,
          thumbnailBase64,
          perspective,
        };
        setFrames((prev) => {
          const next = new Map(prev);
          next.set(phase, frame);
          return next;
        });
        return frame;
      } finally {
        setIsExtracting(false);
      }
    },
    []
  );

  const removeFrame = useCallback((phase: SwingPhase) => {
    setFrames((prev) => {
      const next = new Map(prev);
      next.delete(phase);
      return next;
    });
  }, []);

  const clearFrames = useCallback(() => {
    setFrames(new Map());
  }, []);

  const getFramesArray = useCallback((): ExtractedFrame[] => {
    return Array.from(frames.values());
  }, [frames]);

  const hasMinimumFrames = frames.has("address") && frames.has("top") && frames.has("impact");

  return {
    frames,
    isExtracting,
    captureFrame,
    removeFrame,
    clearFrames,
    getFramesArray,
    setVideoElement,
    hasMinimumFrames,
    frameCount: frames.size,
  };
}
