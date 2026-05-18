import type { ViolationCode } from "@/models/Case";

export const violationOptions: { code: ViolationCode; label: string }[] = [
  { code: "SP-01", label: "Speeding" },
  { code: "RL-02", label: "Red light" },
  { code: "PK-03", label: "Illegal parking" },
  { code: "NB-04", label: "No seatbelt" },
  { code: "DU-05", label: "Driving under influence" },
  { code: "PH-06", label: "Phone while driving" },
  { code: "OT-99", label: "Other" },
];

export function formatViolation(code: string) {
  const violation = violationOptions.find((item) => item.code === code);
  return violation ? `${violation.code} - ${violation.label}` : code;
}

export function badgeTone(code: string) {
  if (code === "PK-03") return "border-zinc-600 bg-zinc-800 text-zinc-200";
  if (code === "RL-02") return "bg-amber-900/70 text-amber-200";
  return "bg-red-900/70 text-red-200";
}
