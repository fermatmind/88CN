export const FEATURED_SIGNALS_ENV_FLAG = "FEATURED_SIGNALS_ENABLED";

export function isFeaturedSignalsEnabled(): boolean {
  return process.env[FEATURED_SIGNALS_ENV_FLAG] === "true";
}
