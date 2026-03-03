export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 45) return "text-orange-500";
  return "text-red-600";
}

export function getScoreBgColor(score: number): string {
  if (score >= 75) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 45) return "bg-orange-500";
  return "bg-red-500";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Tour Level";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 45) return "Needs Work";
  return "Fundamental Issues";
}

export function getSeverityColor(severity: "minor" | "moderate" | "major"): string {
  switch (severity) {
    case "minor": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "moderate": return "text-orange-600 bg-orange-50 border-orange-200";
    case "major": return "text-red-600 bg-red-50 border-red-200";
  }
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
