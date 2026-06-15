import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SECURITY_HEADERS } from "@/lib/security/headers";
import { generateRequestId, REQUEST_ID_HEADER } from "@/lib/api/request-id";

export function middleware(request: NextRequest) {
  const requestId =
    request.headers.get("x-request-id") ??
    request.headers.get("x-amzn-trace-id") ??
    request.headers.get("cf-ray") ??
    generateRequestId();

  const response = NextResponse.next();

  response.headers.set(REQUEST_ID_HEADER, requestId);

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("cache-control", "no-store, max-age=0");
  }

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|sitemap\\\\.xml|robots\\\\.txt).*)",
    },
  ],
};
