import { SwingPhase } from "./analysis";

export type VideoPerspective = "face-on" | "down-the-line";

export interface ExtractedFrame {
  phase: SwingPhase;
  timestamp: number;
  imageBase64: string;
  thumbnailBase64: string;
  perspective: VideoPerspective;
}
