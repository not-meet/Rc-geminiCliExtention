---
name: rc-uikit-modal
description: Use when building a Rocket.Chat App that needs a form, popup, modal, dialog, button, or any interactive UI to collect user input.
---

# Skill: UIKit Modal

## Steps

1. **Read the type definitions.**
   Open these files in the scaffolded app's `node_modules/@rocket.chat/apps-engine/definition/`:
   - `uikit/IUIKitInteractionHandler.d.ts` — for handler method signatures.
   - `uikit/blocks/` directory — for available block types (BlockBuilder, input elements).
   GATE: Do NOT import from `@rocket.chat/ui-kit` — that package is not installed by `rc-apps create`. All block types live inside `@rocket.chat/apps-engine/definition/uikit/blocks/`.

2. **Build the modal view.**
   Use the BlockBuilder to construct the modal surface.
   - Every input element MUST have an explicit `blockId` and `actionId` — use stable, descriptive strings (e.g., `blockId: 'input-block'`, `actionId: 'city-name'`).
   - GATE: No input element should rely on auto-generated UUIDs. Without explicit IDs, you cannot reliably read submitted values.

3. **Open the modal from a trigger.**
   The modal must be opened from a context that provides a trigger ID (slash command, button click, etc.).
   - Open the modal IMMEDIATELY — before any async I/O (HTTP calls, DB reads).
   - GATE: Is there any `await` call before the modal open? If yes, move the modal open above it. The trigger ID expires in seconds.
   - If you need data to populate the modal, open it first with a loading state, then update it.

4. **Handle submission.**
   Implement `executeViewSubmitHandler()` on the App class.
   - Read submitted values from `view.state[blockId][actionId]` — values are nested two levels deep (block first, then action).
   - GATE: Are you reading `view.state[actionId]` directly? That's wrong. It's always `view.state[blockId][actionId]`.

5. **Handle block actions (if needed).**
   If any element triggers a live action (e.g., button click, overflow menu):
   - Implement `executeBlockActionHandler()` on the App class.
   - GATE: This handler must always return a response object. Returning void causes errors. Return a success response even if you don't need to update anything.

6. **Handle modal close (only if needed).**
   - The close handler (`executeViewClosedHandler`) only fires if the modal was created with `notifyOnClose: true`.
   - GATE: The close interaction has NO trigger ID — do not attempt to open a follow-up modal from the close handler. It will fail silently.

7. **Verify.**
   - Grep for `openModalView` → this is deprecated. Use the surface-based open method.
   - Grep for `console.log` → replace with `this.getLogger()`.
   - Confirm all handlers are on the App class, not standalone classes.
