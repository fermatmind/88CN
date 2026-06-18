export interface IndexDataProject {
  schema_version: string;
  name: string;
  slug: string;
  website_url: string;
  category_slug: string;
  one_liner: string;
  description?: string;
  github_url?: string;
  docs_url?: string;
  pricing_url?: string;
  product_hunt_url?: string;
  hacker_news_url?: string;
  founder_public_url?: string;
  launch_url?: string;
  tags?: string[];
  tech_stack?: string[];
  source_type: string;
  region: string;
  language: string;
}

export interface IndexDataSyncResult {
  source: string;
  commit: string | null;
  total_seen: number;
  valid_count: number;
  invalid_count: number;
  inserted_count: number;
  skipped_count: number;
  failed_count: number;
  errors: string[];
  dry_run: boolean;
  quarantine_summary: import("./import-summary").ImportQuarantineSummary;
}
