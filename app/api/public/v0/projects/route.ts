import { demoProjects } from "@/lib/demo-projects";
import { errorResponse, success } from "@/lib/api/response";
import { getOrCreateRequestId } from "@/lib/api/request-id";
import { isPublicApiEnabled } from "@/lib/public-api/feature-flags";
import { publicApiDisabledProblem } from "@/lib/public-api/problem";
import { serializePublicApiProjects } from "@/lib/public-api/serializer";

const INSTANCE = "/api/public/v0/projects";

export async function GET() {
  const requestId = getOrCreateRequestId();

  if (!isPublicApiEnabled()) {
    return errorResponse(publicApiDisabledProblem(INSTANCE, requestId), requestId);
  }

  return success(
    {
      projects: serializePublicApiProjects(demoProjects),
    },
    requestId
  );
}
