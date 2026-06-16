export function normalizeInputUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Auto-prepend https:// if missing
  let urlStr = trimmed;
  if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://")) {
    urlStr = "https://" + urlStr;
  }

  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString().replace(/\/$/, "") || parsed.origin;
  } catch {
    return null;
  }
}
