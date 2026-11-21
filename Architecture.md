# Architecture.md – DineEase

This document explains how the parts of DineEase are organized and how they talk to each other.

---

## 1. Overview

DineEase has three main parts:

1. **Frontend** – the pages the user sees in the browser (HTML, CSS, JavaScript).
2. **Backend** – a Node.js + Express server that holds the rules and talks to the database. It exposes a REST API.
3. **Database** – MySQL, where all data is stored.

The frontend never talks to the database directly. It always asks the backend, and the backend asks the database.

## 2. System Diagram

```
   User's Browser
        |
        v
+------------------+      HTTP requests (JSON)      +----------------------+
|     FRONTEND     | -----------------------------> |       BACKEND        |
|  HTML + CSS + JS |                                |  Node.js + Express   |
|  (Vercel)        | <----------------------------- |  REST API (Render)   |
+------------------+      JSON responses            +----------+-----------+
                                                               |
                                                               | SQL queries
                                                               v
                                                    +----------------------+
                                                    |       DATABASE       |
                                                    |        MySQL         |
                                                    | (TiDB Cloud / local) |
                                                    +----------------------+
```

## 3. Layers and Their Jobs

| Layer | Job | Does NOT do |
|---|---|---|
| Frontend | Show pages, take user input, call the API with `fetch`, show results | Talk to the database, store passwords |
| Backend | Check input, check login and role, run SQL, send JSON back | Build the page design |
| Database | Store users, menu, orders, reservations | Any logic about who can see what |

## 4. Folder Structure

```
DineEase/
├── frontend/
│   ├── index.html            Home
│   ├── menu.html             Menu
│   ├── about.html            About Us
│   ├── reservation.html      Reservation
│   ├── contact.html          Contact
│   ├── login.html            Login
│   ├── register.html         Register
│   ├── cart.html             Cart
│   ├── orders.html           My orders
│   ├── admin.html            Admin dashboard
│   └── css/
│       └── style.css         All CSS (separate file)
├── backend/
│   ├── server.js             Starts the Express app
│   ├── db.js                 MySQL connection
│   ├── middleware/
│   │   └── auth.js           Checks login token and admin role
│   ├── routes/
│   │   ├── auth.js           Register, login
│   │   ├── menu.js           Menu and categories
│   │   ├── orders.js         Orders
│   │   ├── reservations.js   Reservations
│   │   ├── contact.js        Contact messages
│   │   └── users.js          Users (admin)
│   ├── package.json
│   └── .env                  Secrets (never committed)
├── database/
│   └── database.sql          Creates all tables and sample data
├── docs/                     Project documents
├── .env.example
├── .gitignore
└── README.md
```

HTML and JavaScript live together in the `.html` pages. CSS is always in `css/style.css`.

## 5. Database Design

### Tables

**users**: `id`, `name`, `email` (unique), `phone`, `password_hash`, `role` (`customer` or `admin`), `created_at`

**categories**: `id`, `name`

**menu_items**: `id`, `category_id`, `name`, `description`, `price`, `image`, `is_available`

**orders**: `id`, `user_id`, `total`, `status`, `address`, `phone`, `created_at`
Status values: `pending`, `preparing`, `ready`, `delivered`, `cancelled`

**order_items**: `id`, `order_id`, `menu_item_id`, `quantity`, `price`

**reservations**: `id`, `user_id`, `reservation_date`, `reservation_time`, `guests`, `status`
Status values: `pending`, `approved`, `cancelled`

**contact_messages**: `id`, `name`, `email`, `message`, `created_at`

### Relationships

```
categories 1 ---- * menu_items
users      1 ---- * orders
orders     1 ---- * order_items
menu_items 1 ---- * order_items
users      1 ---- * reservations
```

Foreign keys are used for every relationship above.

## 6. API Endpoints

All routes start with `/api`. Data is sent and received as JSON.

| Method | Route | Who | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Everyone | Create an account |
| POST | `/auth/login` | Everyone | Log in and get a token |
| GET | `/categories` | Everyone | List categories |
| GET | `/menu` | Everyone | List menu items (can filter by category) |
| POST | `/menu` | Admin | Add a menu item |
| PUT | `/menu/:id` | Admin | Edit a menu item |
| DELETE | `/menu/:id` | Admin | Delete a menu item |
| POST | `/orders` | Customer | Place an order |
| GET | `/orders/my` | Customer | See own orders |
| GET | `/orders` | Admin | See all orders |
| PUT | `/orders/:id/status` | Admin | Change order status |
| POST | `/reservations` | Customer | Book a table |
| GET | `/reservations/my` | Customer | See own reservations |
| GET | `/reservations` | Admin | See all reservations |
| PUT | `/reservations/:id/status` | Admin | Approve or cancel |
| POST | `/contact` | Everyone | Send a message |
| GET | `/contact` | Admin | Read messages |
| GET | `/users` | Admin | List users |

## 7. How a Request Flows

**Example: customer places an order**

1. Customer fills the cart and clicks **Place Order** on `cart.html`.
2. JavaScript sends `POST /api/orders` with the items and the login token.
3. `middleware/auth.js` checks the token and finds the user.
4. `routes/orders.js` checks the data, saves a row in `orders` and rows in `order_items`.
5. The backend sends back a JSON message with the new order id.
6. The page shows a success message.

**Example: login**

1. The user submits `login.html`.
2. `POST /api/auth/login` checks the email and compares the password with the stored hash.
3. If correct, the backend returns a token and the user role.
4. The browser keeps the token and sends it with later requests.

## 8. Security

- Passwords are hashed with bcrypt. Plain passwords are never stored.
- Login uses a JWT token. Protected routes check it in `middleware/auth.js`.
- Admin routes also check that the role is `admin`.
- SQL queries are parameterized.
- Secrets (database password, token secret) are in `.env`, which is listed in `.gitignore`.
- The backend checks all input again, even if the frontend already checked it.

## 9. Deployment Architecture

| Part | Platform | Settings |
|---|---|---|
| Frontend | Vercel (free) | Serves the `frontend` folder |
| Backend | Render (free web service) | Environment variables hold secrets |
| Database | TiDB Cloud Starter (free, MySQL-compatible) | Connection details go in Render's environment variables |

- The backend allows requests from the Vercel site address (CORS).
- The frontend keeps the backend address in one place so it is easy to change.
- During development everything runs locally: the site on one port, the backend on another, and MySQL on the computer.
- Render's free server sleeps when idle, so the first request after a break can take about a minute.

## 10. Main Decisions

| Decision | Reason |
|---|---|
| HTML, CSS, JavaScript without frameworks | Course requirement and easier to explain |
| Separate CSS file | Course requirement and cleaner pages |
| Express REST API | Simple, works well with Node.js |
| MySQL | Our data is connected (users, orders, items), which fits tables |
| JWT login | Simple and works with a separate frontend and backend |
| Everything free | The project has no budget |
