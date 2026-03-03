import Anthropic from "@anthropic-ai/sdk";
import { GOLF_ANALYSIS_SYSTEM_PROMPT, buildUserPrompt } from "./prompts";
import { ANALYSIS_JSON_SCHEMA } from "./schema";
import { LaunchMonitorData } from "@/types/launch-monitor";
import { SwingPhase } from "@/types/analysis";
import { VideoPerspective } from "@/types/video";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface FrameInput {
  phase: SwingPhase;
  imageBase64: string;
  perspective: VideoPerspective;
}

const PHASE_LABELS: Record<SwingPhase, string> = {
  address: "Address / Setup",
  takeaway: "Takeaway",
  top: "Top of Backswing",
  transition: "Transition",
  "mid-downswing": "Mid-Downswing",
  impact: "Impact",
  "follow-through": "Follow-Through",
  finish: "Finish",
};

export async function analyzeSwing(
  frames: FrameInput[],
  playerInfo?: { handicap?: number; club?: string },
  launchMonitorData?: LaunchMonitorData
) {
  const content: Anthropic.Messages.ContentBlockParam[] = [];

  for (const frame of frames) {
    content.push({
      type: "text",
      text: `[${PHASE_LABELS[frame.phase]}] (${frame.perspective} view):`,
    });
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/jpeg",
        data: frame.imageBase64,
      },
    });
  }

  content.push({
    type: "text",
    text: buildUserPrompt(playerInfo, launchMonitorData),
  });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 8192,
    system: GOLF_ANALYSIS_SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  // Extract JSON from the response (may be wrapped in markdown code blocks)
  let jsonText = textBlock.text;
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }

  try {
    return JSON.parse(jsonText.trim());
  } catch {
    throw new Error("Failed to parse analysis response as JSON");
  }
}
