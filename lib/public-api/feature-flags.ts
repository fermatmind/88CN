export function isPublicApiEnabled(
  value: string | undefined = process.env.PUBLIC_API_ENABLED
): boolean {
  return value === "true";
}
