import { SwingAnalysis, SwingPhase } from "@/types/analysis";

const STORAGE_KEY = "golf-swing-analyses";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAllAnalyses(): SwingAnalysis[] {
  if (!isBrowser()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getAnalysisById(id: string): SwingAnalysis | null {
  const analyses = getAllAnalyses();
  return analyses.find((a) => a.id === id) ?? null;
}

export function saveAnalysis(analysis: SwingAnalysis): void {
  if (!isBrowser()) return;
  const analyses = getAllAnalyses();
  analyses.unshift(analysis);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
}

export function deleteAnalysis(id: string): void {
  if (!isBrowser()) return;
  const analyses = getAllAnalyses().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
}

export function getScoreTrend(): { date: string; score: number }[] {
  return getAllAnalyses()
    .map((a) => ({ date: a.createdAt, score: a.overallScore }))
    .reverse();
}

export function getPhaseAverages(): Partial<Record<SwingPhase, number>> {
  const analyses = getAllAnalyses();
  if (analyses.length === 0) return {};

  const totals: Partial<Record<SwingPhase, { sum: number; count: number }>> = {};

  for (const analysis of analyses) {
    for (const phase of analysis.phases) {
      if (!totals[phase.phase]) {
        totals[phase.phase] = { sum: 0, count: 0 };
      }
      totals[phase.phase]!.sum += phase.score;
      totals[phase.phase]!.count += 1;
    }
  }

  const averages: Partial<Record<SwingPhase, number>> = {};
  for (const [phase, data] of Object.entries(totals)) {
    averages[phase as SwingPhase] = Math.round(data!.sum / data!.count);
  }
  return averages;
}

export function getStorageUsage(): { usedKB: number; limitKB: number; percentage: number } {
  if (!isBrowser()) return { usedKB: 0, limitKB: 5120, percentage: 0 };
  const data = localStorage.getItem(STORAGE_KEY) ?? "";
  const usedKB = Math.round((new Blob([data]).size) / 1024);
  const limitKB = 5120;
  return { usedKB, limitKB, percentage: Math.round((usedKB / limitKB) * 100) };
}
