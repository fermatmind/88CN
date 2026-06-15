import { headers as nextHeaders } from "next/headers";

const REQUEST_ID_HEADER = "x-request-id";
const INCOMING_REQUEST_ID_HEADERS = [
  "x-request-id",
  "x-amzn-trace-id",
  "cf-ray",
];

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function getIncomingRequestId(): string | null {
  try {
    const h = nextHeaders();
    for (const name of INCOMING_REQUEST_ID_HEADERS) {
      const value = h.get(name);
      if (value) return value;
    }
  } catch {
    // headers() not available (e.g., during build)
  }
  return null;
}

export function getOrCreateRequestId(): string {
  return getIncomingRequestId() ?? generateRequestId();
}

export { REQUEST_ID_HEADER };
