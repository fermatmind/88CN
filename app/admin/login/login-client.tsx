"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";
import { Shield, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface LoginClientProps {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export default function LoginClient({
  supabaseUrl,
  supabaseAnonKey,
}: LoginClientProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      setMessage("Signed in. Redirecting...");
      window.location.href = "/admin";
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label
          htmlFor="admin-email"
          className="block mb-1.5 text-xs font-medium text-terminal-muted"
        >
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="w-full rounded-md border border-terminal-border bg-terminal-surface px-3 py-2 text-xs text-terminal-fg placeholder:text-terminal-dim/50 focus:border-terminal-ring focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="block mb-1.5 text-xs font-medium text-terminal-muted"
        >
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-md border border-terminal-border bg-terminal-surface px-3 py-2 text-xs text-terminal-fg placeholder:text-terminal-dim/50 focus:border-terminal-ring focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-md border border-terminal-border px-4 py-2 text-sm font-semibold",
          "bg-terminal-fg text-terminal-bg hover:bg-terminal-muted transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            Sign In
          </>
        )}
      </button>

      {status === "success" && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs">
          <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="text-emerald-400">{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-2.5 text-xs">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
          <span className="text-red-400">{message}</span>
        </div>
      )}
    </form>
  );
}
