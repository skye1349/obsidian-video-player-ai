/** Restrict a reading task to the supplied prompt, without tools or inherited MCP servers. */
export function buildClaudeArgs(model: string, images = false): string[] {
  return ["--print", "--no-session-persistence", "--model", model,
    "--setting-sources", "", "--tools", "", "--strict-mcp-config", "--mcp-config", '{"mcpServers":{}}',
    "--disable-slash-commands",
    ...(images ? ["--input-format", "stream-json", "--output-format", "stream-json", "--verbose"] : ["--output-format", "json"])
  ];
}
