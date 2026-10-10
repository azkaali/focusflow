# FocusFlow

Turn a messy brain dump into small, doable steps. FocusFlow is an AI-assisted task breakdown app for people who struggle to get started — type what's on your mind, get a short checklist back, and tick it off one step at a time.

> FocusFlow is a productivity tool. It is not a medical device and does not diagnose or treat any condition.

## Stack

- [Expo](https://expo.dev) SDK 57 + Expo Router (iOS, Android, web)
- Expo Router API route (`src/app/api/breakdown+api.ts`) calls Claude Haiku 5.5 server-side, so the API key never ships in the app
- On-device storage via `expo-sqlite`'s `localStorage` shim

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Add your Anthropic API key to `.env.local` (git-ignored):

   ```bash
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Start the dev server

   ```bash
   npx expo start
   ```

   The API route is served by the dev server, so breakdowns work in development on device, simulator and web.

## Deploying the API

The app's AI calls go to the Expo Router API route, which needs a server in production:

```bash
npx expo export --platform web
npx eas-cli@latest deploy
```

Set `ANTHROPIC_API_KEY` as a secret environment variable in EAS, then set the deployed URL as `origin` in the `expo-router` plugin in `app.json` so native builds know where to send requests.

## Free tier

Free users get a limited number of AI breakdowns per week (`FREE_BREAKDOWNS_PER_WEEK` in `src/lib/usage.ts`). The cap is currently enforced on-device only; server-side enforcement arrives with accounts and the paywall.
