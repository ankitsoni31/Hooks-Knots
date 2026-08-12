# 🧶 Hooks & Knots

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-purple.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-latest-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

Welcome to the **Hooks & Knots** repository! This is a complete, production-ready full-stack e-commerce application tailored for a premium handmade crochet business.

## 🌟 Overview
Hooks & Knots offers a modern, high-performance web storefront, a robust backend API, and a dedicated admin dashboard. The platform supports browsing curated products, managing a shopping cart, secure checkout via Razorpay, and a secure admin panel for inventory and order management.

## 🚀 Features
- **Public Storefront**: Beautiful, responsive UI with a dynamic shopping cart, product details, and category browsing.
- **Admin Dashboard**: Secure management interface for products, categories, orders, and site settings.
- **Payment Gateway**: Fully integrated with Razorpay for secure online payments.
- **Database Driven**: Relational structure with MySQL, optimized for e-commerce with proper indexing.
- **E2E Tested**: Automated end-to-end testing with Playwright ensures critical user flows are verified.

## 🛠 Tech Stack
- **Frontend & Admin**: React 18, Vite, TailwindCSS v4, TypeScript, Framer Motion, Lucide React, Zustand.
- **Backend**: Node.js, Express, TypeScript, Zod, JWT, Razorpay SDK, MySQL2, Multer.
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
- `database/seed.sql` contains a development-only admin user. Remove this user in production.

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server

### 2. Environment Setup
Copy the example environment files and update them with your actual values:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp admin/.env.example admin/.env
```

### 3. Database Setup
1. Create a MySQL database named `hooks_knots`.
2. Import the schema: 
   ```bash
   mysql -u root -p hooks_knots < database/schema.sql
   ```
3. Load sample data (including default admin):
   ```bash
   mysql -u root -p hooks_knots < database/seed.sql
   ```

> **Default Admin Credentials (from seed.sql):**
> - Email: `admin@example.com`
> - Password: `development-only-password`

### 4. Installation
Install dependencies for all workspaces from the root directory:
```bash
npm install
```

### 5. Running the Application
To run the full stack locally, you need to start the frontend, admin, and backend servers. You can run these commands in separate terminal windows from the root directory:

**1. Start the Backend API:**
```bash
npm run server
```
*API runs on `http://localhost:5000`*

**2. Start the Admin Dashboard:**
```bash
npm run admin
```
*Admin runs on `http://localhost:5174`*

**3. Start the Public Storefront:**
```bash
npm run dev
```
*Storefront runs on `http://localhost:5173`*

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

---
*Crafted with soul.*
