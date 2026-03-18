---
name: rc-http-outbound
description: Use when building a Rocket.Chat App that needs to call an external API, fetch data, or send HTTP requests to outside services.
---

# Skill: HTTP Outbound

## RC-specific corrections

- **No fetch, no axios, no Node http.** Gemini imports `fetch()` or `axios` by habit. RC sandbox blocks all Node built-ins and npm packages that use them. The only way to make HTTP calls is the provided IHttp accessor.

- **Delete is `http.del()`, not `http.delete()`.** Gemini writes `http.delete()`. The method is named `del` because `delete` is a JS reserved word. This causes a silent compilation failure.

- **Use `data` for JSON, `content` for raw strings.** Gemini puts JSON objects in `content`. The `data` field auto-serializes to JSON with proper headers. The `content` field sends a raw string body.

- **Response `data` is only set for JSON responses.** Gemini accesses `response.data` unconditionally. It's only populated if the response body is valid JSON — otherwise read `response.content` as a raw string.

- **Missing networking permission fails silently.** Gemini doesn't realize HTTP calls return undefined (not an error) if the app lacks the networking permission. No exception is thrown.

- **API keys must come from App Settings.** Gemini hardcodes API keys in the source. Store them in a setting so the admin can configure them without touching code.

- **Always check the status code.** Gemini uses `response.data` without checking `response.statusCode`. A 4xx/5xx response still returns a response object — it doesn't throw.
