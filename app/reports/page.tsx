import { demoReports } from "@/lib/demo-reports";
import ReportCard from "@/components/report-card";
import { itemListJSONLD } from "@/lib/structured-data";
import { siteTitle, siteDescription } from "@/lib/seo";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("Reports"),
  description: siteDescription(
    "88CN data reports on AI project growth signals. Weekly snapshots, category momentum analysis, and editorial insights based on public signals."
  ),
  robots: { index: true, follow: true },
};

export default function ReportsPage() {
  const baseUrl =
    process.env.APP_URL ?? "http://localhost:3000";

  const reportsLD = itemListJSONLD(
    demoReports.map((r) => ({
      url: `${baseUrl}/reports/${r.slug}`,
      name: r.title,
    }))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reportsLD) }}
      />

      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4 text-terminal-muted" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-terminal-dim">
            Data Reports
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-terminal-fg">
          Reports
        </h1>
        <p className="text-sm text-terminal-dim">
          Data-driven snapshots of AI project growth signals. All reports are
          based on public signals from reviewed snapshots.
        </p>
      </div>

      {demoReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-terminal-dim">No reports published yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {demoReports.map((report) => (
            <ReportCard key={report.slug} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
