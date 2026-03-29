---
name: rc-slash-command
description: Use when building a Rocket.Chat App that needs a slash command — user types /something to trigger an action.
---

# Skill: Slash Command

## Steps

1. **Read the type definition.**
   Open `node_modules/@rocket.chat/apps-engine/definition/slashcommands/ISlashCommand.d.ts` in the scaffolded app. Confirm the method signatures before writing any code.

2. **Create the command class.**
   Create a new file in the project (e.g., `commands/MyCommand.ts`). The class implements `ISlashCommand`.
   - Set `command` to a **namespaced** name: `appname-cmdname` (e.g., `stockbot-price`).
   - GATE: Is the command name unique and prefixed with the app name? Generic names like `help`, `status`, `info` collide with built-ins and other apps — always namespace.

3. **Decide on preview support.**
   - If the user did NOT ask for preview results → set `providesPreview: false`. Skip to step 5.
   - If the user asked for preview → set `providesPreview: true` and continue to step 4.

4. **Implement preview (only if step 3 requires it).**
   a. Implement `previewer()` — return a list of preview items. Maximum 10 items — extras are silently discarded.
   b. Implement `executePreviewItem()` — this runs when the user clicks a preview item.
   c. GATE: Both `previewer()` AND `executePreviewItem()` must exist. Without `executePreviewItem()`, clicking a preview item does nothing silently. Note: `executor()` is NOT called when a preview item is selected — only `executePreviewItem()` runs.

5. **Write the executor.**
   Implement `executor()` for the main command logic.
   - **Arguments:** RC splits on raw whitespace. `"hello world"` becomes two args, not one. If you need the full string, join the args array back together.
   - **User-only responses:** Use the notifier (`modify.getNotifier().notifyUser()`) for messages only the sender should see. Do NOT use the message creator — those are persistent and visible to everyone and trigger message hooks.
   - **Opening a modal:** If this command opens a modal, call the modal open FIRST, before any async I/O (HTTP calls, persistence reads). The trigger ID expires in seconds — awaiting slow operations first causes silent failure.

6. **Register the command.**
   In the main App class, inside `extendConfiguration()`:
   ```ts
   configuration.slashCommands.provideSlashCommand(new MyCommand(this));
   ```
   GATE: Is the command registered in `extendConfiguration`? Not in the constructor, not in `onEnable` — only in `extendConfiguration`.

7. **Verify.**
   - Grep for `console.log` → replace with `this.getLogger()`.
   - Grep for `http.delete` → rename to `http.del`.
   - Confirm the command file is imported in the main App file.
