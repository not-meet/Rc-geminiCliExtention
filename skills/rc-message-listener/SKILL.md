---
name: rc-message-listener
description: Use when building a Rocket.Chat App that reacts to messages — auto-reply, greet, echo, filter, or moderate when a message is sent.
---

# Skill: Message Listener

## RC-specific corrections

- **Sending a message inside a post-message handler re-triggers that handler.** This is the #1 cause of infinite loops. Gemini writes a handler that replies to every message — the reply triggers the handler again, forever. Always implement the check guard and reject app/bot sender types.

- **The check guard is optional but critical.** If you don't implement it, RC runs the execute method on EVERY message with no filtering. Gemini skips it because it's marked optional in the types.

- **Ephemeral notifications are loop-safe.** Gemini uses the message creator for replies. The notifier's user notification does NOT trigger message hooks — use it when the reply doesn't need to be visible to the whole room.

- **The DM-to-bot hook has no check guard.** Unlike other message hooks, this one provides no optional check method. Gemini doesn't add a manual sender check inside execute, so the bot replies to its own DM, which triggers the hook again.

- **The listener goes on the App class, not a separate file.** Gemini creates a standalone class like slash commands. Message listeners must be implemented directly on the App class — RC discovers them by checking if the App implements the interface.

- **Pre-send extend is additive only.** Gemini tries to overwrite message text using the extender. The extender can only ADD custom fields and attachments. To rewrite content, use pre-send modify with the builder instead.

- **Update hooks have the same loop risk.** Gemini guards the send hook but forgets the update hook. Modifying a message inside its own update handler re-triggers that handler.
