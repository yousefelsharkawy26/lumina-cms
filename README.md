# 🛒 E-Commerce Platform

## 📝 Description

A comprehensive, full-stack e-commerce platform built with modern web technologies. This application provides a seamless shopping experience with a focus on responsive design, fast performance, and secure transactions. It includes both a customer-facing storefront and a secure admin dashboard for store management.

## ✨ Features

- **User Authentication**: Secure user registration, login, and session management.
- **Product Management**: Browse, search, and view detailed product pages.
- **Shopping Cart**: Dynamic cart management with real-time updates.
- **Secure Checkout**: Integrated payment processing via Stripe.
- **Admin Dashboard**: Dedicated portal for administrators to manage inventory, track orders, and view user analytics.
- **Responsive Design**: Fully mobile-responsive UI optimized for all screen sizes.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: Neon PostgreSQL
- **Payment Gateway**: Stripe API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Postgres database (Neon)
- Stripe account

### Installation
1. Clone the repository
2. Run `npm install` in the root folder to install root dev dependencies.
3. Setup the environments for server and client (see `.env.example` in both folders).
4. Start both environments simultaneously:

```bash
npm run dev
```

This will concurrently run the Vite React app at `http://localhost:5173` and the Express Backend at `http://localhost:4000`.
