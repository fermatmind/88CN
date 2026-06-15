"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { PlusCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
}

export default function SubmitForm() {
  const [form, setForm] = useState<FormState>({
    status: "idle",
    message: "",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setForm({ status: "submitting", message: "" });

    const formData = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      const v = value.toString().trim();
      if (v) body[key] = v;
    });

    try {
      const res = await fetch("/api/project-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (res.ok) {
        setForm({
          status: "success",
          message:
            "Project submitted for editorial review. You will be notified when the review is complete.",
        });
        e.currentTarget.reset();
      } else {
        const detail = json?.error?.detail ?? "Submission failed.";
        setForm({ status: "error", message: detail });
      }
    } catch {
      setForm({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section label="Project Information">
        <Field
          name="project_name"
          label="Project Name"
          required
          placeholder="My AI Project"
        />
        <Field
          name="website_url"
          label="Website URL"
          type="url"
          placeholder="https://example.com"
        />
        <Field
          name="category_slug"
          label="Category"
          required
          placeholder="ai-coding, ai-agents, local-llm, rag-tools, etc."
        />
        <Field
          name="one_liner"
          label="One-Liner"
          required
          maxLength={300}
          placeholder="A single sentence describing what your project does."
          inputClassName="h-20"
          textarea
        />
        <Field
          name="description"
          label="Description"
          maxLength={2000}
          placeholder="Additional details about your project."
          inputClassName="h-24"
          textarea
        />
      </Section>

      <Section label="Founder Information">
        <Field
          name="founder_name"
          label="Your Name"
          placeholder="Jane Founder"
        />
        <Field
          name="founder_email"
          label="Email"
          type="email"
          placeholder="jane@example.com"
        />
        <Field
          name="founder_public_url"
          label="Public Profile URL"
          type="url"
          placeholder="https://linkedin.com/in/..."
        />
      </Section>

      <Section label="Additional URLs">
        <Field
          name="github_url"
          label="GitHub URL"
          type="url"
          placeholder="https://github.com/org/repo"
        />
        <Field
          name="docs_url"
          label="Documentation URL"
          type="url"
          placeholder="https://docs.example.com"
        />
        <Field
          name="pricing_url"
          label="Pricing URL"
          type="url"
          placeholder="https://example.com/pricing"
        />
        <Field
          name="launch_url"
          label="Launch / Product Hunt URL"
          type="url"
          placeholder="https://producthunt.com/..."
        />
      </Section>

      <Section label="Growth Signals">
        <Field
          name="growth_note"
          label="Growth Note"
          maxLength={1000}
          placeholder="Any public growth signals or milestones you want to share."
          inputClassName="h-20"
          textarea
        />
      </Section>

      <div className="flex flex-col items-start gap-3">
        <button
          type="submit"
          disabled={form.status === "submitting"}
          className={cn(
            "inline-flex items-center gap-2 rounded-md border border-terminal-border px-6 py-2.5 text-sm font-semibold",
            "bg-terminal-fg text-terminal-bg hover:bg-terminal-muted transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {form.status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Submit Project
            </>
          )}
        </button>

        {form.status === "success" && (
          <div className="flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs">
            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span className="text-emerald-400">{form.message}</span>
          </div>
        )}

        {form.status === "error" && (
          <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
            <span className="text-red-400">{form.message}</span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-terminal-dim leading-relaxed">
        Create a free structured AI project profile. No ranking guarantees. No
        backlink promises. Submissions are reviewed for public growth signals
        and editorial quality.
      </p>
    </form>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
      <legend className="text-xs font-semibold uppercase tracking-wider text-terminal-muted mb-4 px-2">
        {label}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Field({
  name,
  label,
  required,
  type,
  placeholder,
  maxLength,
  textarea,
  inputClassName,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  textarea?: boolean;
  inputClassName?: string;
}) {
  const inputId = `field-${name}`;
  const baseClass = cn(
    "w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-fg",
    "placeholder:text-terminal-dim/50 focus:border-terminal-ring focus:outline-none",
    inputClassName
  );

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block mb-1.5 text-xs font-medium text-terminal-muted"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-terminal-dim">*</span>
        )}
      </label>
      {textarea ? (
        <textarea
          id={inputId}
          name={name}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          className={baseClass}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type ?? "text"}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          className={baseClass}
        />
      )}
    </div>
  );
}
