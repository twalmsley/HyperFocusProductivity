# Hyper Focus Productivity Web App

Good. Here's a clear breakdown of the **core feature scope** for the HyperFocusProductivity MVP, covering the **Timer**, **Task List**, and **Session Log** modules. This scope should be tight enough for a fast launch, but cleanly extendable for future features.

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
  * Summary stats (e.g. today's Pomodoros, top task)

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

## Features

### Task Management
- Create, edit, and delete tasks
- Set due dates, priorities, and estimated pomodoros
- Task status tracking (Backlog, In Progress, Done)
- **Calendar view with drag and drop rescheduling**
- List view with sorting and filtering
- Task filtering by status, priority, due date, and project
- Task search functionality
- Pagination support
- Task statistics and workload visualization

### Journal System
- **Optimized Calendar View**: The journal main page now fetches only partial details for the current month, improving performance significantly
- **Lazy Loading**: Full journal entries are only fetched when viewing or editing
- **Monthly Data Loading**: When the calendar month changes, only entries for that month are loaded
- Create, edit, and delete journal entries
- Multiple entry types (Daily, Free-form, Review)
- Mood tracking
- Tag support
- Markdown support

### Focus Tools
- Pomodoro timer
- Focus session tracking
- Break management

## Performance Optimizations

### Journal System
The journal system has been optimized for better performance:

1. **Partial Data Fetching**: The main journal page (`/app/journal`) now fetches only essential data for the calendar view:
   - Entry ID, title, date, type, mood, and creation time
   - Content and tags are not loaded initially

2. **Monthly Loading**: Only entries for the current month are loaded by default

3. **On-Demand Full Loading**: When a user clicks to view or edit an entry, the full entry (including content and tags) is fetched from the API

4. **Calendar Month Changes**: When navigating between months in the calendar, only entries for the selected month are fetched

5. **Dashboard Optimization**: The main dashboard also uses the partial API for recent journal entries

### API Endpoints
- `GET /api/journal` - Fetch all journal entries (full data)
- `GET /api/journal/partial?year={year}&month={month}` - Fetch partial entries for a specific month
- `GET /api/journal/{id}` - Fetch a specific journal entry (full data)
- `POST /api/journal` - Create a new journal entry
- `PATCH /api/journal/{id}` - Update a journal entry
- `DELETE /api/journal/{id}` - Delete a journal entry

## Technology Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Calendar**: v-calendar
- **Markdown**: marked

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npx prisma migrate dev`
5. Start the development server: `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Schema

The application uses PostgreSQL with the following main tables:
- `User` - User accounts
- `Task` - Task management
- `JournalEntry` - Journal entries
- `FocusSession` - Focus session tracking
