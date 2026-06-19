import { NextResponse } from "next/server";
import { apiKeysDisabledProblem } from "@/lib/api-keys/problem";
import { getApiKeyShellFlags, isApiKeyShellDisabled } from "@/lib/api-keys/flags";

const PROBLEM_JSON = "application/problem+json";

function disabledResponse() {
  const problem = apiKeysDisabledProblem();

  return NextResponse.json(problem, {
    status: problem.status,
    headers: {
      "Content-Type": PROBLEM_JSON,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  getApiKeyShellFlags();
  isApiKeyShellDisabled();
  return disabledResponse();
}

export async function POST() {
  getApiKeyShellFlags();
  isApiKeyShellDisabled();
  return disabledResponse();
}
