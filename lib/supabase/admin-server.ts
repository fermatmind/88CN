import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

let adminCache: SupabaseClient | null = null;
let adminCacheKey = "";

export function getAdminClient(): SupabaseClient | null {
  const env = getSupabaseEnv();
  if (!env.isConfigured || !env.serviceRoleKey) return null;

  const key = `${env.url}:${env.serviceRoleKey.slice(0, 8)}`;
  if (adminCache && key === adminCacheKey) return adminCache;

  adminCache = createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  adminCacheKey = key;

  return adminCache;
}
