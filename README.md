# 🚀 RC App Generator  Gemini CLI Extension

> Build Rocket.Chat Apps with plain English. No RC Apps Engine knowledge required.

## What is this?

This is a [Gemini CLI](https://github.com/google-gemini/gemini-cli) extension that lets anyone — technical or not — create fully working Rocket.Chat Apps just by describing what they want.

You don't need to know what a slash command is, what UIKit means, or how the Apps Engine works. Just describe your idea and the extension figures out the rest.

---

## How it works

```
User describes their idea (plain English)
            ↓
Extension detects required RC features
            ↓
Presents a plain-English plan for confirmation
            ↓
Scaffolds the app with rc-apps create
            ↓
Reads live .d.ts interfaces from node_modules
            ↓
Writes all code + registers everything
            ↓
Packages into deployable .zip
```

---

## Install

**Requirements**
- [Gemini CLI](https://github.com/google-gemini/gemini-cli) installed
- [rc-apps CLI](https://www.npmjs.com/package/@rocket.chat/apps-cli) installed
- Node.js v20 (v24 has known packaging issues)

```bash
# Install rc-apps CLI if you haven't
npm install -g @rocket.chat/apps-cli

# Clone and link the extension
git clone https://github.com/your-username/rc-app-gemini
cd rc-app-gemini
npm install && npm run build
gemini extensions link .
```

---

## Usage

### Create a new app
```
/rc:new I want a bot that replies when someone mentions me
/rc:new make a bot that tells jokes when asked
/rc:new give me stock prices via a command
/rc:new make my team more productive
```

### Package and deploy
```
/rc:deploy
```

---
