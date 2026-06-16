export const FORBIDDEN_INDEX_FIELDS = new Set([
  "founder_email", "email", "phone", "wechat", "telegram",
  "discord_private", "revenue", "mrr", "arr", "gmv",
  "stripe_customer_id", "stripe_session_id",
  "api_key", "access_token", "secret", "password",
  "analytics_screenshot", "bank", "investor", "backer",
  "investment", "equity", "token", "wallet",
  "private_dashboard", "private_customer_list", "customer_emails",
  "ip_address", "cookie", "session",
]);

export function checkForbiddenFields(
  obj: unknown,
  filePath: string
): string | null {
  if (typeof obj !== "object" || obj === null) return null;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const err = checkForbiddenFields(item, filePath);
      if (err) return err;
    }
    return null;
  }

  const record = obj as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_INDEX_FIELDS.has(key)) {
      return `${filePath}: forbidden field "${key}"`;
    }
    const val = record[key];
    if (typeof val === "object" && val !== null) {
      const err = checkForbiddenFields(val, filePath);
      if (err) return err;
    }
  }

  return null;
}
