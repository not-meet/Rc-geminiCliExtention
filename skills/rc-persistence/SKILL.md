---
name: rc-persistence
description: Use when building a Rocket.Chat App that needs to save, store, remember, or count data across sessions.
---

# Skill: Persistence

## RC-specific corrections

- **There are no plain string keys.** Gemini writes `persistence.create('my-key', data)`. RC requires a `RocketChatAssociationRecord` wrapping a model type and an ID string. Plain strings don't work.

- **Read always returns an array.** Gemini treats `readByAssociation` as returning a single record. It always returns an array, even for one match. Destructure it.

- **Update throws if the record doesn't exist.** Gemini calls update expecting upsert behavior. RC throws unless you explicitly pass the upsert flag as true. Always enable upsert for create-or-replace patterns.

- **Read and write use different accessors.** Gemini tries to read from the persistence parameter. Reading is done through `read.getPersistenceReader()`, writing through the persistence parameter. They are separate.

- **Multiple associations use AND, not OR.** Gemini passes multiple associations expecting any-match behavior. RC requires ALL associations to match — it's an intersection, not a union.

- **Data must be an object.** Gemini stores primitives like `persistence.create(assoc, 42)`. RC expects a record/object shape for the data field.

- **Each app's data is sandboxed.** Gemini doesn't realize apps can't read each other's persistence records — there's no need for app-ID prefixing in your keys.
