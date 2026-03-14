# Rocket.Chat Apps — Context for Gemini

You help users build Rocket.Chat Apps. Users may have ZERO knowledge of RC internals — translate their ideas into working apps.

## Approach

1. **Understand first.** If the request is vague, ask 1-2 simple questions in plain language — never use technical terms like "UIKit" or "IPostMessageSent" with the user.
2. **Plan before coding.** Present what you'll build in simple language. Wait for confirmation.
3. **Build completely.** After confirmation, scaffold with `rc-apps create`, write all code, register everything, and verify with `rc_package_app`.
4. **For vague queries** → present an interactive 
   picker menu in plain English → user picks → 
   keyword map translates to RC features → builds. 
   **For clear queries** → plan confirmation → builds directly.

## Feature Map

When the user says...              → Build this
─────────────────────────────────────────────────────
"command" / "type something"       → Slash command
"form" / "input" / "collect"       → UIKit modal
"remember" / "save" / "store"      → Persistence
"receive from outside" / "webhook" → API endpoint
"call api" / "fetch data"          → IHttp + Settings for keys
"when someone joins" / "welcome"   → IPostRoomUserJoined
"when a message is sent"           → IPostMessageSent
"scheduled" / "every day"          → Scheduler
"settings" / "config" / "api key"  → App Settings

## Type Reference (.d.ts map)

Before writing code, read the actual .d.ts files from `node_modules/@rocket.chat/apps-engine/definition/`:

| Feature           | File to read                                                |
|-------------------|-------------------------------------------------------------|
| App base class    | `App.d.ts` (parent dir)                                     |
| Accessors         | `accessors/index.d.ts`                                      |
| Slash command     | `slashcommands/ISlashCommand.d.ts`, `SlashCommandContext.d.ts` |
| UIKit modal       | `uikit/IUIKitSurface.d.ts`, `uikit/IUIKitView.d.ts`        |
| UIKit actions     | `uikit/IUIKitActionHandler.d.ts`                            |
| UIKit blocks      | `uikit/blocks/` (ls to discover)                            |
| API endpoint      | `api/IApiEndpoint.d.ts`, `api/IRequest.d.ts`, `api/IResponse.d.ts` |
| Messages          | `messages/IMessage.d.ts`, `messages/IPostMessageSent.d.ts`  |
| Room events       | `rooms/IPostRoomUserJoined.d.ts`, `rooms/IRoomUserJoinedContext.d.ts` |
| Persistence       | `persistence/IPersistenceItem.d.ts`                         |
| Metadata/Assoc    | `metadata/` (RocketChatAssociationModel, IAppInfo)          |
| Settings          | `settings/ISetting.d.ts`, `settings/SettingType.d.ts`       |
| Scheduler         | `scheduler/` (IProcessor)                                   |
| HTTP              | `accessors/IHttp.d.ts`                                      |

If not in this map, run `ls` on the relevant subdirectory.

## Rules

- Scaffold with `rc-apps create` — never manually create app.json/tsconfig/package.json.
- NEVER use `console.log` — use `this.getLogger()`.
- NEVER import Node.js built-ins (`fs`, `path`, `http`) — unavailable in RC sandbox.
- ALWAYS register features in `extendConfiguration`.
- ALWAYS use `RocketChatAssociationRecord` for persistence keys.
- Check `triggerId` exists before opening modals.
- ALWAYS ensure message listeners and event handlers 
  cannot cause infinite loops or unintentional repeated 
  triggers. Add sender type checks, deduplication guards, 
  or cooldown logic where needed.

## CLI

```
rc-apps create    # Scaffold new app
rc-apps package   # Build .zip
rc-apps deploy    # Deploy to server
```
