---
name: rc-webhook
description: Use when building a Rocket.Chat App that needs to receive data from an external service — incoming webhook or API endpoint.
---

# Skill: Webhook (API Endpoint)

## RC-specific corrections

- **Extend the base class, don't implement the raw interface.** Gemini implements `IApiEndpoint` directly and misses the `success()` and `json()` helpers. Extending `ApiEndpoint` gives you those for free.

- **The endpoint class needs the App reference.** Gemini instantiates endpoints with `new MyEndpoint()`. RC requires `new MyEndpoint(this)` passing the App instance — without it, the endpoint silently fails.

- **There is no built-in auth.** Gemini assumes RC validates incoming requests. The only security option is UNSECURE. If you need token validation, do it yourself inside the handler. The `authRequired` flag only leverages RC's own user auth system.

- **Request headers are lowercase.** Gemini checks `request.headers['Content-Type']`. RC lowercases all header keys — use `request.headers['content-type']`.

- **The body is already parsed.** Gemini calls `JSON.parse(request.content)`. RC already parses JSON bodies into `request.content` as an object — double-parsing breaks it.

- **Disabled apps return 404 automatically.** Gemini adds custom "app disabled" error handling. RC handles this at the platform level — your handler code never runs when the app is off.

- **Private endpoint URLs include a random hash.** Gemini hardcodes the endpoint URL. Private endpoints have a server-generated hash segment that changes on reinstall — always surface the full URL to the user dynamically.
