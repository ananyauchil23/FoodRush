# 🍜 FoodRush — MERN Stack Food Ordering System

A full-stack online food ordering application built with MongoDB, Express, React, and Node.js.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm or yarn

---

## 📦 Installation

### 1. Clone / Download the project

```bash
cd foodrush
```

### 2. Install all dependencies

```bash
# Install root, backend, and frontend dependencies
npm run install-all
```

Or manually:
```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodapp
JWT_SECRET=your_super_secret_key_here
```

For **MongoDB Atlas**, replace MONGODB_URI with your connection string:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/foodapp
```

### 4. Seed the database

```bash
npm run seed
```

This creates:
- 3 restaurants with 5 menu items each
- 3 test users
- 6 sample orders

### 5. Start the app

```bash
# Run both backend and frontend concurrently
npm run dev
```

Or separately:
```bash
# Terminal 1 — Backend (port 5000)
npm run start:backend

# Terminal 2 — Frontend (port 3000)
npm run start:frontend
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Test Credentials

| Name | Email | Password |
|------|-------|----------|
| Arjun Sharma | arjun@example.com | password123 |
| Priya Patel | priya@example.com | password123 |
| Rohan Mehta | rohan@example.com | password123 |

---

## 📁 Project Structure

```
foodrush/
├── package.json              # Root scripts (concurrently)
│
├── backend/
│   ├── server.js             # Express app entry point
│   ├── seed.js               # Database seeder
│   ├── .env                  # Environment variables
│   ├── models/
│   │   ├── Customer.js       # User schema + bcrypt
│   │   ├── Restaurant.js     # Restaurant + menu schema
│   │   └── Order.js          # Order schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── restaurants.js
│   │   └── orders.js
│   └── middleware/
│       └── auth.js           # JWT protect middleware
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js            # Router setup
        ├── index.js
        ├── index.css         # Global design system
        ├── context/
        │   ├── AuthContext.js  # Auth state (JWT)
        │   └── CartContext.js  # Cart state (localStorage)
        ├── services/
        │   └── api.js        # Axios API calls
        ├── components/
        │   ├── Navbar.js/css
        │   ├── RestaurantCard.js/css
        │   └── ProtectedRoute.js
        └── pages/
            ├── Home.js/css         # Restaurant listing + search
            ├── RestaurantMenu.js/css  # Menu + add to cart
            ├── Cart.js/css         # Cart + place order
            ├── Login.js
            ├── Signup.js
            ├── Auth.css            # Shared auth styles
            └── Orders.js/css       # Order history + tracker
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login + get JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Restaurants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants` | All restaurants (optional `?search=`) |
| GET | `/api/restaurants/:id` | Single restaurant with full menu |
| GET | `/api/restaurants/:id/menu` | Filtered menu (`?maxPrice=&category=`) |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Place new order | Yes |
| GET | `/api/orders/:userId` | Orders by user | Yes |
| GET | `/api/orders/all` | All orders (optional `?status=`) | No |
| GET | `/api/orders/revenue` | Revenue stats via `$group` | No |

---

## 🧠 MongoDB Queries Used

```js
// 1. Fetch all restaurants with search
Restaurant.find({ name: { $regex: search, $options: 'i' } })

// 2. Filter menu items under a price
restaurant.menu.filter(item => item.price <= maxPrice)

// 3. Get orders by customer_id
Order.find({ customer_id: userId }).populate('restaurant_id')

// 4. Aggregate total revenue using $group
Order.aggregate([{ $group: { _id: '$restaurant_name', totalRevenue: { $sum: '$total_amount' } } }])

// 5. Filter orders by status
Order.find({ status: 'Delivered' })

// 6. Populate related data
Order.find({}).populate('customer_id', 'name email').populate('restaurant_id', 'name')
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#FF6B35` (orange) |
| Accent | `#FFB347` (amber) |
| Background | `#FFFAF7` (warm cream) |
| Font Display | Syne (headings) |
| Font Body | DM Sans |
| Border Radius | 10–32px |
| Glass Effect | `backdrop-filter: blur(20px)` |

---

## 🔄 User Flow

```
Landing → Browse Restaurants → View Menu
       → Add to Cart → Cart Review
       → Place Order → Order History with Status Tracker
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Axios |
| State | Context API (Auth + Cart) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Pure CSS with design tokens |
