export type CheckStatus = "pass" | "partial" | "missing" | "warning";

export interface ReadinessCheck {
  id: string;
  label: string;
  status: CheckStatus;
  score: number;
  summary: string;
  detail?: string;
}

export interface GeoCheckerResult {
  normalized_url: string;
  readiness_score: number;
  grade: string;
  checks: ReadinessCheck[];
  missing_items: string[];
  recommendations: string[];
}

export interface GeoCheckerRequest {
  url: string;
}

export interface FetchResult {
  normalized_url: string;
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface RobotsSitemapResult {
  robots_txt_accessible: boolean;
  robots_txt_status?: number;
  sitemap_xml_accessible: boolean;
  sitemap_xml_status?: number;
}

export interface HtmlAnalysis {
  has_title: boolean;
  title_text?: string;
  has_meta_description: boolean;
  meta_description?: string;
  has_canonical: boolean;
  canonical_href?: string;
  has_h1: boolean;
  h1_text?: string;
  first_text_length: number;
  visible_text_length: number;
  jsonld_count: number;
  jsonld_parse_ok: number;
  schema_types: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: string;
  public_source_links: string[];
  same_as_links: string[];
  client_only_shell_risk: boolean;
}
