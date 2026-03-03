import { NextRequest, NextResponse } from "next/server";
import { analyzeSwing } from "@/lib/claude";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { frames, playerInfo, launchMonitorData } = body;

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json(
        { error: "At least one frame is required" },
        { status: 400 }
      );
    }

    const phases = frames.map((f: { phase: string }) => f.phase);
    const requiredPhases = ["address", "top", "impact"];
    const missing = requiredPhases.filter((p) => !phases.includes(p));
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required frames: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    for (const frame of frames) {
      if (!frame.imageBase64 || typeof frame.imageBase64 !== "string") {
        return NextResponse.json(
          { error: `Invalid image data for frame: ${frame.phase}` },
          { status: 400 }
        );
      }
    }

    const totalSize = frames.reduce(
      (acc: number, f: { imageBase64: string }) => acc + f.imageBase64.length,
      0
    );
    if (totalSize > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Total payload too large (max 20MB)" },
        { status: 413 }
      );
    }

    const result = await analyzeSwing(frames, playerInfo, launchMonitorData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
