---
name: rc-app-settings
description: Use when building a Rocket.Chat App that needs admin-configurable settings, API keys, or preferences.
---

# Skill: App Settings

## RC-specific corrections

- **PASSWORD type is not encrypted.** Gemini assumes the password setting type provides encryption at rest. It only masks the value in the admin UI — it's stored in plain text. Don't advertise it as secure storage.

- **`getValueById` throws for missing IDs, `getById` returns undefined.** Gemini uses them interchangeably. They have different failure modes — one throws, one returns undefined. Use the right one for your error handling strategy.

- **`getValueById` falls back to packageValue automatically.** Gemini adds manual fallback logic. RC already returns the default package value when no user-configured value exists.

- **Select types need the values array.** Gemini defines a select setting without providing the options list. RC renders an empty dropdown — no error is thrown.

- **Settings survive app updates.** Gemini worries about overwriting user config on update. RC preserves existing user-configured values when `provideSetting` is called again — only new settings get their defaults.

- **i18n labels work as plain strings.** Gemini creates translation key files. RC displays the label string as-is if no matching translation key is found — plain English works fine.

- **Guard required settings in onEnable.** Gemini lets the app enable without checking if required settings are configured. Check critical settings in `onEnable` and return false to block activation until they're set.

- **`onEnable` does NOT receive IRead and IModify.** Gemini assumes the same accessor pattern as event handlers. `onEnable` receives `IEnvironmentRead` and `IConfigurationModify` — completely different types. Read `App.d.ts` to get the correct signature before overriding it.
