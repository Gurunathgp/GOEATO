# GoEato Frontend

Modern, high-performance React 19 + Vite web client for the GoEato food delivery platform.

## Features
- **Modern Delivery UX**: Inspired by leading delivery platforms, with vibrant design tokens, responsive CSS grid, and `Plus Jakarta Sans` typography.
- **Visual Order Tracking Stepper**: Real-time status progress (`Placed` ➔ `Preparing` ➔ `On The Way` ➔ `Delivered`) powered by Socket.io without page refreshes.
- **Dietary Badges & Quantity Controls**: Official Veg / Non-Veg indicators and dynamic on-card quantity steppers (`- [qty] +`).
- **Interactive Cart & Checkout**: Multi-step checkout with address tag presets (Home, Work, Other) and instant payment selection (COD / UPI).
- **Admin Management Portal**: Real-time order fulfillment pipeline with 1-click status advancement and instant inventory toggle (`In Stock` / `Sold Out`).
- **Toast Notifications**: Floating feedback for cart operations, live order events, and system alerts.

## Scripts
- `npm run dev`: Starts local Vite development server on [http://localhost:5173](http://localhost:5173)
- `npm run build`: Generates optimized production bundle in `dist/` with vendor chunk splitting
- `npm run preview`: Previews the production build locally
