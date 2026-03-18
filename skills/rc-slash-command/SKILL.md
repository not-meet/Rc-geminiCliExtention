---
name: rc-slash-command
description: Use when building a Rocket.Chat App that needs a slash command — user types /something to trigger an action.
---

# Skill: Slash Command

## RC-specific corrections

- **Arguments have no quoting support.** Gemini assumes shell-style quoting works. RC splits on raw whitespace — `"hello world"` becomes two args, not one. Join them back if you need the full string.

- **Preview requires both methods.** Gemini sets `providesPreview: true` but only implements `previewer()`. RC silently does nothing when a preview item is clicked unless `executePreviewItem()` also exists. And when a preview item IS selected, `executor()` is never called — only `executePreviewItem()` runs.

- **Preview items are hard-capped at 10.** RC silently discards extras with no warning.

- **Command names collide silently.** Gemini picks generic names like `help` or `status`. RC throws `CommandAlreadyExistsError` if any other app or built-in uses that name. Always namespace: `myapp-help`.

- **The trigger ID expires fast.** Gemini awaits an HTTP call, then tries to open a modal. By then the trigger ID has expired server-side. Open the modal first, fetch data after.

- **Ephemeral vs persistent messages are different APIs.** Gemini uses the message creator for everything. Use the notifier for messages only the sender should see — they are not stored and don't trigger hooks.
