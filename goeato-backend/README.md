# GoEato Backend

Node.js + Express + MongoDB + Socket.io API for GoEato food delivery.

## Features
- JWT auth (`POST /api/auth/signup,login`, `GET /api/auth/me`) with validation + rate-limit
- Restaurants + FoodItems CRUD with search/pagination (`GET /api/restaurants?search=&cuisine=`, `GET /api/food-items?search=&veg=&category=`)
- Orders with server-side total recalc, status enum, user + admin routes
- Realtime `orderUpdate` via Socket.io rooms (`user:{id}`, `admins`)

## Setup
1. `git clone https://github.com/Gurunathgp/goeato-backend.git`
2. `npm install`
3. `cp .env.example .env` and set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
4. Dev: `npm run dev` | Prod: `npm start`
5. Seed demo data: `npm run seed` (optional `ADMIN_EMAIL/ADMIN_PASSWORD` in `.env`)
6. Health: `GET /health`
