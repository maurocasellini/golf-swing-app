"use client";

import { useState, useRef, useCallback } from "react";
import { SwingPhase, SWING_PHASES, SwingAnalysis } from "@/types/analysis";
import { VideoPerspective } from "@/types/video";
import { LaunchMonitorData } from "@/types/launch-monitor";
import { useVideoFrames } from "@/hooks/useVideoFrames";
import { useAnalysis } from "@/hooks/useAnalysis";
import { cn } from "@/lib/utils";
import VideoUploader from "@/components/features/upload/VideoUploader";
import PerspectiveSelector from "@/components/features/upload/PerspectiveSelector";
import FrameTimeline from "@/components/features/frame-extraction/FrameTimeline";
import FramePreview from "@/components/features/frame-extraction/FramePreview";
import LaunchMonitorInput from "@/components/features/launch-monitor/LaunchMonitorInput";
import OverallScore from "@/components/features/analysis/OverallScore";
import PhaseScoreCard from "@/components/features/analysis/PhaseScoreCard";
import CauseEffectChainComponent from "@/components/features/analysis/CauseEffectChain";
import DrillCard from "@/components/features/analysis/DrillCard";

type Step = "upload" | "frames" | "review" | "results";

const STEP_ORDER: Step[] = ["upload", "frames", "review", "results"];
const STEP_LABELS: Record<Step, string> = {
  upload: "Upload",
  frames: "Mark Frames",
  review: "Review",
  results: "Results",
};

export default function AnalyzePage() {
  const [step, setStep] = useState<Step>("upload");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [perspective, setPerspective] = useState<VideoPerspective>("face-on");
  const [activePhase, setActivePhase] = useState<SwingPhase>("address");
  const [handicap, setHandicap] = useState<string>("");
  const [club, setClub] = useState<string>("Driver");
  const [launchData, setLaunchData] = useState<LaunchMonitorData>({});
  const [timestamps, setTimestamps] = useState<Partial<Record<SwingPhase, number>>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const { frames, captureFrame, clearFrames, setVideoElement, hasMinimumFrames, frameCount } = useVideoFrames();
  const analysis = useAnalysis();

  const handleVideoSelected = useCallback((_file: File, objectUrl: string) => {
    setVideoUrl(objectUrl);
  }, []);

  const handleVideoLoaded = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setVideoDuration(video.duration);
      setVideoElement(video);
    }
  }, [setVideoElement]);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const handleCaptureFrame = useCallback(async () => {
    try {
      await captureFrame(activePhase, currentTime, perspective);
      setTimestamps((prev) => ({ ...prev, [activePhase]: currentTime }));

      // Auto-advance to next uncaptured phase
      const currentIndex = SWING_PHASES.findIndex((p) => p.key === activePhase);
      for (let i = 1; i < SWING_PHASES.length; i++) {
        const nextIndex = (currentIndex + i) % SWING_PHASES.length;
        const nextPhase = SWING_PHASES[nextIndex].key;
        if (!frames.has(nextPhase)) {
          setActivePhase(nextPhase);
          break;
        }
      }
    } catch (err) {
      console.error("Failed to capture frame:", err);
    }
  }, [activePhase, currentTime, perspective, captureFrame, frames]);

  const handleAnalyze = useCallback(async () => {
    setStep("results");
    const playerInfo = {
      handicap: handicap ? parseInt(handicap) : undefined,
      club: club || undefined,
    };
    const framesArray = Array.from(frames.values());
    await analysis.analyze(framesArray, playerInfo, launchData);
  }, [frames, handicap, club, launchData, analysis]);

  const handleNewAnalysis = useCallback(() => {
    setStep("upload");
    setVideoUrl(null);
    setVideoDuration(0);
    setCurrentTime(0);
    setTimestamps({});
    clearFrames();
    analysis.reset();
  }, [clearFrames, analysis]);

  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Stepper */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEP_ORDER.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
              i === stepIndex
                ? "bg-golf-700 text-white"
                : i < stepIndex
                ? "bg-golf-100 text-golf-700"
                : "bg-gray-100 text-gray-400"
            )}>
              <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
            {i < STEP_ORDER.length - 1 && (
              <div className={cn("h-0.5 w-6", i < stepIndex ? "bg-golf-300" : "bg-gray-200")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Upload Your Swing Video</h1>
            <p className="text-gray-500 mt-1">Record face-on or down-the-line for best results</p>
          </div>

          <VideoUploader onVideoSelected={handleVideoSelected} />

          {videoUrl && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Camera Perspective</label>
                <PerspectiveSelector value={perspective} onChange={setPerspective} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Handicap (optional)</label>
                  <input
                    type="number"
                    value={handicap}
                    onChange={(e) => setHandicap(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-golf-500 focus:outline-none focus:ring-1 focus:ring-golf-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club</label>
                  <select
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-golf-500 focus:outline-none focus:ring-1 focus:ring-golf-500"
                  >
                    {["Driver", "3-Wood", "5-Wood", "Hybrid", "3-Iron", "4-Iron", "5-Iron", "6-Iron", "7-Iron", "8-Iron", "9-Iron", "PW", "GW", "SW", "LW"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep("frames")}
                  className="rounded-lg bg-golf-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-golf-800 transition-colors"
                >
                  Next: Mark Frames
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 2: Mark Frames */}
      {step === "frames" && videoUrl && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Mark Key Positions</h1>
            <p className="text-gray-500 mt-1">
              Scrub to each swing phase and capture the frame.
              <span className="text-golf-700 font-medium"> Minimum: Address, Top, Impact</span>
            </p>
          </div>

          {/* Video player */}
          <div className="relative rounded-xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleVideoLoaded}
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
              }}
              className="w-full max-h-[400px] object-contain"
              playsInline
              muted
            />
          </div>

          {/* Active phase info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current phase:</p>
              <p className="text-lg font-semibold text-golf-800">
                {SWING_PHASES.find((p) => p.key === activePhase)?.label}
              </p>
              <p className="text-xs text-gray-400">
                {SWING_PHASES.find((p) => p.key === activePhase)?.description}
              </p>
            </div>
            <button
              onClick={handleCaptureFrame}
              className="flex items-center gap-2 rounded-lg bg-golf-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-golf-800 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Capture Frame
            </button>
          </div>

          {/* Timeline */}
          <FrameTimeline
            duration={videoDuration}
            currentTime={currentTime}
            activePhase={activePhase}
            capturedPhases={new Set(frames.keys())}
            timestamps={timestamps}
            onSeek={handleSeek}
            onPhaseSelect={setActivePhase}
          />

          {/* Frame previews */}
          <FramePreview
            frames={frames}
            activePhase={activePhase}
            onPhaseClick={(phase) => {
              setActivePhase(phase);
              const t = timestamps[phase];
              if (t !== undefined) handleSeek(t);
            }}
          />

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep("upload")}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep("review")}
              disabled={!hasMinimumFrames}
              className={cn(
                "rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors",
                hasMinimumFrames
                  ? "bg-golf-700 text-white hover:bg-golf-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              Next: Review ({frameCount}/8 frames)
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === "review" && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Review Your Submission</h1>
            <p className="text-gray-500 mt-1">Confirm your frames and add optional launch monitor data</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-sm">
                <span className="text-gray-500">Perspective: </span>
                <span className="font-medium text-gray-900 capitalize">{perspective}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Frames: </span>
                <span className="font-medium text-gray-900">{frameCount} of 8</span>
              </div>
              {club && (
                <div className="text-sm">
                  <span className="text-gray-500">Club: </span>
                  <span className="font-medium text-gray-900">{club}</span>
                </div>
              )}
              {handicap && (
                <div className="text-sm">
                  <span className="text-gray-500">Handicap: </span>
                  <span className="font-medium text-gray-900">{handicap}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {SWING_PHASES.map(({ key, label }) => {
                const frame = frames.get(key);
                return (
                  <div key={key} className="text-center">
                    <div className={cn(
                      "aspect-video rounded-md overflow-hidden mb-1",
                      frame ? "border border-golf-300" : "border border-gray-200 bg-gray-50"
                    )}>
                      {frame ? (
                        <img
                          src={`data:image/jpeg;base64,${frame.thumbnailBase64}`}
                          alt={label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-300 text-xs">—</div>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-500 truncate">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <LaunchMonitorInput value={launchData} onChange={setLaunchData} />

          <div className="flex justify-between">
            <button
              onClick={() => setStep("frames")}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleAnalyze}
              className="rounded-lg bg-golf-700 px-8 py-2.5 text-sm font-semibold text-white hover:bg-golf-800 transition-colors"
            >
              Analyze My Swing
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === "results" && (
        <div className="space-y-6 animate-fade-in">
          {analysis.status === "analyzing" && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-golf-100 mb-4">
                <svg className="animate-spin h-8 w-8 text-golf-700" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Analyzing Your Swing</h2>
              <p className="text-gray-500">This usually takes 15-30 seconds...</p>
            </div>
          )}

          {analysis.status === "error" && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Analysis Failed</h2>
              <p className="text-gray-500 mb-4">{analysis.error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStep("review")}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Go Back
                </button>
                <button
                  onClick={handleAnalyze}
                  className="rounded-lg bg-golf-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-golf-800"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {analysis.status === "complete" && analysis.result && (
            <ResultsView analysis={analysis.result} onNewAnalysis={handleNewAnalysis} />
          )}
        </div>
      )}
    </div>
  );
}

function ResultsView({ analysis, onNewAnalysis }: { analysis: SwingAnalysis; onNewAnalysis: () => void }) {
  return (
    <div className="space-y-6">
      <OverallScore score={analysis.overallScore} summary={analysis.summary} />

      {/* Phase scores */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Phase-by-Phase Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analysis.phases.map((phase) => (
            <PhaseScoreCard
              key={phase.phase}
              phase={phase}
              thumbnail={analysis.frameThumbnails?.[phase.phase]}
            />
          ))}
        </div>
      </div>

      {/* Cause-effect chains */}
      {analysis.causeEffectChains.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Cause-Effect Analysis</h3>
          <div className="space-y-3">
            {analysis.causeEffectChains.map((chain, i) => (
              <CauseEffectChainComponent key={i} chain={chain} />
            ))}
          </div>
        </div>
      )}

      {/* Improvement drills */}
      {analysis.improvements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Improvement Priorities</h3>
          <div className="space-y-3">
            {analysis.improvements
              .sort((a, b) => a.priority - b.priority)
              .map((drill, i) => (
                <DrillCard key={i} drill={drill} />
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3 pt-4">
        <button
          onClick={onNewAnalysis}
          className="rounded-lg bg-golf-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-golf-800 transition-colors"
        >
          New Analysis
        </button>
        <a
          href="/history"
          className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View History
        </a>
      </div>
    </div>
  );
}
