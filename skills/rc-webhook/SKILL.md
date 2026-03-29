---
name: rc-webhook
description: Use when building a Rocket.Chat App that needs to receive data from an external service — incoming webhook or API endpoint.
---

# Skill: Webhook (API Endpoint)

## Steps

1. **Read the type definitions.**
   Open these files in the scaffolded app's `node_modules/@rocket.chat/apps-engine/definition/`:
   - `api/ApiEndpoint.d.ts` — the base class to extend.
   - `api/IApiEndpointInfo.d.ts` — for request/response shapes.

2. **Create the endpoint class by extending `ApiEndpoint`.**
   ```ts
   import { ApiEndpoint } from '@rocket.chat/apps-engine/definition/api';

   export class MyEndpoint extends ApiEndpoint {
       public path = 'my-endpoint';

       public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
           // Handle request
           return this.success({ message: 'ok' });
       }
   }
   ```
   GATE: Are you implementing `IApiEndpoint` interface directly? Extend the `ApiEndpoint` base class instead — it gives you `this.success()` and `this.json()` helpers.

3. **Instantiate with the App reference.**
   When registering, pass `this` (the App instance):
   ```ts
   new MyEndpoint(this)
   ```
   GATE: Are you using `new MyEndpoint()` without arguments? The endpoint needs the App reference — without it, the endpoint silently fails.

4. **Handle the request body.**
   - The request body is already parsed. `request.content` is an object for JSON bodies.
   - GATE: Are you calling `JSON.parse(request.content)`? Remove it. Double-parsing breaks the data.
   - Request headers are all lowercase: use `request.headers['content-type']`, not `request.headers['Content-Type']`.

5. **Handle authentication.**
   - There is no built-in request validation. If you set `authRequired: true`, it uses RC's own user auth — external services can't use that.
   - For external webhook senders: validate tokens/signatures yourself inside the handler (e.g., check a header against a stored secret).

6. **Register the endpoint.**
   In the main App class, inside `extendConfiguration()`:
   ```ts
   configuration.api.provideApi({ visibility: ApiVisibility.PUBLIC, security: ApiSecurity.UNSECURE, endpoints: [new MyEndpoint(this)] });
   ```
   GATE: Registered in `extendConfiguration`? Not in the constructor, not in `onEnable`.

7. **Tell the user about the URL.**
   - Public endpoints: `https://<server>/api/apps/public/<app-id>/<path>`
   - Private endpoints include a server-generated hash that changes on reinstall — do not hardcode the URL. Surface it dynamically.

8. **Verify.**
   - Grep for `JSON.parse(request.content)` → remove double-parsing.
   - Grep for `console.log` → replace with `this.getLogger()`.
   - Confirm endpoint class is instantiated with `this` (App reference).
