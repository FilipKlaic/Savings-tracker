# Savings Tracker

A cross-platform desktop app for tracking income, expenses, an automatic
savings rule, and named savings goals. Built with Tauri, React, TypeScript,
Tailwind CSS, SQLite, and Recharts.

## Stack

- **Backend**: Rust (Tauri 2)
- **Frontend**: React + TypeScript + Tailwind CSS v4
- **Storage**: SQLite via `tauri-plugin-sql`, stored in the app's local data
  directory as `savings-tracker.db`. Schema is applied automatically on first
  launch via the migration in `src-tauri/migrations/001_initial.sql`.
- **Charts**: Recharts (monthly breakdown donut, savings-rate trend line)

## Project layout

```
src/
  types/          shared TS types (IncomeEntry, Expense, Goal, Settings, MonthSummary)
  lib/            db singleton, SEK/date formatting, theme hook, month-summary math
  components/     Card, Modal, Sidebar, ThemeToggle, StatTile, shared form styles
  features/
    income/       income entry form, list, CRUD API
    expenses/     expense form, list (recurring/one-time), CRUD API
    goals/        goal form, progress cards, CRUD API
    settings/     savings percentage setting
    dashboard/    current-month overview + breakdown donut chart
    history/      past months table + savings-rate trend line chart
src-tauri/
  migrations/     SQL migrations run by tauri-plugin-sql on startup
  src/lib.rs      Tauri builder, plugin registration, migration list
```

Each feature folder owns its `api.ts` (SQL access) independently of the UI, so
new features (multi-currency, budget alerts, recurring-income automation) can
be added as new folders without touching existing ones.

## Development

Prerequisites: Node.js, Rust/Cargo, and the Tauri OS prerequisites
(https://tauri.app/start/prerequisites/) — on Linux this includes
`webkit2gtk-4.1` and friends.

```bash
npm install
npm run tauri dev
```

## Building installers

```bash
# Current platform (produces the platform-native bundle types below)
npm run tauri build
```

- **Linux** → `.deb` and `.AppImage` in `src-tauri/target/release/bundle/`
- **Windows** → `.msi` and `.exe` (NSIS) in `src-tauri\target\release\bundle\` (build on/for Windows)
- **macOS** → `.app` and `.dmg` in `src-tauri/target/release/bundle/` (build on/for macOS)

Tauri only cross-compiles installers for the OS it runs on, so producing all
three requires running `npm run tauri build` on a machine (or CI runner) of
each target OS. `tauri.conf.json` has `bundle.targets` set to `"all"`, so each
platform's native installer types are produced automatically.

## Data model

| Table            | Columns |
|-------------------|---------|
| `income_entries`   | id, date, source, category (salary/csn/freelance/gear_sale/other), amount |
| `expenses`         | id, name, amount, recurring, date |
| `goals`            | id, name, target_amount, current_amount, created_date |
| `settings`         | id (always 1), savings_percentage |

All monetary values are stored as `REAL` (SEK) and formatted as `9 500 kr` in
the UI via `Intl.NumberFormat("sv-SE", ...)`.
