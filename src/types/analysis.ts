export type SwingPhase =
  | "address"
  | "takeaway"
  | "top"
  | "transition"
  | "mid-downswing"
  | "impact"
  | "follow-through"
  | "finish";

export const SWING_PHASES: { key: SwingPhase; label: string; description: string }[] = [
  { key: "address", label: "Address", description: "Setup position before the swing" },
  { key: "takeaway", label: "Takeaway", description: "Club leaves the ball to hip height" },
  { key: "top", label: "Top", description: "Top of the backswing" },
  { key: "transition", label: "Transition", description: "Start of the downswing" },
  { key: "mid-downswing", label: "Mid-Downswing", description: "Hands at hip height, downswing" },
  { key: "impact", label: "Impact", description: "Moment of ball contact" },
  { key: "follow-through", label: "Follow-Through", description: "Post-impact to arms parallel" },
  { key: "finish", label: "Finish", description: "Final position of the swing" },
];

export interface Fault {
  description: string;
  severity: "minor" | "moderate" | "major";
  rootCause: string;
  downstreamEffect: string;
}

export interface PhaseAnalysis {
  phase: SwingPhase;
  score: number;
  observations: string[];
  faults: Fault[];
}

export interface CauseEffectNode {
  phase: SwingPhase;
  observation: string;
  type: "fault" | "cause" | "effect";
}

export interface CauseEffectChain {
  title: string;
  nodes: CauseEffectNode[];
  correction: string;
}

export interface Drill {
  name: string;
  priority: 1 | 2 | 3;
  targetFault: string;
  description: string;
  equipmentNeeded: string;
  repetitions: string;
  feelCue: string;
}

export interface SwingAnalysis {
  id: string;
  createdAt: string;
  overallScore: number;
  summary: string;
  phases: PhaseAnalysis[];
  causeEffectChains: CauseEffectChain[];
  improvements: Drill[];
  playerInfo?: {
    handicap?: number;
    club?: string;
  };
  perspective: "face-on" | "down-the-line";
  frameThumbnails?: Partial<Record<SwingPhase, string>>;
}
