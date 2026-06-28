# Brighte Eats

A full-stack expression-of-interest app built with Node.js (Express) + React. Customers can register interest in Brighte Eats services (delivery, pickup, payment), and staff can view submitted leads in a live list.

---

## How to run

**Prerequisites:** Node.js v18+ and npm installed.

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd brighte-eats

# 2. Install all dependencies (root + backend + frontend)
npm run install:all

# 3. Start both servers with one command
npm run dev
```

- API: http://localhost:3001
- App: http://localhost:5173

**Run tests:**
```bash
npm test
# or directly:
cd backend && npm test
```

No `.env` file is needed — no secrets or external services required.

---

## File structure

```
brighte-eats/
├── package.json                  # Root scripts (dev, install:all, test)
├── backend/
│   ├── src/
│   │   ├── app.ts                # Express app setup
│   │   ├── index.ts              # Server entry point
│   │   ├── types.ts              # Shared types (Lead)
│   │   ├── store.ts              # (unused prototype)
│   │   ├── routes/
│   │   │   └── leads.ts          # POST /leads, GET /leads
│   │   ├── storage/
│   │   │   ├── ILeadRepository.ts        # Repository interface
│   │   │   └── InMemoryLeadRepository.ts # In-memory implementation
│   │   └── validation/
│   │       └── leadValidator.ts  # Pure validation function
│   └── src/__tests__/
│       ├── leadValidator.test.ts # Unit tests
│       └── leads.test.ts         # Integration tests
└── frontend/
    ├── index.html
    └── src/
        ├── main.tsx              # React entry point
        ├── App.tsx               # Root component
        ├── api.ts                # Fetch helpers
        ├── types.ts              # Shared types (Lead)
        ├── index.css             # Global styles
        └── components/
            ├── RegistrationForm.tsx
            └── LeadsList.tsx
```

---

## What I built

A monorepo with two packages:

**Backend (`/backend`)** — Express + TypeScript REST API
- `POST /leads` — accepts name, email, mobile, postcode, services; validates and saves a lead
- `GET /leads` — returns all leads; supports optional `?service=delivery|pickup|payment` filter
- In-memory storage (array), designed with a repository interface so swapping to a database requires changing one file

**Frontend (`/frontend`)** — React + Vite + TypeScript
- Registration form with client-side validation, loading state, and success/error feedback
- Leads list that fetches from the real API and shows loading, empty, and error states
- Talks to the backend via Vite's dev proxy (no hardcoded localhost URLs in React code)
- Brand accent colour `#00C28C` applied consistently across header, inputs, buttons, and service badges

**Tests (`/backend/src/__tests__`)**
- `leadValidator.test.ts` — 3 unit tests covering happy path, empty fields, and invalid data formats
- `leads.test.ts` — 2 integration tests covering the create-lead happy path and the list-leads endpoint

---

## Why I chose in-memory storage

For this exercise, an in-memory array is the right call for the following reasons.
- Zero setup — no database install, no migrations, no connection strings
- The reviewer can clone and run with one command

The architecture uses a `ILeadRepository` interface, so swapping to a real database means creating a `SqliteLeadRepository` (or Postgres equivalent) that implements the same two methods, and changing **one line** in `app.ts`. No other files change. That's the Open/Closed principle applied directly to storage.

**In a real product I'd use:** PostgreSQL (with a migration tool like Flyway or Knex). SQLite would work for a lightweight single-server deployment.

---

## Basic safety

- **No secrets in Git** — there are no `.env` files, API keys, or credentials in this repo. No external services are used, so none are needed.
- **Input validation** — all user input is validated on both the client and server before being stored or returned (see validation strategy below). The server rejects any request that doesn't meet the schema, regardless of where it comes from.
- **No SQL injection risk** — storage is in-memory (no database queries), so there is no SQL injection surface.
- **CORS** — the API only accepts requests from `localhost:5173` in development. In production this should be an environment variable (noted in TODOs).

---

## Validation strategy (client vs server)

Validation runs on **both** layers, for different reasons:

| Layer | Why |
|-------|-----|
| **Client (React)** | Instant inline feedback without a network round-trip. Fields show errors as soon as the user submits. |
| **Server (Express)** | The API is the contract. Any caller — curl, Postman, another frontend — gets rejected if their input is invalid. Client validation is never a substitute. |

Rules validated on both sides:
- `name` — required, non-empty
- `email` — required, valid format (`user@domain.tld`)
- `mobile` — required, Australian mobile format (04XXXXXXXX — 10 digits starting with 04)
- `postcode` — required, exactly 4 digits (Australian format)
- `services` — at least one selected; all values must be `delivery`, `pickup`, or `payment`

The server-side validator (`validation/leadValidator.ts`) is a pure function — no Express imports, no side effects — making it trivially unit-testable independent of HTTP.

---

## What I'd change or add with more time

- **Real database** — swap `InMemoryLeadRepository` for a SQLite implementation (data survives server restart)
- **Frontend tests** — add Vitest + React Testing Library for form validation and loading state coverage
- **Pagination** — `GET /leads` returns everything; at scale it needs `?page=` and `?limit=`
- **Better mobile validation** — use `libphonenumber-js` to properly validate Australian mobile numbers
- **Rate limiting** — add `express-rate-limit` to prevent flooding the create-lead endpoint
- **Environment-based CORS** — CORS origin is hardcoded to `localhost:5173`; should be an env var for production

---

## TODOs / known gaps

- Data resets on server restart (by design for this scope — see storage section above)
- `store.ts` (an earlier prototype file) is unused and can be deleted
- No authentication — anyone with the URL can submit leads or read the full list
- Mobile regex accepts some technically invalid formats (any 7–15 char string of digits and symbols)

---

## AI Assistance

**Where AI helped:**
- **Architecture design** — a Plan agent designed the full SOLID file structure before any code was written, identifying that the initial Electron scaffold was wrong for a web app exercise
- **TDD scaffolding** — a tester agent wrote all failing tests first (red phase), defining the API contract before the implementation existed
- **Backend implementation** — a backend-dev agent implemented the Express API to make the tests pass (green phase); all 31 tests pass
- **Frontend implementation** — a frontend-dev agent built the React components, wiring the form and list to the real API

**One place where I checked, corrected or rejected AI output:**

The tester agent's initial test for the `leadValidator` used `toContain('postcode is invalid')` — but the actual error message I wanted was `'postcode must be a 4-digit Australian postcode'`. I reviewed the test assertions against the planned error messages before handing off to the implementation agent, corrected the expected string, and confirmed the validator implementation matched. If I hadn't reviewed, the tests would have passed with a less informative error message that wouldn't help a user filling in the form.

**Any limitation I ran into:**

The first scaffold attempt used Electron (desktop app framework) instead of a standard web stack — caught early and rebuilt. AI tools are fast but benefit from explicit upfront constraints (in this case, "web app, not desktop app").
