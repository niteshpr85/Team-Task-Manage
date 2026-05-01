# Team Task Manager

A full-stack web application for managing team tasks with role-based access control. Built with Next.js, SQLite, and NextAuth.js.

<img width="1918" height="892" alt="Screenshot 2026-05-01 000017" src="https://github.com/user-attachments/assets/218bc6e3-9125-4911-9b1a-fde58a4c4bc4" />

<img width="1920" height="1080" alt="Screenshot 2026-04-30 235504" src="https://github.com/user-attachments/assets/246342a8-71e4-4db8-ae5d-b4f27ba81223" />



## Features

- **User Authentication**: Sign up and login with role-based access (Admin/Member)
- **Project Management**: Create projects and assign team members
- **Task Management**: Create, assign, and track tasks with status updates
- **Dashboard**: Overview of tasks, projects, and progress
- **Role-based Access**: Admins can create projects, members can manage tasks

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3
- **Authentication**: NextAuth.js with credentials provider
- **Deployment**: Railway (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd team-task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The application uses SQLite and will automatically create the database file (`data/dev.db`) and tables on first run.

## Usage

### User Registration

1. Visit `/signup` to create an account
2. Choose role: Admin or Member
3. Login at `/login`

### For Admins

- Create projects at `/projects`
- Assign team members by email
- View all projects and tasks

### For Members

- View assigned tasks at `/tasks`
- Update task status (To Do → In Progress → Done)
- View project information

### Dashboard

- Visit `/` for an overview of your tasks and projects
- See task counts by status
- View recent tasks and projects

## API Endpoints

- `GET/POST /api/projects` - Project management
- `GET/POST /api/tasks` - Task management
- `PATCH /api/tasks/[id]` - Update task status
- `POST /api/auth/signup` - User registration
- `/api/auth/[...nextauth]` - NextAuth.js routes

## Deployment

### Railway (Recommended)

1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Railway URL)
3. Deploy automatically on push


Make sure to set the environment variables and ensure SQLite write permissions.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── projects/
│   │   └── tasks/
│   ├── login/
│   ├── projects/
│   ├── signup/
│   ├── tasks/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AuthProvider.tsx
│   └── Header.tsx
├── lib/
│   ├── auth.ts
│   └── db.ts
├── types/
│   └── next-auth.d.ts
└── data/
    └── dev.db (auto-generated)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

## Deployment

- Push the repository to GitHub
- Deploy to Railway or another Node.js host
- Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set in the deployment environment

## Notes

- The first registered user can be assigned the `admin` role by editing the database directly or through an admin flow.
- `better-sqlite3` is used for fast, server-side SQLite access in Next.js route handlers.



### Demo Accounts

For testing purposes, you can create demo accounts:
- **Admin**: Register at `/signup` then manually set role to `admin` in database
- **Member**: Register at `/signup` with role `member`

Example test data exists in the database:
- Admin: niteshpr@gmail.com
- Member: niteshpr85@gmail.com
- Project: NITESH (created by member)
- Project: MAKE A WEBSITE (created by admin)

## License

MIT
