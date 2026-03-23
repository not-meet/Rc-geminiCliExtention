# AGENTS.md — rc-app-gemini (Gemini CLI Extension)

## Build & Run
- **Build:** `npm run build` (runs `tsc`, outputs to `dist/`)
- **Dev:** `npm run dev` (runs `tsc --watch`)
- **Start:** `npm run start` (runs `node dist/mcp-server.js`)
- No test framework is configured.

## Architecture
Gemini CLI extension for building Rocket.Chat Apps from natural language descriptions.
- `src/mcp-server.ts` — Entry point; creates `McpServer`, registers the `rc_package_app` tool.
- `src/tools/package.ts` — Only MCP tool: runs `rc-apps package` to zip the app, reports errors.
- `commands/rc/new.toml` — `/rc:new` command: guides Gemini through understand → plan → confirm → build flow.
- `commands/rc/deploy.toml` — `/rc:deploy` command: packages and provides deploy instructions.
- `GEMINI.md` — Context injected into Gemini: feature map (natural language → RC feature), .d.ts type reference map, behavioral rules.
- Gemini writes app code directly using `rc-apps create` CLI + reading `.d.ts` files from the generated app's `node_modules/@rocket.chat/apps-engine/definition/`.

## Code Style
- **TypeScript** strict mode, ES2016 target, Node16 modules. Output to `dist/`.
- **Dependencies:** `@modelcontextprotocol/sdk`, `zod`. No linter/formatter.
- **Naming:** PascalCase classes/types, camelCase functions/variables, kebab-case file slugs.
- **Tool pattern:** `src/tools/*.ts` exports `register(server: McpServer)`.
- **Error handling:** Tools return `{ content: [{ type: 'text', text }], isError: true }` on failure.
