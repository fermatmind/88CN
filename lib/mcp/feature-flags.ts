export function isMcpServerEnabled(
  value: string | undefined = process.env.MCP_SERVER_ENABLED
): boolean {
  return value === "true";
}

export function isMcpLocalOnly(
  value: string | undefined = process.env.MCP_LOCAL_ONLY
): boolean {
  return value !== "false";
}
