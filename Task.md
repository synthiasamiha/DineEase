# Task.md – DineEase

This file lists every task of the project and tells the AI how to work on tasks. Work is done one task at a time, in order.

---

## AI Behavior & Role

Act as a task executor for two university students. Take the one task the students name, do only that task, and report back. You do not choose, add, skip or reorder tasks.

## Primary Objective

Finish the tasks in the list below one by one. Each task must be small, working, tested and ready to commit before the next one starts.

## Strict Operating Rules

1. **One task at a time.** Start only the task the students name. Do not continue to the next one on your own.
2. **Follow the order.** Later tasks depend on earlier ones. If a task needs something that is not done yet, say so instead of skipping ahead.
3. **Stay inside the task.** Do not add extra features or change files that the task does not need. If something extra is needed, tell the students and wait.
4. **No new tasks.** If you think a task is missing, suggest it. The students decide whether to add it.
5. **A task is done only when:**
   - the code runs without errors,
   - it is tested (browser on phone and laptop for pages, Postman for API routes),
   - the students have read and understood the code,
   - it is committed to GitHub with a clear message.
6. **Update status only after the students confirm.** Do not mark a task as done by yourself.
7. **If blocked,** say exactly what is blocking the task (missing file, error message, missing information). Do not guess.
8. **Follow `Agent.md`** for code style and all other rules.

## Status Legend

- `[ ]` To do
- `[~]` In progress
- `[x]` Done

---

## Phase 0 – Setup

- [ ] **T1** Install Node.js and MySQL on the computer
- [ ] **T2** Create the folder structure (`frontend`, `backend`, `database`, `docs`)
- [ ] **T3** Create `.env.example` and check that `.env` is ignored by Git
- [ ] **T4** Write the project description and run steps in `README.md`

## Phase 1 – Foundation

- [ ] **T5** Write `database/database.sql` (all tables and sample data)
- [ ] **T6** Create the Express server (`server.js`, `db.js`) and connect it to MySQL
- [ ] **T7** Add the menu test route and show the menu on a page
- [ ] **T8** Create the free TiDB Cloud database and load `database.sql`
- [ ] **T9** Deploy the backend to Render
- [ ] **T10** Deploy the frontend to Vercel and check the live link

## Phase 2 – Authentication

- [ ] **T11** Register API
- [ ] **T12** Login API (bcrypt and JWT token)
- [ ] **T13** Auth middleware (token check and admin role check)
- [ ] **T14** `register.html` and `login.html`
- [ ] **T15** Logout and login state in the navigation bar

## Phase 3 – Menu and Orders

- [ ] **T16** Categories and menu API
- [ ] **T17** `menu.html` with category filter and search, using the API
- [ ] **T18** Cart (JavaScript) with add, remove, quantity and total
- [ ] **T19** Place order API
- [ ] **T20** `cart.html` place order
- [ ] **T21** Order history API and `orders.html`

## Phase 4 – Reservation, Contact and Admin

- [ ] **T22** Reservation API
- [ ] **T23** `reservation.html`
- [ ] **T24** Contact API
- [ ] **T25** `contact.html`
- [ ] **T26** `index.html` (Home) and `about.html` from the approved template
- [ ] **T27** Admin menu API (add, edit, delete)
- [ ] **T28** Admin dashboard: menu management page
- [ ] **T29** Admin dashboard: orders (list and change status)
- [ ] **T30** Admin dashboard: reservations (list, approve, cancel)
- [ ] **T31** Admin dashboard: users and contact messages

## Phase 5 – Finish

- [ ] **T32** Test every feature on phone and laptop
- [ ] **T33** Fix the bugs found
- [ ] **T34** Final deployment and live link check (open the site once to wake the Render server)
- [ ] **T35** Final update of README and documents

## Optional (only if time remains)

- [ ] **O1** Reviews and ratings
- [ ] **O2** Coupon codes
- [ ] **O3** Sales report
- [ ] **O4** Email notifications
