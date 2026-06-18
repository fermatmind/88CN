export const AD_PAYMENTS_FLAG = "AD_PAYMENTS_ENABLED";
export const STRIPE_CHECKOUT_FLAG = "STRIPE_CHECKOUT_ENABLED";
export const FEATURED_SIGNAL_CHECKOUT_FLAG =
  "FEATURED_SIGNAL_CHECKOUT_ENABLED";

function isEnabled(name: string): boolean {
  return process.env[name] === "true";
}

export function isAdPaymentsEnabled(): boolean {
  return isEnabled(AD_PAYMENTS_FLAG);
}

export function isStripeCheckoutEnabled(): boolean {
  return isEnabled(STRIPE_CHECKOUT_FLAG);
}

export function isFeaturedSignalCheckoutEnabled(): boolean {
  return isEnabled(FEATURED_SIGNAL_CHECKOUT_FLAG);
}

export function isFeaturedSignalCommercialFlowEnabled(): boolean {
  return (
    isAdPaymentsEnabled() &&
    isStripeCheckoutEnabled() &&
    isFeaturedSignalCheckoutEnabled()
  );
}
