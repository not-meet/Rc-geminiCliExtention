---
name: rc-persistence
description: Use when building a Rocket.Chat App that needs to save, store, remember, or count data across sessions.
---

# Skill: Persistence

## Steps

1. **Read the type definitions.**
   Open these files in the scaffolded app's `node_modules/@rocket.chat/apps-engine/definition/`:
   - `accessors/IPersistence.d.ts` — for write methods.
   - `accessors/IPersistenceRead.d.ts` — for read methods.
   - `metadata/RocketChatAssociationRecord.d.ts` — for key construction.

2. **Create association keys.**
   Every persistence operation uses `RocketChatAssociationRecord`, never plain strings.
   ```ts
   import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';

   const assoc = new RocketChatAssociationRecord(
       RocketChatAssociationModel.MISC,
       'my-unique-id'
   );
   ```
   GATE: Are you passing a plain string as a key anywhere? That won't work. Every key must be a `RocketChatAssociationRecord`.

3. **Write data.**
   Use the `persistence` accessor (from handler parameters) to write:
   ```ts
   await persistence.createWithAssociation(dataObject, assoc);
   ```
   - GATE: Is the data an object? Primitives like `42` or `"hello"` are not valid. Always wrap in an object: `{ value: 42 }`.

4. **Read data.**
   Use `read.getPersistenceReader()` to read — NOT the persistence parameter.
   ```ts
   const reader = read.getPersistenceReader();
   const results = await reader.readByAssociation(assoc);
   ```
   - GATE: `readByAssociation` ALWAYS returns an array, even for a single match. Destructure it: `const [record] = results;`
   - GATE: Are you reading from the `persistence` parameter? That's write-only. Reading uses `read.getPersistenceReader()`.

5. **Update data (create-or-replace pattern).**
   ```ts
   await persistence.updateByAssociation(assoc, newData, true); // true = upsert
   ```
   - GATE: Is the third argument `true`? Without upsert enabled, the first run throws because no record exists yet.

6. **Multiple associations.**
   If querying with multiple associations, know that RC uses AND logic — all associations must match. It's an intersection, not a union.

7. **Verify.**
   - No need to prefix keys with app ID — each app's persistence is automatically sandboxed.
   - Grep for `console.log` → replace with `this.getLogger()`.
