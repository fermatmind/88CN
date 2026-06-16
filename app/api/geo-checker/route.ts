import { NextRequest } from "next/server";
import { getOrCreateRequestId } from "@/lib/api/request-id";
import { success, errorResponse } from "@/lib/api/response";
import { badRequest, methodNotAllowed } from "@/lib/api/problem";
import { ssrfGuard } from "@/lib/geo-checker/ssrf-guard";
import { fetchUrl } from "@/lib/geo-checker/fetch-url";
import { analyzeHtml, checkRobotsAndSitemap } from "@/lib/geo-checker/analyze-html";
import { computeScore } from "@/lib/geo-checker/score";

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId();
  const instance = "/api/geo-checker";

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse(badRequest("Request body must be valid JSON.", instance, undefined, requestId), requestId);
  }

  const rawUrl = body.url?.trim();
  if (!rawUrl) {
    return errorResponse(badRequest("An HTTPS URL is required.", instance, undefined, requestId), requestId);
  }

  // SSRF guard
  const guard = ssrfGuard(rawUrl);
  if (!guard.ok) {
    return errorResponse(
      { type: `${process.env.APP_URL || "http://localhost:3000"}/docs/api-errors#bad-request`, title: "Bad Request", status: guard.status, detail: guard.error, instance },
      requestId
    );
  }

  // Fetch URL
  const fetchResult = await fetchUrl(guard.normalized_url);
  if (!fetchResult.ok) {
    return errorResponse(
      { type: `${process.env.APP_URL || "http://localhost:3000"}/docs/api-errors#bad-gateway`, title: "Bad Gateway", status: fetchResult.status, detail: fetchResult.error, instance },
      requestId
    );
  }

  // Analyze HTML
  const html = analyzeHtml(fetchResult.result.body, fetchResult.result);

  // Check robots.txt + sitemap.xml
  const robotsSitemap = await checkRobotsAndSitemap(guard.normalized_url);

  // Score
  const geoResult = computeScore(guard.normalized_url, html, robotsSitemap);

  return success(geoResult, requestId);
}

export async function GET() {
  const requestId = getOrCreateRequestId();
  return errorResponse(methodNotAllowed("GET is not supported. Use POST.", "/api/geo-checker", requestId), requestId);
}
