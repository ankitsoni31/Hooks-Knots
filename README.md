# Hooks & Knots

Welcome to the **Hooks & Knots** repository! This is a complete, production-ready full-stack e-commerce application for a premium handmade crochet business.

## 🌟 Overview
Hooks & Knots offers a modern, high-performance web storefront, a robust backend API, and a dedicated admin dashboard. The platform supports browsing curated products, a shopping cart, custom orders, Razorpay integration for seamless checkouts, and a secure admin panel for inventory and order management.

## 🚀 Features
- **Public Storefront**: Beautiful, responsive UI with a dynamic shopping cart, product details, and category browsing.
- **Admin Dashboard**: Secure management interface for products, categories, orders, and site settings.
- **Payment Gateway Integration**: Fully integrated with Razorpay for secure online payments.
- **Database Driven**: Relational structure with MySQL, optimized for e-commerce.
- **E2E Tested**: Automated end-to-end testing with Playwright ensures critical user flows are verified.

## 🛠 Tech Stack
- **Frontend & Admin**: React 18, Vite, TailwindCSS v4, TypeScript, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express, TypeScript, Zod, JWT, Razorpay SDK, MySQL2.
- **Database**: MySQL.
- **Testing**: Playwright.

## 📂 Architecture & Project Structure
The repository is structured as a monorepo:
```
hooks-knots/
├── src/                # Public Storefront (Vite + React)
├── admin/              # Admin Dashboard (Vite + React)
├── backend/            # Express REST API (Node + TS)
├── database/           # MySQL Schema and Seeds
├── tests/              # Playwright E2E Tests
└── playwright.config.ts# Playwright Configuration
```

## 🔒 Security Notes
- Ensure that the `.env` files (including database credentials and JWT secrets) are NEVER committed to version control.
- `database/seed.sql` contains a development-only admin user (`admin@example.com` / `development-only-password`). Remove this user in production.

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server

### 2. Environment Setup
Copy the example environment files and update them with your actual values:
- `cp .env.example .env` (Update `VITE_API_URL` if needed)
- `cp backend/.env.example backend/.env` (Update DB credentials, JWT secret, and Razorpay keys)
- `cp admin/.env.example admin/.env` (Update `VITE_API_URL` if needed)

### 3. Database Setup
1. Create a MySQL database named `hooks_knots`.
2. Import the schema: `mysql -u root -p hooks_knots < database/schema.sql`
3. (Optional) Load sample data: `mysql -u root -p hooks_knots < database/seed.sql`

### 4. Installation
Install dependencies for all workspaces from the root directory:
```bash
npm install
```

### 5. Running the Application
Start the development servers concurrently:
```bash
npm run dev
```
- Storefront: `http://localhost:5173`
- Admin Dashboard: `http://localhost:5174`
- Backend API: `http://localhost:5000`

### 6. Testing
Run the complete Playwright E2E test suite:
```bash
npx playwright test
```

## 💳 Razorpay Payment Flow
1. User checks out via the storefront.
2. Backend creates a Razorpay Order and returns the `order_id`.
3. Frontend initializes the Razorpay Checkout modal.
4. On successful payment, Razorpay redirects the user and sends a webhook to the backend for signature verification and stock deduction.

## 📦 Deployment Requirements
- A Node.js runtime for the backend API.
- Static hosting for the built `dist` folders of the Storefront and Admin panel (e.g., Vercel, Netlify, or Nginx).
- A managed MySQL instance.

---
*Crafted with soul.*
