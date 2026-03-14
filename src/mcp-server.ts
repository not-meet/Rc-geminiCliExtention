/**
 * Rocket.Chat App Generator — MCP Server
 * Provides packaging tool for RC Apps via Gemini CLI
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { register as registerPackage } from './tools/package.js';

const server = new McpServer({
  name: 'rocketchat-mcp-server',
  version: '0.2.0',
});

registerPackage(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  const shutdown = async () => {
    await server.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err}\n`);
  process.exit(1);
});
