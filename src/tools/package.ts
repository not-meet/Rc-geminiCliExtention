import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function register(server: McpServer): void {
  server.registerTool(
    'rc-apps package',
    {
      description:
        'Package a Rocket.Chat App into a deployable .zip file using rc-apps package. If packaging fails, analyze the errors, fix the code, and retry.',
      inputSchema: z.object({
        projectDir: z.string().describe('Absolute path to the RC App project root'),
      }).shape,
    },
    async ({ projectDir }) => {
      try {
        const output = execSync('rc-apps package 2>&1', {
          cwd: projectDir,
          timeout: 60000,
          encoding: 'utf8',
        });

        // Find the generated zip file
        const files = fs.readdirSync(projectDir).filter(f => f.endsWith('.zip'));
        const zipFile = files[0] ?? 'unknown.zip';

        return {
          content: [{
            type: 'text' as const,
            text: `✅ App packaged successfully!\n\nOutput:\n${output}\n\nPackage: ${path.join(projectDir, zipFile)}\n\nYou can now upload this .zip to your Rocket.Chat Admin > Apps > Upload App.`,
          }],
        };
      } catch (err: any) {
        const errorOutput = err.stdout || err.message || 'Unknown error';
        return {
          content: [{
            type: 'text' as const,
            text: `❌ Packaging failed!\n\nErrors:\n${errorOutput}`,
          }],
          isError: true,
        };
      }
    }
  );
}
