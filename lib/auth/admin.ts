import { createServerSupabase } from "./session";

export interface AdminGuardResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail?: string;
  userId?: string;
  error?: string;
}

export async function checkAdminGuard(): Promise<AdminGuardResult> {
  const supabase = await createServerSupabase();

  if (!supabase) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      error: "Supabase is not configured.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      isAuthenticated: false,
      isAdmin: false,
    };
  }

  const { data: isAdminResult, error: rpcError } = await supabase.rpc(
    "is_admin"
  );

  if (rpcError) {
    return {
      isAuthenticated: true,
      isAdmin: false,
      userEmail: user.email,
      userId: user.id,
      error: rpcError.message,
    };
  }

  return {
    isAuthenticated: true,
    isAdmin: isAdminResult === true,
    userEmail: user.email,
    userId: user.id,
  };
}
