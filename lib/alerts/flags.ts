export const SIGNAL_ALERTS_ENV_FLAG = "SIGNAL_ALERTS_ENABLED";
export const SIGNAL_ALERT_DELIVERY_ENV_FLAG = "SIGNAL_ALERT_DELIVERY_ENABLED";

export function areSignalAlertsEnabled(): boolean {
  return process.env[SIGNAL_ALERTS_ENV_FLAG] === "true";
}

export function isSignalAlertDeliveryEnabled(): false {
  return false;
}

export function getSignalAlertRuntimePolicy() {
  return {
    alertsEnabled: areSignalAlertsEnabled(),
    deliveryEnabled: isSignalAlertDeliveryEnabled(),
    externalProvider: "none",
    storesPrivateFounderData: false,
  } as const;
}
