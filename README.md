# Credimatch 💳

A fintech web application for credit card recommendations, comparison, and subscription management — with integrated Razorpay payments.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, TailwindCSS |
| Backend | Node.js, Express |
| Database | PostgreSQL (optional, falls back to local JSON store) |
| Cache | Redis (optional) |
| Payments | Razorpay |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional, for Postgres + Redis)

---

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd Credit-Card-
```

### 2. Set up Backend environment

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
PORT=4000
JWT_SECRET=any_strong_secret_here

# PostgreSQL (optional — app works without it)
DB_USER=postgres
DB_HOST=localhost
DB_NAME=credimatch_db
DB_PASSWORD=your_db_password
DB_PORT=5432

# Razorpay — get keys from https://dashboard.razorpay.com
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=any_webhook_secret_string
```

### 3. Set up Frontend environment

```bash
cd frontend
cp .env.local.example .env.local    # or create manually
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 4. Start services (optional — Docker)

```bash
# From project root
docker compose up -d
```

This starts PostgreSQL on port `5432` and Redis on port `6379`.  
**The app works without Docker** using a local JSON fallback store.

### 5. Run the Backend

```bash
cd backend
npm install
node src/server.js
```

Backend runs at → `http://localhost:4000`

### 6. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:3000`

---

## Demo Login

| Field | Value |
|---|---|
| Email | `test@credimatch.com` |
| Password | `password` |

> The demo user is auto-seeded when Postgres is unavailable (fallback mode).

---

## Project Structure

```
Credit-Card-/
├── backend/
│   ├── src/
│   │   ├── db/          # DB connection + fallback JSON store
│   │   ├── middleware/  # JWT auth middleware
│   │   ├── routes/      # auth, cards, subscription, timing
│   │   ├── services/    # cron jobs
│   │   └── server.js
│   ├── .env.example     # Copy to .env and fill values
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js pages
│   │   └── components/  # Navbar, Footer, Razorpay checkout, etc.
│   └── package.json
│
├── docker-compose.yml   # Postgres + Redis
└── README.md
```

---

## Razorpay Webhook Setup

1. Go to [Razorpay Dashboard → Webhooks](https://dashboard.razorpay.com/app/webhooks)
2. Add URL: `https://your-domain.com/api/subscription/webhook`
3. Set the secret to match `RAZORPAY_WEBHOOK_SECRET` in your `.env`
4. Subscribe to event: `subscription.activated`

---

## Notes

- `backend/users.json` is auto-generated at runtime (gitignored). Do not commit it.
- Without Docker, the app uses a JSON file store instead of PostgreSQL — suitable for local dev.
- For production, make sure to use a real PostgreSQL instance and rotate all keys.
