# Hyper Focus Productivity Web App

Good. Here’s a clear breakdown of the **core feature scope** for the FocusHub MVP, covering the **Timer**, **Task List**, and **Session Log** modules. This scope should be tight enough for a fast launch, but cleanly extendable for future features.

---

## ✅ Core Feature Scope for MVP

### 🔁 1. Pomodoro Timer

**Purpose**: Drive the core "work in sprints" loop.

**Features**

* [ ] Start / Pause / Reset timer
* [ ] Customisable durations:

  * Focus time (default: 25 min)
  * Short break (5 min)
  * Long break (15 min every 4 sessions)
* [ ] Timer modes: Focus, Break, Long Break
* [ ] Visual indicator of session progress (e.g. ring or progress bar)
* [ ] Optional: notification sound when session ends
* [ ] Optional: browser notifications

---

### ✅ 2. Task List

**Purpose**: Define what users plan to work on.

**Features**

* [ ] Add / Edit / Delete tasks
* [ ] Task fields:

  * Title (required)
  * Estimated Pomodoros (number)
  * Optional: Notes
* [ ] Task states:

  * Backlog
  * In Progress (linked to timer)
  * Done
* [ ] Integration:

  * Start timer for a selected task
  * Mark task as completed after all Pomodoros are done
* [ ] Basic sorting: Manual drag or priority order

---

### 📝 3. Session Log

**Purpose**: Record what was done to reinforce progress and reflection.

**Features**

* [ ] Automatically log:

  * Date/time
  * Task name
  * Session type (Focus/Break)
  * Duration
* [ ] Optional: short free-text summary after each Pomodoro
* [ ] Session history page:

  * Chronological list
  * Filter by date or task
  * Summary stats (e.g. today’s Pomodoros, top task)

---

### 🧱 Integration Design Principle

These modules are **loosely coupled, but deeply integrated**:

* Timer runs the workflow
* Tasks define *what* to work on
* Log shows *what* was completed

All three should work independently, but the magic is in **connecting them**.

---

Would you like a simple data model sketch next (e.g. JSON or DB schema)?

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
