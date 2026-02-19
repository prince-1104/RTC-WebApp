# Excalidraw-style app with pattern detection and observability

Turborepo containing a drawing app (Excalidraw-style), **pattern detection** on time-series drawing data, and **Prometheus + Grafana** for user-activity and metrics. A dedicated **dashboard** app visualizes metrics and pattern stats.

## What's inside

### Apps

- **web** – Next.js drawing app: canvas (pencil, line, rectangle), real-time sync via WebSocket. Pencil strokes are analyzed and **auto-completed** (e.g. circle, rectangle, triangle, star, apple).
- **http-backend** – REST API (auth, rooms, drawings, pattern-stats). Exposes **Prometheus** `/metrics` on port 3001.
- **ws-backend** – WebSocket server for draw events. Exposes **Prometheus** `/metrics` on port **8081** (HTTP server alongside WS on 8080).
- **dashboard** – Next.js app to **visualize** time series (Prometheus) and pattern-detection stats. Runs on port 3002.

### Packages

- **@repo/pattern-detection** – Geometric shape detection from pencil paths (circle, rectangle, triangle, line, star, apple) and completion-shape generation.
- **@repo/ui**, **@repo/common**, **@repo/db**, **@repo/backend-common**, **@repo/typescript-config**, **@repo/eslint-config** – Shared libs and config.

## Pattern detection

When you draw with the **pencil** tool, the last stroke is analyzed. If it resembles a known shape (circle, rectangle, triangle, line, star, or apple), a **completion** shape is added and broadcast to the room. Detection runs in the client using `@repo/pattern-detection`; completion events are stored as `type: "completion"` in the DB and exposed via **GET /pattern-stats** for the dashboard.

## Time series and observability

- **HTTP backend** (port 3001): `GET /metrics` – request duration, request count, default Node metrics.
- **WS backend** (port 8081): `GET /metrics` – active connections, draw events total (by shape_type), active rooms.
- **Prometheus** scrapes these targets; **Grafana** can use Prometheus as a datasource for dashboards.
- **Dashboard** (port 3002) can query Prometheus for time-series charts and HTTP API for pattern stats.

## Quick start

1. **Install and build**

   ```bash
   cd excalidraw
   pnpm install
   pnpm build
   ```

2. **Environment**

   - Create `.env` in repo root (or in apps that need it) with `DATABASE_URL` (PostgreSQL) and `JWT_SECRET`.
   - For the DB schema: `pnpm --filter @repo/db exec prisma generate` and run migrations as you do today.

3. **Run services**

   - Start **http-backend**: `pnpm --filter http-backend start` (or from `apps/http-backend`: `pnpm start`).
   - Start **ws-backend**: `pnpm --filter ws-backend start`.
   - Start **web**: `pnpm --filter web dev` (port 3000).
   - Start **dashboard**: `pnpm --filter dashboard dev` (port 3002).

4. **Prometheus + Grafana (optional)**

   ```bash
   docker compose -f docker-compose.monitoring.yml up -d
   ```

   - Prometheus: http://localhost:9090 (scrapes `host.docker.internal:3001` and `host.docker.internal:8081`).
   - Grafana: http://localhost:3003 (login `admin` / `admin`). Add Prometheus datasource URL `http://prometheus:9090`.

5. **Dashboard**

   - Open http://localhost:3002. Use **Time series (Prometheus)** for metrics over time and **Pattern detection** for counts and recent completions. Set `NEXT_PUBLIC_HTTP_API`, `NEXT_PUBLIC_WS_METRICS`, and `NEXT_PUBLIC_PROMETHEUS_URL` if your endpoints differ.

## Build and develop

- From repo root: `pnpm build`, `pnpm dev`, `pnpm lint`, `pnpm check-types` as in the standard Turborepo setup.

## Useful links

- [Turborepo](https://turborepo.com)
- [Prometheus](https://prometheus.io)
- [Grafana](https://grafana.com)
