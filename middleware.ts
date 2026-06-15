import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SECURITY_HEADERS } from "@/lib/security/headers";
import { generateRequestId, REQUEST_ID_HEADER } from "@/lib/api/request-id";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

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

  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("cache-control", "no-store, max-age=0");
  }

  // Supabase auth session refresh for /admin routes
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    supabaseUrl &&
    supabaseAnonKey &&
    request.nextUrl.pathname.startsWith("/admin")
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
