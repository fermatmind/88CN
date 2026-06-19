export interface ApiKeyShellFlags {
  API_KEYS_ENABLED: boolean;
  API_KEY_ISSUANCE_ENABLED: boolean;
  CUSTOMER_ACCESS_ENABLED: boolean;
  METERING_ENABLED: boolean;
  BILLING_ENABLED: boolean;
}

function enabledOnlyByExplicitTrue(value: string | undefined): boolean {
  return value === "true";
}

export function getApiKeyShellFlags(env: NodeJS.ProcessEnv = process.env): ApiKeyShellFlags {
  return {
    API_KEYS_ENABLED: enabledOnlyByExplicitTrue(env.API_KEYS_ENABLED),
    API_KEY_ISSUANCE_ENABLED: enabledOnlyByExplicitTrue(env.API_KEY_ISSUANCE_ENABLED),
    CUSTOMER_ACCESS_ENABLED: enabledOnlyByExplicitTrue(env.CUSTOMER_ACCESS_ENABLED),
    METERING_ENABLED: enabledOnlyByExplicitTrue(env.METERING_ENABLED),
    BILLING_ENABLED: enabledOnlyByExplicitTrue(env.BILLING_ENABLED),
  };
}

export function isApiKeyShellDisabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const flags = getApiKeyShellFlags(env);
  return (
    !flags.API_KEYS_ENABLED ||
    !flags.API_KEY_ISSUANCE_ENABLED ||
    !flags.CUSTOMER_ACCESS_ENABLED ||
    !flags.METERING_ENABLED ||
    !flags.BILLING_ENABLED
  );
}
