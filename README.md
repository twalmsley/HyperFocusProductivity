# HyperFocusProductivity

A comprehensive productivity app built with Nuxt 3, featuring Pomodoro technique, task management, project organization, journaling, and habit tracking.

## Features

- **Pomodoro Timer**: Customizable focus sessions with breaks
- **Task Management**: Create, organize, and track tasks with projects
- **Project Organization**: Group tasks by projects with visual indicators
- **Journal Entries**: Daily reflection and note-taking
- **Habit Tracking**: Monitor daily habits and routines
- **Cyclic Tasks**: Recurring tasks that reset daily/weekly/monthly
- **Data Export**: Export all your data to CSV files for backup and analysis
- **User Settings**: Customize timer durations and app preferences

## Data Export Feature

The app includes a comprehensive data export feature that allows users to download all their data in CSV format. This feature is available in the Settings page and includes:

- **User Profile**: Basic account information
- **Settings**: Current app preferences and timer configurations
- **Projects**: All project data with descriptions and metadata
- **Tasks**: Complete task history with status, priority, and completion data
- **Sessions**: Focus and break session logs
- **Journal Entries**: All journal entries with content and metadata
- **Cyclic Tasks**: Recurring task definitions and completion history
- **Trackers**: Habit tracking data with daily values

### How to Export Data

1. Navigate to the Settings page
2. Scroll down to the "Data Export" section
3. Click the "Export Data" button
4. Multiple CSV files will be downloaded to your device
5. Each file contains a specific data type for easy analysis

The export process includes a progress indicator and success/error feedback to ensure a smooth user experience.

## Data Deletion Feature

The app also provides a secure data deletion feature that allows users to permanently delete all their data and account.

### Safety Measures

The deletion process includes multiple safety confirmations:
1. **Data Backup Confirmation**: Users must confirm they have downloaded their data
2. **Permanent Deletion Warning**: Users must acknowledge that deletion is irreversible
3. **Account Deletion Confirmation**: Users must explicitly confirm they want to delete their account
4. **Final Confirmation**: A final checkbox to proceed with the deletion

### What Gets Deleted

When a user deletes their data, the following is permanently removed:
- All user profile information
- All settings and preferences
- All projects and associated data
- All tasks and their history
- All focus sessions and timers
- All journal entries
- All cyclic tasks
- All habit trackers and entries
- All subscription data
- The user account itself

### How to Delete Data

1. Navigate to the Settings page
2. Scroll down to the "Delete All Data" section (Danger Zone)
3. Click "Delete All Data"
4. Complete all required confirmation checkboxes
5. Click "Delete All Data" in the confirmation modal
6. The user will be redirected to the home page after successful deletion

### Important Notes

- **This action is permanent and cannot be undone**
- **No data recovery is possible after deletion**
- **Users are strongly encouraged to export their data before deletion**
- **The deletion process is immediate and affects all associated data**

## Setup

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

# HyperFocusProductivity

A comprehensive productivity app built with Nuxt 3, featuring Pomodoro technique, task management, project organization, journaling, and habit tracking.

## Features

- **Pomodoro Timer**: Customizable focus sessions with breaks
- **Task Management**: Create, organize, and track tasks with projects
- **Project Organization**: Group tasks by projects with visual indicators
- **Journal Entries**: Daily reflection and note-taking
- **Habit Tracking**: Monitor daily habits and routines
- **Cyclic Tasks**: Recurring tasks that reset daily/weekly/monthly
- **Data Export**: Export all your data to CSV files for backup and analysis
- **User Settings**: Customize timer durations and app preferences

## Data Export Feature

The app includes a comprehensive data export feature that allows users to download all their data in CSV format. This feature is available in the Settings page and includes:

- **User Profile**: Basic account information
- **Settings**: Current app preferences and timer configurations
- **Projects**: All project data with descriptions and metadata
- **Tasks**: Complete task history with status, priority, and completion data
- **Sessions**: Focus and break session logs
- **Journal Entries**: All journal entries with content and metadata
- **Cyclic Tasks**: Recurring task definitions and completion history
- **Trackers**: Habit tracking data with daily values

### How to Export Data

1. Navigate to the Settings page
2. Scroll down to the "Data Export" section
3. Click the "Export Data" button
4. Multiple CSV files will be downloaded to your device
5. Each file contains a specific data type for easy analysis

The export process includes a progress indicator and success/error feedback to ensure a smooth user experience.
