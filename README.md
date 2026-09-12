# GoEato - Full-Stack Food Delivery Platform

A production-grade, full-stack food delivery application built with **React 19**, **Vite**, **Node.js**, **Express**, **MongoDB**, and **Socket.io**.

---

## ⚡ Quick Start (One Command)

1. **Start MongoDB**:
   Ensure MongoDB is running locally on port `27017` (or via Windows Service `MongoDB`).

2. **Seed Initial Data & Demo Accounts**:
   ```bash
   npm run seed
   ```

3. **Start Entire Platform (Backend + Frontend)**:
   ```bash
   npm run dev
   ```
   * **Frontend Application**: [http://localhost:5173](http://localhost:5173)
   * **Backend API**: [http://localhost:5000](http://localhost:5000)
   * **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 👤 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `user@goeato.local` | `User123!` |
| **Admin** | `admin@goeato.local` | `Admin123!` |

*(Quick-fill buttons for both accounts are built directly into the Login page!)*

---

## 🚀 Key Features

* **Real-time Order Stepper**: Live delivery tracking (`Placed` ➔ `Preparing` ➔ `On The Way` ➔ `Delivered`) powered by Socket.io.
* **Modern Design System**: Built with `Plus Jakarta Sans`, vibrant coral `#FF5200` palette, responsive dish grids, dietary indicators (Veg/Non-Veg), and micro-animations.
* **Smart Cart & Checkout**: Interactive quantity steppers, free delivery thresholds, address tags (Home, Work, Other), and payment simulation (COD, UPI).
* **Admin Management Portal**: Real-time order fulfillment pipeline with 1-click status progression and instant inventory toggling (`In Stock` / `Sold Out`).
* **Containerized Deployment**: Ready for Docker via `docker-compose up`.

---

## 📂 Project Architecture

```
goeato/
├── GOEATO-frontend/       # React 19 + Vite client (SocketContext, ToastContext, Modern UI)
├── goeato-backend/        # Express + Mongoose + Socket.io API
├── docker-compose.yml     # Multi-container orchestration (Mongo, Backend, Frontend)
├── package.json           # Root orchestration using concurrently
└── README.md
```
