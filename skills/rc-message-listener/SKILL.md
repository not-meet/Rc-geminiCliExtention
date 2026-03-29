---
name: rc-message-listener
description: Use when building a Rocket.Chat App that reacts to messages — auto-reply, greet, echo, filter, or moderate when a message is sent.
---

# Skill: Message Listener

## Steps

1. **Read the type definitions.**
   Open these files in the scaffolded app's `node_modules/@rocket.chat/apps-engine/definition/`:
   - `messages/IPostMessageSent.d.ts` — for post-message handler.
   - `messages/IPreMessageSentModify.d.ts` — if you need to modify message content before it's sent.
   Check the exact method signatures before writing code.

2. **Implement the interface on the App class directly.**
   Message listeners go on the main App class — NOT in a separate standalone file.
   ```ts
   export class MyApp extends App implements IPostMessageSent {
   ```
   GATE: Is the listener on the App class? RC discovers listeners by checking if the App implements the interface. A standalone class won't be detected.

3. **Implement the check guard FIRST.**
   Before writing `executePostMessageSent`, implement `checkPostMessageSent`:
   ```ts
   async checkPostMessageSent(message: IMessage): Promise<boolean> {
       // Reject messages from apps and bots to prevent infinite loops
       if (message.sender.type === 'app' || message.sender.type === 'bot') {
           return false;
       }
       return true; // Process this message
   }
   ```
   GATE: Does the check guard reject app and bot sender types? Without this, your handler's reply triggers the hook again → infinite loop. This is the #1 cause of broken RC apps.

4. **Implement the execute method.**
   Write `executePostMessageSent` with your app logic.
   - **For replies visible to everyone:** Use the message creator with `.startMessage()`, set room/text, then call `.finish()`.
   - **For user-only replies (loop-safe):** Use `modify.getNotifier().notifyUser()` — notifications do NOT trigger message hooks.
   - GATE: Every `.startMessage()` chain must end with `.finish()`. Without it, the message is constructed but never sent — no error is thrown.

5. **If also listening to message updates:**
   Implement `IPostMessageUpdated` with the same sender-type guard in its check method.
   GATE: Modifying a message inside its own update handler re-triggers the handler. The same guard from step 3 is needed here too.

6. **If listening to DMs to the bot (`IPostMessageSentToBot`):**
   This hook has NO check guard method. Add a manual sender check inside `execute`:
   ```ts
   if (message.sender.id === await this.getID()) return;
   ```
   GATE: Without this, the bot replies to its own DM → triggers the hook → infinite loop.

7. **Content modification (if needed).**
   - `IPreMessageSentModify` with the modifier/builder can rewrite message content.
   - `IPreMessageSentExtend` with the extender can only ADD custom fields and attachments — it cannot change existing text.
   GATE: Are you using the extender to change message text? That won't work. Use modify for content changes.

8. **Verify.**
   - Grep for `console.log` → replace with `this.getLogger()`.
   - Grep for `getCreator().finish()` inside any message handler → confirm a sender guard exists above it.
   - Confirm no standalone listener class files — everything is on the App class.
