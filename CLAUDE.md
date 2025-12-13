# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Neo-Bank Dashboard - A crypto-friendly banking dashboard for startups built with Next.js 14 (App Router), featuring MNEE cryptocurrency wallet integration and AI-powered financial assistance via Google Gemini.

## Development Commands

**Install dependencies:**
```bash
npm install
```

**Start development server:**
```bash
npm run dev
```
Opens at http://localhost:3000

**Build for production:**
```bash
npm build
```

**Start production server:**
```bash
npm start
```

**Lint code:**
```bash
npm run lint
```

## Architecture

### Core Technologies
- **Framework**: Next.js 14 with App Router (server and client components)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Cryptocurrency**: MNEE SDK (@mnee/ts-sdk) for BSV-based transactions
- **AI**: Google Gemini (gemini-1.5-flash) for chat agent
- **Web3 (Legacy)**: ethers.js v6 (currently not actively used)

### Project Structure

The codebase uses a feature-based organization:

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── api/chat/     # Gemini AI chat endpoint
│   ├── treasury/     # Treasury/wallet view
│   ├── invoices/     # Invoice management
│   ├── budgets/      # Budget tracking
│   └── chat/         # AI assistant chat interface
├── components/       # React components organized by feature
│   ├── ui/           # shadcn/ui base components (Card, Button, etc.)
│   ├── chat/         # Chat interface components
│   ├── treasury/     # Treasury-specific components
│   ├── dashboard/    # Dashboard widgets
│   ├── invoices/     # Invoice components
│   └── budgets/      # Budget components
├── context/          # React Context providers
│   └── auth-context.tsx  # Authentication and treasury state management
├── lib/              # Core utilities and business logic
│   ├── actions.ts    # Server actions (Next.js "use server")
│   ├── treasury.ts   # TreasuryService class - MNEE wallet operations
│   ├── mnee.ts       # MNEE SDK initialization
│   ├── web3.ts       # ethers.js configuration (legacy)
│   └── utils.ts      # General utilities (cn, etc.)
├── hooks/            # Custom React hooks (currently empty)
└── types/            # TypeScript type definitions
```

### Key Architecture Patterns

**1. MNEE Wallet Integration (Treasury System)**

The treasury system is the core financial engine:

- `lib/mnee.ts`: Initializes MNEE SDK with environment config (sandbox/production)
- `lib/treasury.ts`: `TreasuryService` class manages HD wallet operations
  - Uses mnemonic from `TREASURY_MNEMONIC` environment variable
  - Derivation path: `m/44'/236'/0'`
  - Handles balance queries and transfers
  - Amounts in MNEE units (not atomic satoshis)
- `lib/actions.ts`: Server actions wrap treasury methods for client consumption
  - `getTreasuryBalance()` - Returns serializable balance object
  - `getTreasuryAddress()` - Gets wallet address
  - `sendTreasuryTransaction(to, amount)` - Executes transfers
- `context/auth-context.tsx`: `AuthProvider` manages treasury state globally
  - Provides `treasury` object with `address`, `balance`, `refresh()`, `send()`
  - Mock user authentication (always authenticated as "Agent Admin")

**2. AI Chat Agent**

- `app/api/chat/route.ts`: Next.js Route Handler for Gemini API
  - Accepts message history, forwards to Gemini with proper role mapping
  - Role transformation: `agent` → `model`, preserves `user`
  - Ensures chat history starts with user message (Gemini requirement)
- `components/chat/chat-interface.tsx`: Client-side chat UI
- `src/app/chat/page.tsx`: Chat page with AI assistant

**3. Server vs Client Components**

- Server Components: Default for pages in `app/` directory
- Client Components: Marked with `'use client'` directive
  - All components using React hooks (useState, useContext, useEffect)
  - All interactive UI components
  - `AuthProvider` and any context consumers
- Server Actions: Functions marked with `'use server'` in `lib/actions.ts`
  - Cannot return non-serializable data (e.g., BigInt, class instances)
  - Used as bridge between client and server-only operations (treasury access)

**4. Path Aliases**

TypeScript path mapping is configured:
- `@/*` maps to `./src/*` (e.g., `@/lib/utils`, `@/components/ui/button`)

## Environment Variables

Required in `.env`:

```
GEMINI_API_KEY=          # Google Gemini API key for AI chat
MNEE_API_KEY=            # MNEE platform API key
NEXT_PUBLIC_MNEE_ENV=    # "sandbox" or "production"
TREASURY_MNEMONIC=       # HD wallet mnemonic (12-24 words)
```

Note: `NEXT_PUBLIC_*` variables are exposed to the browser. Keep sensitive keys (MNEE_API_KEY, TREASURY_MNEMONIC) without the prefix.

## Important Patterns

**Adding New Features:**
1. For treasury operations, extend `TreasuryService` in `lib/treasury.ts`
2. Wrap with server action in `lib/actions.ts` if needed by client
3. Access via `useAuth().treasury` in client components

**MNEE SDK Usage:**
- All amounts are in MNEE units (decimal), not atomic units
- Transfer format: `[{ address: string, amount: number }]`
- Balance returns `{ confirmed, unconfirmed, total }` but currently only uses `decimalAmount`
- Always broadcast transactions: `{ broadcast: true }`

**Type Safety:**
- Never use `any` for public-facing types
- Use proper typing for MNEE SDK responses (import from `@mnee/ts-sdk`)
- Server action return types must be JSON-serializable

**Styling:**
- Use Tailwind utility classes
- shadcn/ui components are in `components/ui/`
- Use `cn()` from `@/lib/utils` for conditional class merging

## Current State

- Treasury integration is functional with MNEE SDK
- AI chat agent operational with Gemini
- Mock authentication (no real login flow)
- ethers.js imported but not actively used (legacy from initial setup)
- Dashboard shows treasury balance and transactions
- Invoice and budget features are UI scaffolding (not fully implemented)
