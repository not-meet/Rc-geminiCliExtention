---
name: rc-review
description: Use AFTER all Rocket.Chat App code is written and BEFORE packaging. Final review checklist to catch silent bugs, infinite loops, sandbox violations, and missing registrations.
---

# Skill: RC App Final Review

## Silent runtime bugs

- Every `.startMessage()` chain ends with `.finish()` — without it the message is constructed but never sent. No error is thrown.
- Every `.getMessage()` call has a corresponding `.finish()` — getting the message object does not send it.
- Every modal open call uses a trigger ID that was NOT awaited behind slow I/O — expired trigger IDs fail silently.
- Every `readByAssociation` result is treated as an array, not a single record.
- Every `updateByAssociation` for create-or-replace patterns has upsert set to true — without it, first-run throws because no record exists yet.
- Every HTTP response is checked for status code before accessing the parsed data.

## Infinite loop prevention

- Every `IPostMessageSent` handler has a `checkPostMessageSent` that rejects app and bot sender types.
- Every `IPostMessageUpdated` handler has the same sender-type guard.
- Every `IPostMessageSentToBot` handler manually checks sender ID against the app's own user ID inside execute.
- No message listener uses `modify.getCreator().finish()` without a sender guard — that sends a real message that re-triggers the hook.
- No scheduler processor re-schedules itself without a termination condition.

## Sandbox violations

- No `console.log` anywhere — must use `this.getLogger()`.
- No Node.js built-in imports (`fs`, `path`, `http`, `https`, `crypto`, `url`).
- No `fetch()`, `axios`, or any npm package that depends on Node built-ins.
- All HTTP calls use the IHttp accessor (`http.get`, `http.post`, `http.del`).
- No hardcoded API keys, tokens, or secrets — all stored in App Settings.

## Registration completeness

- Every slash command is registered in `extendConfiguration` via `configuration.slashCommands.provideSlashCommand()`.
- Every API endpoint is registered in `extendConfiguration` via `configuration.api.provideApi()`.
- Every scheduler processor is registered in `extendConfiguration` via `configuration.scheduler.registerProcessors()`.
- Every setting is registered in `extendConfiguration` via `configuration.settings.provideSetting()`.
- Nothing is registered in the constructor or `onEnable` — only in `extendConfiguration`.

## App structure

- `app.json` has a valid UUID for the `id` field, not a placeholder string.
- `classFile` in `app.json` matches the actual main app filename exactly (with extension).
- `app.json` permissions only use valid RC permission names. Do NOT invent permissions — read the scaffolded `app.json` for the valid set.
- The main App class extends `App` from `@rocket.chat/apps-engine/definition/App`.
- Message listener interfaces are implemented on the App class, not on standalone classes.
- Endpoint and command classes are instantiated with `new MyClass(this)` passing the App reference.
- `onEnable` override uses the correct signature from `App.d.ts` — not the same parameters as event handlers.

## API correctness

- HTTP delete calls use `http.del()`, not `http.delete()`.
- Persistence data is always an object, never a primitive.
- Persistence keys use `RocketChatAssociationRecord`, never plain strings.
- Select/multi-select settings include the `values` array with key/label pairs.
- Slash command names are namespaced to avoid collisions (e.g. `myapp-cmd` not `cmd`).
- UIKit input elements have explicit `actionId` and `blockId` — not relying on auto-generated UUIDs.
- View state is read as `view.state[blockId][actionId]`, not `view.state[actionId]`.
