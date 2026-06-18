import type { Metadata } from "next";
import { BellOff, ShieldCheck } from "lucide-react";
import { noIndex, siteDescription, siteTitle } from "@/lib/seo";
import {
  getSignalAlertRuntimePolicy,
  SIGNAL_ALERTS_ENV_FLAG,
  SIGNAL_ALERT_DELIVERY_ENV_FLAG,
} from "@/lib/alerts/flags";

export const metadata: Metadata = {
  title: siteTitle("Signal Alerts"),
  description: siteDescription("Admin boundary notes for disabled signal alerts."),
  ...noIndex(),
};

const notes = [
  "Signal alerts are disabled by default.",
  "Delivery is hard-disabled in v0 even if the visibility flag is enabled.",
  "No real email, SMS, chat, webhook, or external notification provider is configured.",
  "Alert rules store no private founder contact payload.",
  "Any future delivery work requires a separate human checkpoint.",
];

export default function AdminAlertsPage() {
  const policy = getSignalAlertRuntimePolicy();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <BellOff className="h-4 w-4 text-terminal-muted" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-terminal-dim">
            Admin
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-terminal-fg">
          Signal Alerts
        </h1>
        <p className="text-sm leading-relaxed text-terminal-muted">
          Signal alert rules can be modeled for review, but v0 does not send
          messages or call notification providers.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {[
          [SIGNAL_ALERTS_ENV_FLAG, String(policy.alertsEnabled)],
          [SIGNAL_ALERT_DELIVERY_ENV_FLAG, String(policy.deliveryEnabled)],
          ["external_provider", policy.externalProvider],
          ["stores_private_founder_data", String(policy.storesPrivateFounderData)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-terminal-border bg-terminal-surface p-4"
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-terminal-dim">
              {label}
            </p>
            <p className="font-mono text-xs text-terminal-muted">{value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note}
            className="flex gap-3 rounded-lg border border-terminal-border bg-terminal-surface p-4 text-xs leading-relaxed text-terminal-dim"
          >
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terminal-muted" />
            <span>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
