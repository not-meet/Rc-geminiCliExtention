---
name: rc-app-settings
description: Use when building a Rocket.Chat App that needs admin-configurable settings, API keys, or preferences.
---

# Skill: App Settings

## Steps

1. **Read the type definitions.**
   Open these files in the scaffolded app's `node_modules/@rocket.chat/apps-engine/definition/`:
   - `settings/ISetting.d.ts` — for the setting shape.
   - `settings/SettingType.d.ts` — for available types (STRING, NUMBER, BOOLEAN, SELECT, etc.).
   - `App.d.ts` — for the correct `onEnable` signature (it does NOT receive IRead/IModify).

2. **Define each setting.**
   Build the setting object with required fields:
   ```ts
   configuration.settings.provideSetting({
       id: 'api-key',
       type: SettingType.STRING,
       packageValue: '',       // default value
       required: true,
       public: false,
       i18nLabel: 'API Key',   // plain English works — no translation file needed
       i18nDescription: 'Your API key for the service',
   });
   ```

3. **For SELECT or MULTI_SELECT types:**
   Include the `values` array with key/label pairs:
   ```ts
   values: [
       { key: 'option1', i18nLabel: 'Option One' },
       { key: 'option2', i18nLabel: 'Option Two' },
   ]
   ```
   GATE: Does a select setting have a `values` array? Without it, RC renders an empty dropdown — no error is thrown.

4. **Register settings in `extendConfiguration`.**
   GATE: All `provideSetting` calls go in `extendConfiguration()`. Not in the constructor, not in `onEnable`.
   Note: Settings survive app updates — RC preserves user-configured values. Only new settings get their defaults.

5. **Read settings at runtime.**
   ```ts
   const value = await read.getEnvironmentReader().getSettings().getValueById('api-key');
   ```
   - `getValueById` throws if the ID doesn't exist. `getById` returns undefined. Choose based on your error handling needs.
   - `getValueById` automatically falls back to the `packageValue` if no user-configured value exists — no manual fallback needed.

6. **Guard required settings in `onEnable` (if critical).**
   If the app can't function without a setting (e.g., API key), check it in `onEnable` and return false to block activation:
   ```ts
   async onEnable(environmentRead: IEnvironmentRead, configModify: IConfigurationModify): Promise<boolean> {
       const apiKey = await environmentRead.getSettings().getValueById('api-key');
       if (!apiKey) return false;
       return true;
   }
   ```
   GATE: `onEnable` receives `IEnvironmentRead` and `IConfigurationModify` — completely different types from event handler parameters. Read `App.d.ts` to confirm the signature before overriding.

7. **About PASSWORD type.**
   `SettingType.PASSWORD` only masks the value in the admin UI — it is stored in plain text. Do not present it to users as encrypted or secure storage.

8. **Verify.**
   - Grep for `console.log` → replace with `this.getLogger()`.
   - Confirm every select/multi-select has a `values` array.
   - Confirm settings are registered in `extendConfiguration`.
