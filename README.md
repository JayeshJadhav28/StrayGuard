# StrayGuard

StrayGuard is a monorepo for an AI-assisted stray animal road-safety system. It combines a Flutter mobile app, a Next.js dashboard, an Express/Prisma backend, ESP32 firmware simulation, and ML training and export tooling.

## Workspace Layout

- `apps/mobile` - Flutter mobile app
- `apps/dashboard` - Next.js operator dashboard
- `apps/backend` - Express API with Prisma and PostgreSQL
- `apps/hardware-sim` - ESP32 PlatformIO firmware simulator
- `packages/shared-types` - shared TypeScript types
- `ml` - training notebooks, configs, and export scripts
- `docs` - architecture, deployment, hardware, API, and testing notes
- `scripts` - database setup and seed helpers

## Prerequisites

- Node.js 18+ and npm
- Flutter SDK 3.9+
- Python 3.10+ for ML workflows
- PlatformIO for the hardware simulator
- PostgreSQL for the backend

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the local values.
3. Prepare the database with `npm run db:setup`.
4. Start the workspace with `npm run dev`.

## Common Commands

- `npm run build`
- `npm run test`
- `npm run db:seed`
- `cd apps/backend && npm run dev`
- `cd apps/dashboard && npm run dev`
- `cd apps/mobile && flutter run`
- `cd apps/hardware-sim && pio run --target upload`

## Notes

Turborepo orchestrates the JavaScript and TypeScript workspaces. Flutter, PlatformIO, and ML outputs are intentionally ignored in the root `.gitignore` so only source and configuration are pushed to GitHub.
