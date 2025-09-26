# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Stack: Next.js 15 (App Router) with TypeScript and Tailwind CSS. UI primitives live under src/components/ui (shadcn-style components). Feature components live under src/components/<feature>.
- Auth and wallet: Client-side Firebase Auth paired with TonConnect (TON wallet). A mock custom-token flow is used in development.
- AI flows: Google Genkit is configured with Google AI (Gemini) and exposes server-defined flows consumed by the app.
- Notable configs: next.config.ts enables standalone output and ignores type/lint errors during build; Tailwind is configured with tailwindcss-animate; path alias @/* -> src/*.

Environment
- Node: .nvmrc and .node-version pin Node 20 (package.json engines >= 18.18). Use a Node 20 runtime for consistent behavior.
- Firebase Studio preview: Uses npm ci and a combined dev process (see dev:studio below).

Common commands
- Install dependencies (Windows PowerShell):
  - npm install
- Run the dev server (Next.js, Turbopack on port 9002):
  - npm run dev
- Build the app:
  - npm run build
- Start the production server (after build):
  - npm start
- Lint:
  - npm run lint
- Type-check only:
  - npm run typecheck
- Genkit development runner (for AI flows):
  - npm run genkit:dev
  - npm run genkit:watch
  - If these fail with "tsx: command not found", install it locally: npm i -D tsx
- Firebase Studio (Next + Genkit together for flow discovery):
  - npm run dev:studio
- Tests:
  - No test script or framework is configured in package.json.

High-level architecture and flow
- Routing (src/app)
  - Uses the App Router with route groups. (auth) contains the login page; (app) contains the main in-app experience (dashboard, leaderboard, investments, portfolio).
  - src/app/layout.tsx defines the root layout and wraps the app in providers (AuthProvider, Toaster). src/app/(app)/layout.tsx renders the top header and a persistent bottom nav, and src/app/(app)/page.tsx redirects to /dashboard.

- Auth + wallet flow
  - src/components/auth/auth-provider.tsx wraps the app in TonConnectUIProvider. When a wallet connects, it calls getAuthToken from src/ai/flows/auth-flow.ts and signs in to Firebase Auth with signInWithCustomToken. Routing reacts to auth state: unauthenticated users are sent to /login; authenticated users go to /dashboard.
  - src/ai/flows/auth-flow.ts defines getAuthToken via ai.defineFlow. It currently returns a mock JWT (header.payload.) for development so the Firebase client accepts the token format. In production, replace this with Firebase Admin SDK custom token minting.

- AI flows (Genkit)
  - src/ai/genkit.ts initializes Genkit with the Google AI plugin and sets model 'googleai/gemini-2.5-flash'.
  - Flows are defined server-side via ai.defineFlow and exported as convenience functions:
    - auth-flow.ts: getAuthToken(input: { address: string }) => string (mock JWT)
    - investment-flow.ts: listInvestments({}) => { investments: Investment[] } using mock data
    - user-flow.ts: updateUserTaps({ userId, taps }) => { newTotal } (mock calculation)
  - The dev harness src/ai/dev.ts loads .env via dotenv; ensure required provider environment variables are set for Google AI when running the dev process.

- Data and types
  - src/lib/types.ts defines User, Investment, and PortfolioPosition types.
  - src/lib/data.ts provides MOCK_USER, LEADERBOARD_USERS, INVESTMENT_OPPORTUNITIES, and USER_PORTFOLIO used by pages and flows until a real backend is connected.

- Firebase client setup
  - src/lib/firebase.ts initializes the Firebase Web SDK once and exports the app instance. The app uses the client SDK only; there is no Admin SDK in this repository.

- UI and styling
  - Tailwind is configured in tailwind.config.ts and used across app and components; animations use tailwindcss-animate. Inter font is loaded in the root layout. Many UI primitives live under src/components/ui and are composed by feature-level components.

- Next.js configuration
  - Root next.config.ts sets output: 'standalone', ignores type/lint errors during build, and whitelists remote image hosts (placehold.co, images.unsplash.com, picsum.photos).

Conventions and useful details
- TypeScript paths: @/* maps to src/* (see tsconfig.json). Import app modules using '@/...'.
- Images: Remote patterns are configured; use Next/Image with those hosts without additional config.
- Dev server port: The app runs on http://localhost:9002 during development (see npm run dev).
- shadcn/ui config: components.json defines alias mappings (components, ui, lib, hooks) and Tailwind integration.

Configuration notes and fixes
- Duplicate Next config: next.config.ts exists in both the repo root and src/. Next only reads the root config; remove src/next.config.ts to avoid confusion. (Removed.)
- Genkit runner uses tsx: The scripts invoke tsx; if it's not present locally, add it as a devDependency (npm i -D tsx).

From README.md
- “This is a NextJS starter in Firebase Studio.”
- “To get started, take a look at src/app/page.tsx.”

Admin-only payouts (TON)
- Environment variables:
  - ADMIN_API_TOKEN: secret used to authorize admin-only endpoints via x-admin-api-token header (server-side only; never from client).
  - ADMIN_TON_ADDRESS: on-chain TON address that holds funds to be distributed.
- Endpoints (server):
  - POST /api/admin/fund { amount }
    - Acknowledges intended funds to ADMIN_TON_ADDRESS (stub; real funding is an on-chain transfer to the admin wallet).
  - POST /api/admin/distribute { totalAmount, topN? }
    - Returns a payout plan that evenly splits totalAmount across top-ranked users (default topN=300; limited by available ranked users). Output includes transfers [{ userId, rank, amount }].
  - POST /api/ton/payout { toAddress, amount, comment? }
    - Stub that queues an individual payout transfer. Replace implementation with a custodial TON transfer using secured server-side keys.
- Security:
  - These endpoints require x-admin-api-token to match ADMIN_API_TOKEN. Do not call them from the client. Run them from secure server tools, jobs, or CI with masked secrets.

Firebase App Hosting / Studio
- apphosting.yaml sets maxInstances: 1 (scales entry-level by default).
- Studio preview:
  - Install: npm ci
  - Start: npm run dev:studio
  - Notes: dev:studio runs Next (port 9002) and Genkit watch mode concurrently so Studio can discover flows. Ensure Node >= 18.18 (Node 20 recommended).
