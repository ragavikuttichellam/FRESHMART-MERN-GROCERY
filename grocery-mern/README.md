# 🛒 FreshMart - MERN Grocery Ecommerce Website

A full-stack grocery ecommerce platform built with **MongoDB, Express, React, Node.js**.

---

## 📦 Features

### 🛍️ Customer Side
- Browse products by category, search, filter, sort
- Product detail with image gallery & reviews
- Shopping cart with quantity management
- Checkout with address & payment
- Order tracking with live status
- User registration & login (JWT)
- My Orders page with order detail

### 🛠️ Admin Panel
- **Dashboard** — Revenue & order analytics with charts
- **Products** — Add / Edit / Delete with image upload (Cloudinary)
- **Orders** — View all orders, update status (Pending → Delivered)
- **Users** — Manage users, roles, activate/deactivate
- **Categories** — Add / Edit / Delete categories with images

### 💳 Payments
- **Razorpay** — UPI, Cards, Net Banking (India)
- **Stripe** — International cards
- **Cash on Delivery**

---

## 🗂️ Project Structure

```
grocery-mern/
├── backend/
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   ├── .env.example       # Environment variables template
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/    # Navbar, Footer, ProductCard, etc.
    │   ├── context/       # Auth & Cart context
    │   ├── pages/         # Home, Products, Cart, Admin, etc.
    │   ├── utils/         # Axios instance
    │   ├── App.js
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Installation Guide

### Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB Atlas account → https://cloud.mongodb.com
- Cloudinary account → https://cloudinary.com
- Razorpay account → https://razorpay.com (for payments)

---

### Step 1 — Clone / Extract the Project
```bash
# Extract the zip and enter the folder
cd grocery-mern
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/groceryDB
JWT_SECRET=any_long_random_secret_key_here

# Cloudinary (get from cloudinary.com dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (get from razorpay.com dashboard)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxx

FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev     # Development (with nodemon)
# OR
npm start       # Production
```

Backend runs on → http://localhost:5000

---

### Step 3 — Frontend Setup

```bash
cd ../frontend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
```

Start frontend:
```bash
npm start
```

Frontend runs on → http://localhost:3000

---

### Step 4 — Create Admin Account

1. Register normally at http://localhost:3000/register
2. Open MongoDB Atlas → your cluster → `groceryDB` → `users` collection
3. Find your user and change `"role": "user"` → `"role": "admin"`
4. Save and login again
5. You'll see **Admin Panel** in the dropdown menu

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get logged in user |
| PUT | /api/auth/profile | Update profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products (filter/sort/paginate) |
| GET | /api/products/featured | Get featured products |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create product (Admin) |
| PUT | /api/products/:id | Update product (Admin) |
| DELETE | /api/products/:id | Delete product (Admin) |
| POST | /api/products/:id/reviews | Add review |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | Get all categories |
| POST | /api/categories | Create (Admin) |
| PUT | /api/categories/:id | Update (Admin) |
| DELETE | /api/categories/:id | Delete (Admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Place order |
| GET | /api/orders/myorders | My orders |
| GET | /api/orders/:id | Order detail |
| PUT | /api/orders/:id/pay | Mark as paid |
| GET | /api/orders | All orders (Admin) |
| PUT | /api/orders/:id/status | Update status (Admin) |
| GET | /api/orders/analytics | Dashboard analytics (Admin) |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payment/razorpay/create | Create Razorpay order |
| POST | /api/payment/razorpay/verify | Verify payment |
| POST | /api/payment/stripe/create-intent | Create Stripe intent |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload | Upload image to Cloudinary (Admin) |

---

## 🚀 Production Deployment

### Backend (Railway / Render / Heroku)
1. Push backend folder to GitHub
2. Connect to Railway.app or Render.com
3. Set all environment variables
4. Deploy

### Frontend (Vercel / Netlify)
1. In `.env`, set `REACT_APP_API_URL=https://your-backend-url.com/api`
2. Run `npm run build`
3. Deploy `build/` folder to Vercel or Netlify

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router 6, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Image Upload | Cloudinary + Multer |
| Payments | Razorpay, Stripe |
| Charts | Recharts |
| Styling | Custom CSS (no framework) |

---

## 📸 Pages Overview

| Page | Route | Access |
|------|-------|--------|
| Home | / | Public |
| Products | /products | Public |
| Product Detail | /products/:id | Public |
| Cart | /cart | Public |
| Login | /login | Public |
| Register | /register | Public |
| Checkout | /checkout | Login required |
| My Orders | /orders | Login required |
| Admin Dashboard | /admin | Admin only |
| Admin Products | /admin/products | Admin only |
| Admin Orders | /admin/orders | Admin only |
| Admin Users | /admin/users | Admin only |
| Admin Categories | /admin/categories | Admin only |

---

## 🐛 Common Issues

**MongoDB connection error:**
→ Check your MONGO_URI in .env. Make sure IP 0.0.0.0/0 is whitelisted in Atlas.

**Image upload not working:**
→ Verify Cloudinary credentials in .env.

**Razorpay payment window not opening:**
→ Ensure `<script src="https://checkout.razorpay.com/v1/checkout.js">` is in public/index.html.

**Admin panel not visible:**
→ Change user role to "admin" in MongoDB Atlas manually.

---

## 📞 Support

Built with ❤️ using MERN Stack.
