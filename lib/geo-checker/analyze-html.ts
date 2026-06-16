import type { HtmlAnalysis, FetchResult, RobotsSitemapResult } from "./types";
import { fetchUrl } from "./fetch-url";

export function analyzeHtml(html: string, result: FetchResult): HtmlAnalysis {
  const analysis: HtmlAnalysis = {
    has_title: false,
    has_meta_description: false,
    has_canonical: false,
    has_h1: false,
    first_text_length: 0,
    visible_text_length: 0,
    jsonld_count: 0,
    jsonld_parse_ok: 0,
    schema_types: [],
    public_source_links: [],
    same_as_links: [],
    client_only_shell_risk: false,
  };

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    analysis.has_title = true;
    analysis.title_text = titleMatch[1].trim();
  }

  // Meta description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  if (descMatch) {
    analysis.has_meta_description = true;
    analysis.meta_description = descMatch[1].trim();
  }

  // Canonical
  const canonMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
    || html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  if (canonMatch) {
    analysis.has_canonical = true;
    analysis.canonical_href = canonMatch[1].trim();
  }

  // H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    analysis.has_h1 = true;
    analysis.h1_text = h1Match[1].replace(/<[^>]+>/g, "").trim();
  }

  // Text extraction (strip tags)
  const textOnly = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  analysis.visible_text_length = textOnly.length;
  analysis.first_text_length = textOnly.slice(0, 500).length;

  // Client-only shell risk
  if (analysis.visible_text_length < 100) {
    analysis.client_only_shell_risk = true;
  }

  // JSON-LD
  const jsonldRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jsonldMatch;
  while ((jsonldMatch = jsonldRegex.exec(html)) !== null) {
    analysis.jsonld_count++;
    try {
      const parsed = JSON.parse(jsonldMatch[1]);
      analysis.jsonld_parse_ok++;
      const extractTypes = (obj: unknown): void => {
        if (Array.isArray(obj)) { obj.forEach(extractTypes); return; }
        if (typeof obj !== "object" || obj === null) return;
        const r = obj as Record<string, unknown>;
        if (r["@type"] && typeof r["@type"] === "string") {
          analysis.schema_types.push(r["@type"]);
        }
        if (r["sameAs"] && Array.isArray(r["sameAs"])) {
          for (const s of r["sameAs"]) {
            if (typeof s === "string") analysis.same_as_links.push(s);
          }
        }
        for (const v of Object.values(r)) {
          if (typeof v === "object") extractTypes(v);
        }
      };
      extractTypes(parsed);
    } catch {
      // Ignore parse failures
    }
  }

  // Open Graph
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
  if (ogTitleMatch) analysis.og_title = ogTitleMatch[1];

  const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
  if (ogDescMatch) analysis.og_description = ogDescMatch[1];

  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
  if (ogImageMatch) analysis.og_image = ogImageMatch[1];

  // Twitter card
  const twitterMatch = html.match(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i);
  if (twitterMatch) analysis.twitter_card = twitterMatch[1];

  // Public source links
  const linkRegex = /<a[^>]+href=["']([^"']*)["'][^>]*>/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    const href = linkMatch[1].toLowerCase();
    if (href.includes("github.com") ||
        href.includes("docs.") ||
        href.includes("/pricing") ||
        href.includes("producthunt.com") ||
        href.includes("news.ycombinator.com") ||
        href.includes("changelog")) {
      analysis.public_source_links.push(linkMatch[1]);
    }
  }

  return analysis;
}

export async function checkRobotsAndSitemap(originUrl: string): Promise<RobotsSitemapResult> {
  const result: RobotsSitemapResult = {
    robots_txt_accessible: false,
    sitemap_xml_accessible: false,
  };

  // Check robots.txt
  const robotsUrl = new URL("/robots.txt", originUrl).toString();
  try {
    const robotsResult = await fetchUrl(robotsUrl);
    if (robotsResult.ok && robotsResult.result.status === 200) {
      result.robots_txt_accessible = true;
      result.robots_txt_status = 200;
    } else {
      result.robots_txt_status = robotsResult.ok ? robotsResult.result.status : undefined;
    }
  } catch {
    // Non-blocking
  }

  // Check sitemap.xml
  const sitemapUrl = new URL("/sitemap.xml", originUrl).toString();
  try {
    const sitemapResult = await fetchUrl(sitemapUrl);
    if (sitemapResult.ok && sitemapResult.result.status === 200) {
      result.sitemap_xml_accessible = true;
      result.sitemap_xml_status = 200;
    } else {
      result.sitemap_xml_status = sitemapResult.ok ? sitemapResult.result.status : undefined;
    }
  } catch {
    // Non-blocking
  }

  return result;
}
