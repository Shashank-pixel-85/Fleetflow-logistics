# FleetFlow — Logistics & Fleet Tracking Platform

FleetFlow is a responsive logistics operations dashboard built with React, TypeScript, Tailwind CSS, React Router, and Recharts. It demonstrates day-to-day management of vehicles, drivers, shipments, tracking, and operational alerts using realistic sample data.

> **Demo note:** This is a frontend assignment, not a connected fleet service. Locations, routes, KPIs, and alerts are sample data. The map-style tracking screen is illustrative and does not use live GPS or an external maps API.

## Features

### Operations dashboard
- Vehicle, available-driver, active-shipment, and delivery-rate KPI cards.
- Delivery performance chart and shipment-status breakdown.
- Fleet status overview, operational alerts, and active shipments.
- Dashboard metrics update when records are added, edited, or removed.

### Vehicle management
- Add, edit, view, and remove vehicles.
- Registration, model, type, status, assigned driver, location, fuel, odometer, and next service date.
- Search by registration/model/type/location and filter by status or location.
- Vehicle detail/history panel showing latest recorded activity.

### Driver management
- Add, edit, view, and remove driver records.
- Contact number, license, availability, assigned vehicle, location, rating, delivery count, and on-time rate.
- Search and filter by driver status; click the phone action to start a call on supported devices.

### Shipment management
- Create, edit, view, and remove shipments.
- Customer, pickup and delivery locations, driver/vehicle assignments, ETA, distance, priority, and status.
- Search and filter by status, route location, and creation date.
- Shipment detail panel summarizes its current state and record history.

### Tracking and alerts
- Selectable vehicle markers, route line, pickup/delivery points, zoom controls, current location, fuel, driver, shipment, and ETA.
- Notifications for delayed shipments, maintenance, and delivery updates.
- Mark notifications as read, dismiss alerts, and see the current open-alert summary.

### Usability and architecture
- Responsive desktop, tablet, and mobile layouts.
- Shared components, typed data models, reusable forms, browser form validation, confirmation prompts, reusable loading/error/empty state components, and accessible action labels.
- Demo changes persist in browser local storage. Use **Settings → Reset data** to restore the original records.
- API service boundary is separated from UI code so mock data can be replaced with REST endpoints later.

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (with a small custom CSS layer for the dashboard UI)
- React Router
- Recharts
- Lucide React icons

## Getting started

Requires Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The production output is written to `dist/`.

## Deploy

### Vercel
1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Use `npm run build` as the build command and `dist` as the output directory.

### Netlify
1. Import the GitHub repository in Netlify.
2. Use `npm run build` as the build command and `dist` as the publish directory.
3. The `public/_redirects` file configures SPA route fallback so nested routes work after refresh.

## Project structure

```text
src/
├── components/       # Layout, modal, badges, toolbar, stat and empty-state components
├── context/          # Shared fleet state and browser persistence
├── data/             # Seed/demo records and chart data
├── hooks/            # Reusable React hooks
├── pages/            # Dashboard, Vehicles, Drivers, Shipments, Tracking, Notifications, Settings
├── services/         # API-ready service boundary
├── types/            # TypeScript data models
├── utils/            # Small formatting helpers
├── App.tsx
├── main.tsx
└── index.css
```

## API integration notes

Current pages use the typed demo records in `src/data/mockData.ts` through `src/context/FleetContext.tsx`. The context centralizes updates and persists demo changes in local storage. `src/services/api.ts` contains the API boundary for future integration. When a backend is available, replace the mock service functions with `fetch`/Axios calls and load records from endpoints such as:

- `GET /api/vehicles`, `POST /api/vehicles`, `PATCH /api/vehicles/:id`, `DELETE /api/vehicles/:id`
- `GET /api/drivers`, `POST /api/drivers`, `PATCH /api/drivers/:id`, `DELETE /api/drivers/:id`
- `GET /api/shipments`, `POST /api/shipments`, `PATCH /api/shipments/:id`, `DELETE /api/shipments/:id`
- `GET /api/alerts`

The current UI intentionally does not claim live GPS, authentication, real notifications, or real backend persistence.
