# BONLOOP — Web3 Token Launchpad DApp

Dark-themed token launchpad / rebate DApp built with **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + Zustand + Drizzle ORM (PostgreSQL)**.

Every buy through a launch pool receives instant bonus tokens; a share of trading fees is routed back to holders as ETH/USDC payouts.

## Fitur

- **Discover** — trending token strip, featured launch, buy preview (bonus slider), launch-type comparison.
- **Launch Token** — form pembuatan token baru (nama, ticker, supply, bonus rate, payout rate, social links).
- **Portfolio** — holdings, avg buy price, hold multiplier, unclaimed rewards.
- **Activity** — feed transaksi (Buy / Sell / Launch / Payout).
- **Rewards** — klaim payout ETH & USDC.
- **How It Works** — panduan alur launchpad.
- **API** — `POST /api/launch`, `POST /api/swap`, `POST /api/claim`, `GET /api/state`, `GET /api/health`.

## Menjalankan lokal

Butuh PostgreSQL. Cara tercepat lewat Docker:

```bash
docker run -d --name bonloop-pg \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=bonloop \
  -p 5432:5432 postgres:16-alpine
```

Lalu:

```bash
cp .env.example .env.local     # DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/bonloop
npm install
npm run dev                    # http://localhost:3000
```

Skema tabel dibuat otomatis saat pertama kali `GET /api/state` dipanggil, beserta seed data awal.

## Scripts

| Command | Keterangan |
|---|---|
| `npm run dev` | dev server (port 3000) |
| `npm run build` | production build |
| `npm start` | jalankan hasil build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Struktur

```
src/
  app/            route + API handlers
  components/     AppShell, DiscoverView, LaunchTokenView, PortfolioView, ...
  db/             drizzle client + schema
  lib/            db-init (auto migrate + seed), seed-data
  store/          zustand store (useRebateStore)
```

## Env

| Variable | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | ya | connection string PostgreSQL |

## Catatan

Data on-chain, wallet connect, dan pricing di UI ini masih simulasi/seed — semua angka tersimpan di Postgres lokal, belum terhubung ke RPC Robinhood Chain sungguhan.
