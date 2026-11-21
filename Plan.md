# Plan.md – DineEase

**Project:** DineEase – Restaurant Management and Online Ordering System
**Team:** Code Spice
**Members:** Mst Samiha Tasnim Synthia (251-112-002), Sadia Akter (251-112-007)
**Course:** Web Programming Lab (Batch 36, Evening)
**Instructor:** Abu Jafar Md Jakaria

---

## 1. Project Summary

DineEase is a web application for a restaurant. Customers can browse the menu, place food orders online and reserve tables. The restaurant admin can manage the menu, orders, reservations and users from one dashboard.

The project follows the approved proposal. This document explains **how** we will build it.

## 2. Goals

1. Deliver a working, **live** website (free hosting) by the final submission date.
2. Build every core (MVP) feature from the proposal first; optional features only if time remains.
3. Keep the code clean, commented and committed to GitHub in small, clear steps.
4. Be able to explain every part of the code (including AI-assisted parts).

## 3. Target Users

| User | What they do |
|---|---|
| Visitor | Views Home, Menu, About Us, Contact |
| Customer | Registers, logs in, orders food, books tables, sees order history |
| Admin | Manages menu items, orders, reservations and users |

## 4. Scope

**Included (MVP)**
- Registration, login, logout, role-based access (Customer / Admin)
- Menu browsing with categories and search
- Shopping cart and order placement (Cash on Delivery / pay at restaurant)
- Order history and order status
- Table reservation (date, time, guests)
- Admin dashboard: menu CRUD, orders, reservations, users
- Contact form
- Responsive design (mobile and desktop)

**Optional (only if time permits)**
- Reviews and ratings
- Coupon codes
- Sales report
- Email notifications

**Not included**
- Real online payment gateway
- Native mobile app
- Live delivery tracking

## 5. Pages

| Page | File | Access |
|---|---|---|
| Home | `index.html` | Everyone |
| Menu | `menu.html` | Everyone |
| About Us | `about.html` | Everyone |
| Reservation | `reservation.html` | Logged-in customer |
| Contact | `contact.html` | Everyone |
| Login / Register | `login.html`, `register.html` | Everyone |
| Cart / My Orders | `cart.html`, `orders.html` | Logged-in customer |
| Admin Dashboard | `admin.html` | Admin only |

## 6. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (no frameworks) |
| Backend | Node.js with Express.js |
| Database | MySQL |
| Version Control | Git and GitHub |
| API testing | Postman |
| Other tools | VS Code, AI assistant (Claude) |

## 7. Free Deployment Plan

| Part | Platform | Note |
|---|---|---|
| Frontend | Vercel (free) | Static files |
| Backend | Render (free web service) | Sleeps after inactivity; first load can take about 1 minute |
| Database | TiDB Cloud Starter (free, MySQL-compatible) | Local MySQL is used during development |

Passwords and keys are stored in a `.env` file and **never** committed to GitHub. A `.env.example` file shows the required names only.

## 8. Database Overview

Main tables (details will be written in `database.sql`):

- `users` – id, name, email, phone, password_hash, role
- `categories` – id, name
- `menu_items` – id, category_id, name, description, price, image, is_available
- `orders` – id, user_id, total, status, address, phone, created_at
- `order_items` – id, order_id, menu_item_id, quantity, price
- `reservations` – id, user_id, date, time, guests, status
- `contact_messages` – id, name, email, message, created_at

## 9. Development Phases

| Phase | Work | Done when |
|---|---|---|
| 0. Setup | Install Node.js and MySQL, create folder structure, README, `.env.example` | Project runs locally |
| 1. Foundation | `database.sql`, Express server, DB connection, a tiny "hello" version deployed live | Live link opens |
| 2. Authentication | Register, login, logout, password hashing, admin role | Users can log in and admin pages are protected |
| 3. Menu and Orders | Menu API, menu page, cart, place order, order history | Customer can complete an order |
| 4. Reservation, Contact and Admin | Reservation form, contact form, admin dashboard (menu CRUD, orders, reservations) | Admin can manage everything |
| 5. Finish | Testing, bug fixes, final deployment, documentation | Live site works end to end |

Durations are estimates and will be adjusted to the final submission date. Finished work is committed after every small step.

## 10. Repository Structure (planned)

```
DineEase/
├── frontend/        HTML + JavaScript pages
│   └── css/style.css    All CSS (separate file)
├── backend/         Node.js + Express server
├── database/        database.sql
├── docs/            Plan.md, Architecture.md, Agent.md, Task.md, proposal PDF
├── .env.example
├── .gitignore
└── README.md
```

## 11. Risks and How We Handle Them

| Risk | Plan |
|---|---|
| Little time left | Build MVP first; skip optional features |
| Deployment problems | Deploy a tiny version early and redeploy often |
| Free server sleeps | Open the site once before showing it |
| Authentication bugs | Use tested libraries (bcrypt, JWT) and test each protected route |
| Database mistakes | Design tables first; keep `database.sql` in the repository |
| Secrets leaked on public repo | Use `.env`, keep it in `.gitignore` |

## 12. Use of AI

We use an AI assistant (Claude by Anthropic) during development for code suggestions and debugging. AI-assisted parts will be mentioned in the final report, and we will be able to explain all submitted code.

## 13. Definition of Done

A feature is done when:
1. It works on both phone and laptop.
2. It is tested (browser and Postman where needed).
3. The code has clear comments.
4. It is committed to GitHub with a clear message.
