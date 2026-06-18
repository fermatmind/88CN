import { reportJsonLd } from "@/lib/seo/report-json-ld";

interface ReportJsonLdProps {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
}

export function ReportJsonLd(props: ReportJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(reportJsonLd(props)),
      }}
    />
  );
}
