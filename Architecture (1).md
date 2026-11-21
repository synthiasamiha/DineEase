# Architecture.md – DineEase

This document explains how DineEase is organized and how its parts talk to each other.

---

## 1. Project Level

**DineEase is a mid-level project.**

- It is **not high-level**. We do not use microservices, message queues, payment gateways, caching layers or complex cloud setups.
- It is **not low-level**. It is not a single static page. It has user accounts, roles, a real database, a REST API and a live deployment.

In short: a complete full-stack website with a clear structure, built with simple tools that two students can understand and explain.

## 2. Strategy

| Area | Strategy |
|---|---|
| Structure | Client-server. A frontend talks to one backend, and the backend talks to one database |
| Backend | One Node.js + Express application (a single backend, not many small services) |
| Communication | REST API with JSON |
| Build order | MVP first (login, menu, cart, orders, reservation, admin). Optional features only if time remains |
| Tools | Simple and well known: HTML, CSS, JavaScript, Node.js, Express, MySQL |
| Hosting | Fully free: Vercel, Render, TiDB Cloud |
| Delivery | Small tasks, one commit per finished task, deploy a tiny version early |
| Security | Hashed passwords, token login, role checks, secrets in `.env` |

## 3. Repo Boundary

One GitHub repository holds the whole project. Each folder has one clear job, and code does not cross these boundaries.

```
DineEase/
├── frontend/        Everything the browser runs
│   ├── *.html       Pages (HTML + JavaScript)
│   └── css/
│       └── style.css    All CSS (separate file)
├── backend/         Everything the server runs
│   ├── server.js
│   ├── db.js
│   ├── middleware/
│   ├── routes/
│   └── package.json
├── database/
│   └── database.sql     Tables and sample data
├── docs/            Project documents
├── .env.example     Names of secrets (no real values)
├── .gitignore
└── README.md
```

| Folder | Allowed | Not allowed |
|---|---|---|
| `frontend/` | HTML, JavaScript, CSS, calls to the API | SQL, database passwords, server code |
| `backend/` | Express routes, SQL queries, login checks | Page design, CSS |
| `database/` | Table definitions and sample data | Application logic |
| `docs/` | Documents | Code |

**Never in the repository:** `.env`, `node_modules/`, real passwords or keys.

## 4. System Diagram

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

The frontend never talks to the database directly.

## 5. Frontend

**Technology:** HTML, CSS, JavaScript (no frameworks). HTML and JavaScript are in the `.html` pages. CSS is in `css/style.css`.

**Pages**

| Page | File | Access |
|---|---|---|
| Home | `index.html` | Everyone |
| Menu | `menu.html` | Everyone |
| About Us | `about.html` | Everyone |
| Contact | `contact.html` | Everyone |
| Login / Register | `login.html`, `register.html` | Everyone |
| Reservation | `reservation.html` | Logged-in customer |
| Cart / My Orders | `cart.html`, `orders.html` | Logged-in customer |
| Admin Dashboard | `admin.html` | Admin only |

**Job of the frontend**
- Show pages and take user input.
- Check simple input mistakes (empty fields, wrong phone number).
- Call the backend with `fetch` and show the result.
- Keep the login token in the browser and send it with protected requests.
- Keep the backend address in one place so it is easy to change.

**Design:** white background, green buttons, mobile-first, same layout on phone and laptop.

## 6. Backend

**Technology:** Node.js with Express.

| File / Folder | Job |
|---|---|
| `server.js` | Starts the app, adds CORS and JSON support, connects the routes |
| `db.js` | Connects to MySQL |
| `middleware/auth.js` | Checks the login token and the admin role |
| `routes/auth.js` | Register and login |
| `routes/menu.js` | Categories and menu items |
| `routes/orders.js` | Place and manage orders |
| `routes/reservations.js` | Book and manage tables |
| `routes/contact.js` | Contact messages |
| `routes/users.js` | List users (admin) |

**API endpoints** (all start with `/api`)

| Method | Route | Who | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Everyone | Create an account |
| POST | `/auth/login` | Everyone | Log in and get a token |
| GET | `/categories` | Everyone | List categories |
| GET | `/menu` | Everyone | List menu items |
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

**Job of the backend**
- Check all input again, even if the frontend already checked it.
- Check who the user is and what they are allowed to do.
- Run parameterized SQL queries.
- Send JSON responses with clear messages.

## 7. Data and Services

### Data (MySQL)

**users**: `id`, `name`, `email` (unique), `phone`, `password_hash`, `role` (`customer` or `admin`), `created_at`

**categories**: `id`, `name`

**menu_items**: `id`, `category_id`, `name`, `description`, `price`, `image`, `is_available`

**orders**: `id`, `user_id`, `total`, `status`, `address`, `phone`, `created_at`
Status: `pending`, `preparing`, `ready`, `delivered`, `cancelled`

**order_items**: `id`, `order_id`, `menu_item_id`, `quantity`, `price`

**reservations**: `id`, `user_id`, `reservation_date`, `reservation_time`, `guests`, `status`
Status: `pending`, `approved`, `cancelled`

**contact_messages**: `id`, `name`, `email`, `message`, `created_at`

**Relationships**

```
categories 1 ---- * menu_items
users      1 ---- * orders
orders     1 ---- * order_items
menu_items 1 ---- * order_items
users      1 ---- * reservations
```

All tables and sample data are created by `database/database.sql`.

### Services

| Service | Used for | Cost |
|---|---|---|
| Vercel | Hosting the frontend | Free |
| Render | Hosting the Node.js backend | Free (sleeps when idle; first request can take about a minute) |
| TiDB Cloud Starter | Hosting the MySQL-compatible database | Free |
| GitHub | Code storage and version history | Free |

No third-party APIs are used (no payment, no maps, no email service). Secrets such as the database password and the token secret are stored in environment variables, never in code.

## 8. How a Request Flows

**Customer places an order**

1. Customer clicks **Place Order** on `cart.html`.
2. JavaScript sends `POST /api/orders` with the items and the login token.
3. `middleware/auth.js` checks the token.
4. `routes/orders.js` checks the data and saves rows in `orders` and `order_items`.
5. The backend sends back a JSON message with the order id.
6. The page shows a success message.

**Login**

1. The user submits `login.html`.
2. `POST /api/auth/login` compares the password with the stored hash.
3. If correct, the backend returns a token and the user role.
4. The browser keeps the token and sends it with later requests.

## 9. Security

- Passwords are hashed with bcrypt.
- Login uses a JWT token, checked on every protected route.
- Admin routes also check that the role is `admin`.
- SQL queries are parameterized.
- Secrets are in `.env`, which is listed in `.gitignore`.

## 10. Deployment

- Frontend runs on Vercel and serves the `frontend` folder.
- Backend runs on Render and allows requests from the Vercel address (CORS).
- Database runs on TiDB Cloud. Its connection details are set in Render's environment variables.
- During development, everything runs on the local computer with a local MySQL.

## 11. Main Decisions

| Decision | Reason |
|---|---|
| HTML, CSS, JavaScript without frameworks | Course requirement and easier to explain |
| Separate CSS file | Course requirement and cleaner pages |
| One Express backend | Simple, right size for a mid-level project |
| MySQL | Our data is connected (users, orders, items) |
| JWT login | Works well with a separate frontend and backend |
| Free services only | The project has no budget |
