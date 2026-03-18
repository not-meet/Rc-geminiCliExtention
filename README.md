<p align="center">
 <img width=30% src="https://github.com/user-attachments/assets/a92f27b9-5101-4725-8311-a0e6ada0edc7" alt="rocket-chat">
  &nbsp;&nbsp;✦&nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png" alt="Gemini" height="40" />
</p>

<h1 align="center">RC App Generator</h1>

<p align="center">
  <strong>Gemini CLI extension that builds Rocket.Chat Apps from plain English.</strong><br/>
  No Apps Engine knowledge required.
</p>

<p align="center">
  <a href="https://github.com/google-gemini/gemini-cli">Gemini CLI</a> · 
  <a href="https://developer.rocket.chat/apps-engine">Apps Engine Docs</a> · 
  <a href="https://www.npmjs.com/package/@rocket.chat/apps-cli">rc-apps CLI</a>
</p>

---

### What it does

Describe what you want. The extension figures out the RC features, writes the code, and packages a `.zip` you can upload.

```
Understand → Plan → Confirm → Scaffold → Code → Review → Package
```

No need to know what UIKit, `IPostMessageSent`, or `RocketChatAssociationRecord` means.

---

### Skills

The extension uses on-demand skills — loaded only when relevant, not all at once.

| Skill | Activates when you need |
|---|---|
| `rc-slash-command` | `/command` triggers |
| `rc-message-listener` | Auto-replies, greetings, message reactions |
| `rc-uikit-modal` | Forms, popups, buttons, interactive UI |
| `rc-persistence` | Saving, storing, counting data |
| `rc-webhook` | Incoming webhooks from external services |
| `rc-http-outbound` | Calling external APIs |
| `rc-scheduler` | Cron jobs, recurring tasks, reminders |
| `rc-app-settings` | Admin settings, API keys, config |
| `rc-review` | Final checklist before packaging |

Each skill contains RC-specific corrections — things Gemini confidently gets wrong because of its general JS/TS knowledge. Not tutorials. Just the gaps between valid code and working RC code.

---

### Install

**Requirements:** [Gemini CLI](https://github.com/google-gemini/gemini-cli) · [rc-apps CLI](https://www.npmjs.com/package/@rocket.chat/apps-cli) · Node.js v20

```bash
npm install -g @rocket.chat/apps-cli

git clone https://github.com/not-meet/rc-geminicliextention.git
cd rc-geminicliextention
npm install && npm run build
gemini extensions link .
```

Verify:

```bash
gemini extensions list    # should show rocketchat-app-generator
```

---

### Usage

**Create an app:**

```
/rc:new I want a bot that replies when someone mentions me
/rc:new a welcome bot that greets new users and remembers their name
/rc:new stock price checker with a /stock command and API key settings
```

**Package & deploy:**

```
/rc:deploy
```

After packaging, upload the `.zip`:

1. Open **Admin Panel → Marketplace → Private Apps**
2. Click **Upload Private App**
3. Select the `.zip` → **Install**

---

### How skills work

Skills are **not** loaded all at once. Gemini reads only the `name` and `description` at session start. When it recognizes a matching task, it activates the skill and pulls in the full instructions.

This means a simple `/rc:new hello world bot` only loads `rc-slash-command` — not all 9 skills.

The `rc-review` skill activates after code is written, right before packaging. It catches silent bugs that compile fine but break at runtime.

---

### License

MIT
