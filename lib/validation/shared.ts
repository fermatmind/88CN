export const FORBIDDEN_PAYLOAD_FIELDS = new Set([
  "stripe_session_id",
  "stripe_customer_id",
  "stripe_price_id",
  "stripe_checkout_session_id",
  "checkout_session_id",
  "payment_link",
  "payment_status",
  "is_premium_tier",
  "premium",
  "paid_plan",
  "plan",
  "price_id",
  "accelerator",
  "priority_payment",
  "feature_flag_override",
]);

export function checkForbiddenFields(
  body: unknown,
  endpoint: string
): string | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const keys = Object.keys(body as Record<string, unknown>);
  const found: string[] = [];

  for (const key of keys) {
    if (FORBIDDEN_PAYLOAD_FIELDS.has(key)) {
      found.push(key);
    }
  }

  if (found.length > 0) {
    return `Request contains disallowed fields for ${endpoint}: ${found.join(", ")}. 88CN does not accept monetization, payment, or commercial-tier fields.`;
  }

  return null;
}
