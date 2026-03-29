---
name: rc-http-outbound
description: Use when building a Rocket.Chat App that needs to call an external API, fetch data, or send HTTP requests to outside services.
---

# Skill: HTTP Outbound

## Steps

1. **Read the type definition.**
   Open `node_modules/@rocket.chat/apps-engine/definition/accessors/IHttp.d.ts` in the scaffolded app. Confirm available methods and their signatures.

2. **Use only the IHttp accessor.**
   All HTTP calls go through the provided `http` accessor from handler parameters:
   ```ts
   const response = await http.get('https://api.example.com/data');
   ```
   GATE: Are you importing `fetch`, `axios`, `node-fetch`, or Node's `http`/`https`? Remove them. The RC sandbox blocks all Node built-ins and npm packages that depend on them. The IHttp accessor is the only way.

3. **Use the correct method names.**
   - GET → `http.get(url, options)`
   - POST → `http.post(url, options)`
   - PUT → `http.put(url, options)`
   - DELETE → `http.del(url, options)`
   GATE: Are you calling `http.delete()`? Rename to `http.del()`. `delete` is a JS reserved word — this causes a silent compilation failure.

4. **Set the request body correctly.**
   - For JSON payloads: use the `data` field — it auto-serializes to JSON and sets Content-Type.
     ```ts
     await http.post(url, { data: { key: 'value' } });
     ```
   - For raw string payloads: use the `content` field.
   GATE: Are you putting a JSON object in `content`? Move it to `data`.

5. **Read the response safely.**
   ```ts
   if (response.statusCode !== 200) {
       // Handle error — 4xx/5xx do NOT throw, they return normally
       return;
   }
   const result = response.data; // Only set for JSON responses
   // For non-JSON: use response.content (raw string)
   ```
   GATE: Are you accessing `response.data` without checking `response.statusCode` first? A failed request still returns a response object — it does not throw.
   GATE: Is the external API returning non-JSON? Then `response.data` will be undefined — use `response.content` instead.

6. **Store API keys in settings, not code.**
   Never hardcode API keys, tokens, or URLs that contain secrets. Use the `rc-app-settings` skill to create a setting, then read it at runtime:
   ```ts
   const apiKey = await read.getEnvironmentReader().getSettings().getValueById('api-key');
   ```

7. **Ensure the networking permission exists.**
   Check `app.json` includes the networking permission. Without it, HTTP calls return `undefined` silently — no exception is thrown.

8. **Verify.**
   - Grep for `fetch(` or `axios` or `require('http')` → remove, use IHttp.
   - Grep for `http.delete` → rename to `http.del`.
   - Grep for hardcoded API keys or tokens → move to App Settings.
   - Grep for `console.log` → replace with `this.getLogger()`.
