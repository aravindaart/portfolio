export type Mode = "story" | "recruiter";

const isMode = (value: string | null): value is Mode =>
  value === "story" || value === "recruiter";

/** URL param wins over stored preference; anything invalid falls back. */
export function resolveInitialMode(
  param: string | null,
  stored: string | null,
): Mode {
  if (isMode(param)) return param;
  if (isMode(stored)) return stored;
  return "story";
}
