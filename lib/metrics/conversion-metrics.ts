import { getAdminClient } from "@/lib/supabase/admin-server";

export const CONVERSION_METRIC_KEYS = [
  "report_view",
  "geo_checker_run",
  "project_submission",
  "project_claim",
] as const;

export type ConversionMetricKey = (typeof CONVERSION_METRIC_KEYS)[number];

export interface ConversionMetricInput {
  metric_key: ConversionMetricKey;
  surface: string;
  count_delta?: number;
}

export interface ConversionMetricRow {
  metric_key: ConversionMetricKey;
  surface: string;
  bucket_date: string;
  count_total: number;
}

export interface PivotGateDefinition {
  day: 30 | 60 | 100;
  name: string;
  requiredSignals: string[];
  decisionRule: string;
}

export interface ConversionMetricSummary {
  configured: boolean;
  rows: ConversionMetricRow[];
  pivotGates: PivotGateDefinition[];
}

export const PIVOT_GATES: PivotGateDefinition[] = [
  {
    day: 30,
    name: "Signal capture check",
    requiredSignals: [
      "report_view",
      "geo_checker_run",
      "project_submission",
      "project_claim",
    ],
    decisionRule:
      "Confirm that aggregate event capture works before adding new conversion surfaces.",
  },
  {
    day: 60,
    name: "Founder action check",
    requiredSignals: ["project_submission", "project_claim"],
    decisionRule:
      "Compare aggregate founder actions against content and tool usage before expanding review capacity.",
  },
  {
    day: 100,
    name: "Pivot gate review",
    requiredSignals: [
      "report_view",
      "geo_checker_run",
      "project_submission",
      "project_claim",
    ],
    decisionRule:
      "Use aggregate trend evidence to decide whether to continue, narrow, or redesign the founder acquisition loop.",
  },
];

const SURFACE_PATTERN = /^\/[a-z0-9][a-z0-9/_-]{0,127}$/;

export function isConversionMetricKey(
  value: unknown
): value is ConversionMetricKey {
  return (
    typeof value === "string" &&
    CONVERSION_METRIC_KEYS.includes(value as ConversionMetricKey)
  );
}

export function normalizeMetricSurface(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const surface = value.trim().toLowerCase();
  if (!SURFACE_PATTERN.test(surface)) return null;
  if (surface.includes("//")) return null;
  return surface;
}

export function normalizeCountDelta(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value)) return 1;
  if (value < 1) return 1;
  if (value > 100) return 100;
  return value;
}

export async function getConversionMetricSummary(): Promise<ConversionMetricSummary> {
  const client = getAdminClient();
  if (!client) {
    return { configured: false, rows: [], pivotGates: PIVOT_GATES };
  }

  const { data, error } = await client
    .from("conversion_metric_daily_counts")
    .select("metric_key,surface,bucket_date,count_total")
    .order("bucket_date", { ascending: false })
    .limit(50);

  if (error || !data) {
    return { configured: true, rows: [], pivotGates: PIVOT_GATES };
  }

  const rows = data
    .filter((row) => isConversionMetricKey(row.metric_key))
    .map((row) => ({
      metric_key: row.metric_key as ConversionMetricKey,
      surface: String(row.surface),
      bucket_date: String(row.bucket_date),
      count_total: Number(row.count_total ?? 0),
    }));

  return { configured: true, rows, pivotGates: PIVOT_GATES };
}

export async function recordConversionMetric(
  input: ConversionMetricInput
): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "write_failed" }> {
  const client = getAdminClient();
  if (!client) return { ok: false, reason: "not_configured" };

  const surface = normalizeMetricSurface(input.surface);
  if (!surface) return { ok: false, reason: "write_failed" };

  const countDelta = normalizeCountDelta(input.count_delta);
  const bucketDate = new Date().toISOString().slice(0, 10);

  const { data: existing } = await client
    .from("conversion_metric_daily_counts")
    .select("id,count_total")
    .eq("metric_key", input.metric_key)
    .eq("surface", surface)
    .eq("bucket_date", bucketDate)
    .maybeSingle();

  if (existing?.id) {
    const nextCount = Number(existing.count_total ?? 0) + countDelta;
    const { error } = await client
      .from("conversion_metric_daily_counts")
      .update({ count_total: nextCount })
      .eq("id", existing.id);
    return error ? { ok: false, reason: "write_failed" } : { ok: true };
  }

  const { error } = await client.from("conversion_metric_daily_counts").insert({
    metric_key: input.metric_key,
    surface,
    bucket_date: bucketDate,
    count_total: countDelta,
  });

  return error ? { ok: false, reason: "write_failed" } : { ok: true };
}
