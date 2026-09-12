# GoEato

GoEato is a full-stack food-delivery application for discovering local kitchens, building a restaurant-specific basket, placing an order, and following its status in real time.

## What is included

- Customer discovery experience with search, dietary filters, restaurant pages, responsive basket, and checkout
- JWT authentication with customer and admin roles
- Restaurant and menu management for administrators
- Server-authoritative order pricing: subtotal, delivery fee, platform fee, tax, and total
- One-restaurant-per-order protection in both the client and API
- Live order-status updates through Socket.IO
- Order workflow: `placed` -> `preparing` -> `delivering` -> `delivered`, with controlled cancellation
- MongoDB-backed API with validation, rate limiting, and CORS support for local Vite ports

## Technology

| Area | Stack |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, Socket.IO Client |
| Backend | Node.js, Express 5, Mongoose, Socket.IO |
| Database | MongoDB |
| Authentication | JSON Web Tokens and bcrypt |

## Repository layout

```text
goeato/
├── GOEATO-frontend/       React/Vite application
├── goeato-backend/        Express/MongoDB API
├── docker-compose.yml     Local service definition (Dockerfiles are not included)
├── package.json           Root development, build, test, and seed scripts
└── README.md
```

This is a single Git repository. The frontend and backend folders are not separate repositories.

## Prerequisites

- Node.js 20 or later
- npm
- MongoDB running locally, or a reachable MongoDB connection string

## Local setup

1. Install all workspace dependencies:

   ```bash
   npm run install:all
   ```

2. Configure the backend:

   ```bash
   cd goeato-backend
   copy .env.example .env
   ```

   Set `MONGO_URI` and a strong `JWT_SECRET` in `goeato-backend/.env`.

3. Configure the frontend if the API is not running on port 5000:

   ```bash
   cd GOEATO-frontend
   copy .env.example .env
   ```

4. Seed example restaurants, dishes, and local demo accounts:

   ```bash
   npm run seed
   ```

5. Start frontend and backend together from the repository root:

   ```bash
   npm run dev
   ```

The frontend normally opens at `http://localhost:5173`. If that port is busy, Vite may select `5174` or `5175`; the development backend accepts those local origins automatically. The API runs at `http://localhost:5000`.

Useful endpoints:

- Frontend: `http://localhost:5173`
- API health check: `http://localhost:5000/health`
- API root: `http://localhost:5000`

Run only one root `npm run dev` process at a time. Starting a separate `node index.js` or backend dev server while it is already running will cause an `EADDRINUSE` error on port 5000.

## Demo accounts

Seeding creates the following local development accounts unless overridden through environment variables:

| Role | Email | Password |
| --- | --- | --- |
| Customer | `user@goeato.local` | `User123!` |
| Administrator | `admin@goeato.local` | `Admin123!` |

Change these credentials before using any shared environment.

## Scripts

Run these commands from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the backend and Vite frontend together |
| `npm run build` | Create a production frontend build |
| `npm test` | Run backend tests |
| `npm run seed` | Seed MongoDB with example data and accounts |
| `npm run install:all` | Install root, backend, and frontend dependencies |

## Order and payment notes

The API calculates all order totals from current menu prices. The client never supplies an amount that is trusted by the server.

The checkout interface currently supports COD and a simulated UPI selection. UPI/card payments are not connected to a payment gateway, so a payment provider, verified webhook flow, and payment-status model are required before treating digital payments as live.

## Testing

```bash
npm test
npm run build
```

The current test suite covers validation and pricing-policy behaviour. API integration coverage is the next recommended testing investment.

## Environment variables

Backend (`goeato-backend/.env`):

```dotenv
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/goeato
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Frontend (`GOEATO-frontend/.env`):

```dotenv
VITE_API_URL=http://localhost:5000
```

Never commit real environment files or credentials.
