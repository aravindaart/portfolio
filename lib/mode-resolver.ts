export type Mode = "overview" | "terminal" | "recruiter";

const isMode = (value: string | null): value is Mode =>
  value === "overview" || value === "terminal" || value === "recruiter";

// Pre-redesign visitors may have "story" stored; that view's successor as
// the primary experience is the overview.
const normalize = (value: string | null): string | null =>
  value === "story" ? "overview" : value;

/** URL param wins over stored preference; anything invalid falls back. */
export function resolveInitialMode(
  param: string | null,
  stored: string | null,
): Mode {
  const normalizedParam = normalize(param);
  if (isMode(normalizedParam)) return normalizedParam;
  const normalizedStored = normalize(stored);
  if (isMode(normalizedStored)) return normalizedStored;
  return "overview";
}
