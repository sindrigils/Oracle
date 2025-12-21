# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Oracle is a personal finance management application for tracking household finances including budgets, expenses, income, investments, and loans. Users create households with members to manage shared finances.

## Tech Stack

- **Backend**: FastAPI + SQLAlchemy ORM + PostgreSQL + Alembic migrations
- **Frontend**: Next.js 16 + React 19 + TanStack Query + Axios + Tailwind CSS 4

## Development Commands

### Backend (run from `/api` directory)
```bash
uv run python run_dev.py        # Start dev server on port 8000
uv run ruff check .             # Lint
uv run ruff format .            # Format
uv run alembic upgrade head     # Run migrations
uv run alembic revision --autogenerate -m "message"  # Create migration
```

### Frontend (run from `/ui` directory)
```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run lint     # ESLint
npm run tsc      # TypeScript check
```

### Database
```bash
docker-compose up -d  # Start PostgreSQL (port 5434)
```

## Architecture

### Backend Structure (`/api`)
- `api/v1/` - Route handlers (versioned API endpoints)
- `services/` - Business logic layer (injected via FastAPI DI)
- `models/` - SQLAlchemy ORM models
- `schemas/` - Pydantic request/response schemas
- `db/base.py` - Base model with auto-generated `short_id` field
- `middleware/` - Case conversion (snake_case <-> camelCase), session refresh

**Authentication**: HTTP-only cookie sessions with automatic refresh via middleware.

**Authorization pattern**: Use `get_current_user`, `verify_household_access`, and `get_user_member` dependencies from `api/dependencies.py` to protect routes.

### Frontend Structure (`/ui/src`)
- `app/` - Next.js App Router pages
- `api/` - API layer organized by domain (e.g., `auth/`, `budget/`, `members/`)
  - `requests.ts` - Axios request functions
  - `hooks.ts` - TanStack Query hooks (always use hooks, never call requests directly)
  - `types.ts` - TypeScript types for the domain
- `core/components/` - Reusable UI components
  - `ui/` - Base components (Button, Card, Input, Modal, etc.)
  - `layout/` - Header, Footer
- `lib/` - Utilities (axios instance, react-query client, helpers)

**Path aliases**: `@/*`, `@/core/*`, `@/api/*`, `@/lib/*`, `@/types/*`

### Data Model

Key entities: User -> Household -> Members. Members can have Expenses, Income, Investments, Loans. MonthlyBudget and ExpenseCategory belong to Household.

## Code Conventions

### Backend
- Ruff handles linting and formatting (line length 120)
- FastAPI Depends() pattern for DI (B008 rule ignored)
- Always verify resource ownership before operations

### Frontend
- Prefer reusable components from `@/core/components`
- API requests go through TanStack Query hooks only
- Axios instance auto-converts between camelCase (frontend) and snake_case (backend)
