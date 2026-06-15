import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SECURITY_HEADERS } from "@/lib/security/headers";
import { generateRequestId, REQUEST_ID_HEADER } from "@/lib/api/request-id";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

const NEXT_INTERNAL_PARAMS = new Set([
  "_rsc",
]);

export async function middleware(request: NextRequest) {
  const requestId =
    request.headers.get("x-request-id") ??
    request.headers.get("x-amzn-trace-id") ??
    request.headers.get("cf-ray") ??
    generateRequestId();

  let response = NextResponse.next();

  response.headers.set(REQUEST_ID_HEADER, requestId);

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    response.headers.set("cache-control", "no-store, max-age=0");
  } else if (!pathname.startsWith("/_next") && searchParams.size > 0) {
    // Query noindex for public HTML pages with non-internal params
    let hasExternalParams = false;
    for (const key of searchParams.keys()) {
      if (
        !NEXT_INTERNAL_PARAMS.has(key) &&
        !key.startsWith("__next")
      ) {
        hasExternalParams = true;
        break;
      }
    }
    if (hasExternalParams) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    }
  }

  // Supabase auth session refresh for /admin routes
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    supabaseUrl &&
    supabaseAnonKey &&
    pathname.startsWith("/admin")
  ) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    });

    await supabase.auth.getSession();
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
