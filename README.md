# Neocube Realty — Frontend (UI-only build)

A React + Tailwind frontend for a Pune real estate + broker CRM platform, with
three roles: Customer (public site), Broker, and Admin. This is a UI-only
build — all data is mock data stored in `localStorage`, structured so it can
be swapped for real API calls to a Spring Boot + MySQL backend later.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build a production bundle:

```bash
npm run build
npm run preview
```

## How the auth flow works

- `/signup` creates an **Admin** account only. There is no public broker
  signup — brokers are created by an Admin from inside the Admin dashboard
  (Brokers page → "Add Broker").
- `/login` is shared by everyone. After login, the app checks the account's
  role and redirects: Admin → `/admin/dashboard`, Broker → `/broker/dashboard`.
- Every broker only ever sees leads/listings where `brokerId` matches their
  own login — the dashboard layout is identical for every broker, only the
  data shown changes.
- A new broker created by Admin logs in and sees the same dashboard design
  with empty stats, since nothing is assigned to them yet.

## Demo logins

| Role   | Email                | Password   |
|--------|-----------------------|------------|
| Admin  | priya@neocube.com     | admin123   |
| Broker | rahul@neocube.com     | broker123  |
| Broker | amit@neocube.com      | broker123  |

Try logging in as Rahul, then logging out and logging in as Amit — you'll
see each broker only has their own leads and listings.

## Project structure

```
src/
  components/     shared UI: logo, dashboard shell, status badges, stat cards
  lib/             auth.jsx (auth context), mockData.js (seeded data)
  pages/
    Login.jsx, Signup.jsx
    customer/       public site: Home, Listing, PropertyDetails, EmiCalculator
    admin/          Admin dashboard pages
    broker/         Broker dashboard pages
```

## Connecting a real backend later

Replace the functions in `src/lib/auth.jsx` (`login`, `signupAdmin`,
`addBroker`) with real `fetch`/`axios` calls to your Spring Boot API, and
swap the static arrays in `src/lib/mockData.js` for API responses
(`GET /api/properties`, `GET /api/leads`, etc.). The rest of the UI —
routing, role guards, filtering logic — doesn't need to change.
