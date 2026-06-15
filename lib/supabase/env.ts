export interface SupabaseEnv {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  isConfigured: boolean;
}

let cached: SupabaseEnv | null = null;

export function getSupabaseEnv(): SupabaseEnv {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  cached = {
    url: url ?? "",
    anonKey: anonKey ?? "",
    serviceRoleKey: serviceRoleKey || undefined,
    isConfigured: !!(url && anonKey),
  };

  return cached;
}
