export type FeaturedSignalCommercialState =
  | "commercial_disabled"
  | "checkout_disabled"
  | "checkout_requested"
  | "payment_pending"
  | "paid_pending_admin_review"
  | "admin_approved_for_display"
  | "admin_rejected"
  | "refunded"
  | "cancelled";

export interface FeaturedSignalCommercialBoundary {
  state: FeaturedSignalCommercialState;
  canDisplay: boolean;
  requiresAdminReview: boolean;
}

export function stateRequiresAdminReview(
  state: FeaturedSignalCommercialState
): boolean {
  return state === "paid_pending_admin_review";
}

export function canStateDisplayFeaturedSignal(
  state: FeaturedSignalCommercialState
): boolean {
  return state === "admin_approved_for_display";
}

export const PAYMENT_SUCCESS_NEXT_STATE: FeaturedSignalCommercialState =
  "paid_pending_admin_review";
