import mcpBoundary from "@/ops/contracts/mcp-boundary.json";

type McpToolSpec = {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    additionalProperties: false;
    required?: string[];
    properties: Record<string, unknown>;
  };
  output_fields: string[];
};

const allowedToolNames = new Set(mcpBoundary.allowed_tool_names);

export const MCP_TOOL_SPECS: McpToolSpec[] = mcpBoundary.tool_specs
  .filter((tool) => allowedToolNames.has(tool.name))
  .map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema as McpToolSpec["inputSchema"],
    output_fields: tool.output_fields,
  }));

export function listMcpTools(): McpToolSpec[] {
  return MCP_TOOL_SPECS;
}
