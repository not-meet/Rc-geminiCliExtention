---
name: rc-uikit-modal
description: Use when building a Rocket.Chat App that needs a form, popup, modal, dialog, button, or any interactive UI to collect user input.
---

# Skill: UIKit Modal

## RC-specific corrections

- **The trigger ID expires in seconds.** Gemini fetches data from an API, then opens the modal. By then the trigger ID is dead. Always open the modal immediately — populate it with data afterward if needed.

- **Submitted values are nested two levels deep.** Gemini tries to read values directly by action ID from the view state. RC nests them under block ID first, then action ID. Read the actual view state shape from the incoming interaction type to get the correct access pattern.

- **Auto-generated IDs break the submit handler.** Gemini omits `blockId` and `actionId` on input elements. RC auto-generates UUIDs for them, making it impossible to read values from `view.state` reliably. Always provide explicit, stable IDs.

- **The view-closed handler doesn't fire by default.** Gemini implements `executeViewClosedHandler` expecting it to always run. RC only fires it if the surface was created with notify-on-close set to true.

- **No trigger ID in the close handler.** Gemini tries to open a follow-up modal from the close handler. The close interaction has no trigger ID, so modal opens fail silently.

- **`openModalView` is deprecated.** Gemini's training data includes the old method. Use the surface-based open method with the modal surface type.

- **Block action handler must always return a response.** Gemini sometimes returns void. RC expects a response object — return a success response even if you don't need to update anything.

- **UIKit blocks come from apps-engine, not a separate package.** Gemini imports from `@rocket.chat/ui-kit` which is not installed by `rc-apps create`. The BlockBuilder and all block types live inside `@rocket.chat/apps-engine/definition/uikit/blocks/` — no additional dependency is needed.
