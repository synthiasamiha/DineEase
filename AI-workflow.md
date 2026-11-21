# DineEase – AI Workflow

How our team (Code Spice) uses an AI assistant (Claude) to build DineEase. The AI helps us write code. We review, test and own everything that goes into the repository.

---

## 1. Ground Rules

1. **AI code is treated like our own code.** If we cannot explain a piece of code, it does not get committed.
2. **A human reads every change before commit.** We read what changed, not only whether it runs.
3. **No unrequested work.** The AI does only what we asked. It does not add features, change other files, rename things or "improve" code on its own. If it thinks something else is needed, it asks first.
4. **No new package without asking.** Any new npm package must be explained first: what it is and why we need it.
5. **No secrets in the repository.** Passwords and keys go in `.env` only. The repository is public.
6. **We mention AI use.** AI-assisted parts are mentioned in our final report.

## 2. Repo Setup for AI

The AI reads these files before it writes code:

| File | Purpose |
|---|---|
| `README.md` | What the project is and how to run it |
| `Plan.md` | Scope, features, tech stack, phases |
| `Architecture.md` | How the frontend, backend and database connect |
| `Agent.md` | The AI's role and the rules it must follow |
| `Task.md` | The list of tasks and their status |

Fixed tech stack (the AI must not change it):

- Frontend: HTML, CSS, JavaScript only (no frameworks, no Bootstrap)
- Backend: Node.js with Express
- Database: MySQL
- Version control: Git and GitHub

## 3. The Feature Loop

We build one small task at a time.

1. **Pick** one task from `Task.md`.
2. **Tell the AI** exactly what the task is.
3. **AI reads** `Plan.md`, `Architecture.md` and `Agent.md`, then writes the smallest code that does the task.
4. **AI explains** the code in simple language.
5. **Human reviews** the code and removes anything unnecessary.
6. **Test** it in the browser (and Postman for API routes).
7. **Commit** with a clear message, for example `Add menu list API`.
8. **Mark** the task as done in `Task.md`.

If a step fails, we go back to step 3 with the exact error message.

## 4. Code Style Rules

The code must look like a student wrote it by hand: simple, clear and plain.

**No unnecessary code**
- No unused functions, variables, imports or files.
- No extra features, extra checks or "just in case" code that we did not ask for.
- Do not make a short task long.

**Write conditions like a person would.** Put the condition and its body on separate lines. Do not squeeze them into one line.

Not like this:

```javascript
if (quantity <= 0) console.log("Quantity must be at least 1");
```

Like this:

```javascript
if (quantity <= 0) {
  console.log("Quantity must be at least 1");
}
```

**Keep it simple**
- Short, clear variable and function names.
- A simple `for` loop is better than a clever chain of methods if it is easier to read.
- Short comments only where they help.
- No tricky one-liners.

## 5. Frontend Rules

- Only HTML, CSS and JavaScript. Most of the logic goes in JavaScript.
- HTML and JavaScript go in the `.html` pages. All CSS goes in a separate file (`css/style.css`). No CSS inside the HTML files.
- Pages: Home, Menu, About Us, Reservation, Contact, plus Login, Cart and Admin pages.
- The design is white with green buttons, mobile-first, and must look the same on phone and laptop.
- The layout stays as in the approved template. The AI does not redesign it.

## 6. Backend and Database Rules

- Express routes stay small. One route does one job.
- Always use parameterized queries for MySQL (no values joined into SQL text).
- Passwords are hashed (bcrypt) and never stored as plain text.
- Admin routes check the user's role.
- Database tables are created only through `database.sql`.

## 7. What the AI Must Not Do

- Do not change files we did not mention.
- Do not add libraries, features or pages on its own.
- Do not delete or rewrite working code without being asked.
- Do not commit or push. Humans do that.
- Do not put real passwords, keys or personal data in any file.

## 8. Commit and Review

- Commit after every finished task, in small steps.
- Commit messages are short and clear.
- Before every commit we check: Does it run? Do we understand it? Is anything unnecessary left?
- If something is wrong after commit, we fix it in a new commit with a clear message.

## 9. AI Use Disclosure

We use Claude (Anthropic) for code suggestions, debugging and documents. We review all of it, and we can explain all submitted code.
