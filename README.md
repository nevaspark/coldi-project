# Coldi.ai — Home Assessment (Multi-tenant Voice Prototype Admin & Client UI)

This repo contains a **minimal multi-tenant web app** that connects to simulated Retell bots and provides basic white-label functionality with real‑time updates, aligned to the assessment requirements.

## Stack
- **Frontend:** React (Vite) + TailwindCSS + Axios + SSE (for realtime)
- **Backend:** Node.js (Express) + JWT Auth + Sequelize ORM
- **DB:** SQLite (file-based `database.sqlite` for easy setup)
- **Realtime:** Server-Sent Events (SSE)

> SQLite is chosen for ease of review. You can switch to Postgres by updating `backend/src/db.js` and `sequelize` config.

## Features Mapped to Requirements
- **Tenants**: Client A and Client B seeded with unique Bot IDs.
- **Users**: Admin, Client A user, Client B user with roles and hashed passwords.
- **Client Dashboard**:
  - Shows Bot ID
  - Start/End simulated calls
  - Live duration & live cost
  - Metrics: total calls, total minutes, current balance
  - Block new calls if balance < $0
- **Admin Panel**:
  - Table of tenants: Name, Bot ID, Total Calls, Total Minutes, Current Balance
  - Adjust balances (+/−) with a reason (reflected live in client dashboards)
- **Billing Rules**:
  - Starting balance $200
  - Cost per minute $0.40 (min $0.40 per call under 60s)
  - Duration billed by exact minutes (e.g., 90s => 1.5 min => $0.60)
- **Security**:
  - Tenant isolation enforced on server (role-guarded routes). Clients can only access their own tenant data.
- **Persistence**:
  - All entities persisted in SQLite file, survives refresh.
- **Docs**:
  - This README + inline comments.
  
## Quick Start
### 1) Backend
```bash
cd backend
npm run dev    # starts API on http://localhost:5001
```
Environment variables (optional, see `.env.example`):
```
PORT=5001
JWT_SECRET=super-secret-change-me
```
### 2) Frontend
```bash
cd frontend
npm run dev -- --host    # starts UI on http://localhost:5173
```
### 3) Logins
- **Admin**: `admin@coldi.ai` / `Admin123!`
- **Client A**: `a@client.local` / `ClientA123!`
- **Client B**: `b@client.local` / `ClientB123!`

## Demo Flow
1. Login as **Client A** → See bot and metrics → **Start Test Call** → live duration & cost → **End Call** → metrics/balance update in real-time
2. Login as **Admin** → Adjust Client A balance (+/- with reason) → Client A dashboard reflects updates live
3. Login as **Client B** → Sees only own bot & metrics

## Switching to Postgres (Optional)
- Install `pg pg-hstore` and run a Postgres instance.
- Update `backend/src/db.js` with Postgres config:
```js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});
```
- Run `npm run seed` again to migrate + seed.

## Notes
- The "Retell bot" is simulated; the backend `POST /tenant/:tenantId/calls` starts a call and `.../end` ends it. SSE notifies subscribers.
- SSE endpoint: `GET /events?tenantId=<id>` (clients) or `GET /events` (admin).
