import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

let clientCache: SupabaseClient | null = null;
let cacheEnvKey = "";

export function getSupabaseClient(): SupabaseClient | null {
  const env = getSupabaseEnv();
  if (!env.isConfigured) return null;

  const envKey = `${env.url}:${env.anonKey.slice(0, 8)}`;
  if (clientCache && envKey === cacheEnvKey) return clientCache;

  clientCache = createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  cacheEnvKey = envKey;

  return clientCache;
}
