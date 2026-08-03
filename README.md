# Savings Tracker

A cross-platform desktop app for tracking income and expenses, automatically
setting aside a percentage of income into savings, and working toward named
savings goals.

## What it does

- **Income** — log payments with a source, category, and amount
- **Expenses** — track fixed and one-off costs, marked recurring or one-time
- **Savings rule** — set a percentage of income to auto-allocate to savings
- **Goals** — create named goals with a target amount and track progress
- **Dashboard** — current month's income, expenses, savings, and leftover
  discretionary spend, broken down in a donut chart
- **History** — past months side by side, with a savings-rate trend line

## Tech Stack

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

- **tauri-plugin-sql** — SQLite storage in the app's local data directory, schema applied via migrations on first launch
- **Recharts** — the dashboard donut and savings-rate trend line

Each feature (income, expenses, goals, settings, dashboard, history) lives in
its own folder under `src/features/` with its own `api.ts`, so new features
(multi-currency, budget alerts, recurring-income automation) can be added
without touching the others.

## Database

| Table | Purpose |
|---|---|
| `income_entries` | date, source, category (salary/csn/freelance/gear_sale/other), amount |
| `expenses` | name, amount, recurring flag, date |
| `goals` | name, target amount, current amount, created date |
| `settings` | savings percentage applied to income |

All amounts are SEK, formatted as `9 500 kr` via `Intl.NumberFormat("sv-SE", ...)`.

## Getting started

Requires Node.js, Rust/Cargo, and the [Tauri prerequisites](https://tauri.app/start/prerequisites/)
for your OS (on Linux, that includes `webkit2gtk-4.1`).

```bash
npm install
npm run tauri dev
```

## Building installers

```bash
npm run tauri build
```

Produces the native installer for whatever OS you run it on — `.deb`/`.AppImage`
on Linux, `.msi`/NSIS `.exe` on Windows, `.app`/`.dmg` on macOS — all under
`src-tauri/target/release/bundle/`. Tauri doesn't cross-compile installers, so
building for all three platforms means running this on a machine (or CI
runner) of each.
