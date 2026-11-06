import readline from "node:readline";

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
const send = (id, result) => process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
for await (const line of rl) {
  if (!line.trim()) continue;
  let message;
  try { message = JSON.parse(line); } catch { continue; }
  if (message.id === undefined) continue;
  if (message.method === "initialize") {
    send(message.id, { protocolVersion: message.params?.protocolVersion ?? "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "compatibility-fixture", version: "1.0.0" } });
  } else if (message.method === "tools/list") {
    send(message.id, { tools: [{ name: "compatibility_fixture_marker", description: "Return the fixture marker.", inputSchema: { type: "object", properties: {}, additionalProperties: false } }] });
  } else if (message.method === "tools/call" && message.params?.name === "compatibility_fixture_marker") {
    send(message.id, { content: [{ type: "text", text: "GITHUB_UNREGISTERED_LEGACY_MCP_V1" }], structuredContent: { marker: "GITHUB_UNREGISTERED_LEGACY_MCP_V1" }, isError: false });
  } else if (message.method === "ping") {
    send(message.id, {});
  } else {
    process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: message.id, error: { code: -32601, message: "Method not found" } }) + "\n");
  }
}
