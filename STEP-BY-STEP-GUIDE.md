# Team Task Manager - Step by Step Usage Guide

This guide explains how to use the Team Task Manager application from start to finish.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Starting the Application](#starting-the-application)
3. [Creating an Account](#creating-an-account)
4. [Login to the Application](#login-to-the-application)
5. [Dashboard Overview](#dashboard-overview)
6. [Creating a Project](#creating-a-project)
7. [Creating Tasks](#creating-tasks)
8. [Managing Tasks](#managing-tasks)
9. [Viewing All Projects](#viewing-all-projects)

---

## Project Overview

Team Task Manager is a web application that helps teams manage their projects and tasks efficiently. It allows users to:
- Create and manage projects
- Create and assign tasks
- Track task progress (To Do → In Progress → Done)
- View dashboard with task summaries

**Tech Stack:**
- Next.js (Frontend & Backend)
- React (UI)
- SQLite (Database)
- NextAuth.js (Authentication)

---

## Starting the Application

### Step 1: Open Terminal
Open your terminal/command prompt.

### Step 2: Navigate to Project Folder
```bash
cd team-task-manager
```

### Step 3: Install Dependencies (First Time Only)
```bash
npm install
```

### Step 4: Start the Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
Navigate to: `http://localhost:3000`

---

## Creating an Account

### Step 1: Navigate to Sign Up
Click on the "Sign Up" link in the header or go to `/signup`

### Step 2: Fill in Registration Form
Enter the following details:
- **Name**: Your full name (e.g., John Doe)
- **Email**: Your email address (e.g., john@example.com)
- **Password**: Choose a strong password
- **Confirm Password**: Re-enter password
- **Role**: Choose "Admin" or "Member"

### Step 3: Submit the Form
Click the "Sign Up" button.

### Step 4: Automatic Login
After successful registration, you will be automatically logged in and redirected to the Dashboard.

---

## Login to the Application

### Step 1: Navigate to Login Page
Go to `/login` or click "Login" in the header.

### Step 2: Enter Credentials
- **Email**: Your registered email
- **Password**: Your password

### Step 3: Click Login
You will be redirected to the Dashboard.

---

## Dashboard Overview

The Dashboard shows you:

### 1. Task Statistics Cards (Top Row)
- **To Do**: Number of tasks waiting to be started
- **In Progress**: Number of tasks currently being worked on
- **Done**: Number of completed tasks
- **Overdue**: Number of tasks past their due date

### 2. My Tasks Section (Left)
Shows your recent tasks with:
- Task title
- Status
- Project name
- Due date

### 3. My Projects Section (Right)
Shows your recent projects with:
- Project name
- Creator name
- Team members

---

## Creating a Project

### Step 1: Navigate to Projects Page
Click on "Projects" in the header or go to `/projects`

### Step 2: Click "Create Project" Button
Click the button to open the creation form.

### Step 3: Fill in Project Details
- **Name**: Project title (e.g., Website Redesign)
- **Description**: What the project is about
- **Member Emails**: Add team members by email (comma-separated)

### Step 4: Submit
Click "Create Project" to save.

---

## Creating a Task

### Step 1: Navigate to Tasks Page
Click on "Tasks" in the header or go to `/tasks`

### Step 2: Click "Create Task" Button
Click the button to open the task creation form.

### Step 3: Fill in Task Details
- **Title**: Task name (e.g., Design homepage)
- **Description**: Task description
- **Status**: Initial status (To Do/In Progress/Done)
- **Due Date**: When the task is due
- **Project**: Select the project this task belongs to
- **Assign to**: Email of team member (optional)

### Step 4: Submit
Click "Create Task" to save the task.

---

## Managing Tasks

In the Tasks page, you can update task status:

### To Start a Task (To Do → In Progress)
1. Find the task in the "To Do" column
2. Click the "Start" button
3. The task will move to "In Progress" column

### To Complete a Task (In Progress → Done)
1. Find the task in the "In Progress" column
2. Click the "Complete" button
3. **A confirmation dialog will appear** - Click "OK" to confirm or "Cancel" to cancel
4. The task will move to "Done" column (only after confirmation)

### To Move Back (In Progress → To Do)
1. Find the task in the "In Progress" column
2. Click the "Back to To Do" button

### To Reopen a Task (Done → In Progress)
1. Find the task in the "Done" column
2. Click the "Reopen" button

---

## Viewing All Projects

### Step 1: Go to Projects Page
Navigate to `/projects`

### Step 2: Browse Projects
All projects you created or are a member of are displayed in a grid.

Each project card shows:
- Project name
- Description
- Created by (who)
- Team members

---

## How Data is Stored

### Database Location
The data is stored in: `team-task-manager/data/dev.db`

### Tables
1. **users**: User accounts
2. **projects**: Created projects
3. **tasks**: All tasks
4. **project_members**: Team member relationships

### Data Relationships
- Users create Projects
- Users create Tasks
- Tasks belong to Projects
- Tasks can be assigned to Users

---

## Troubleshooting

### Forgot Password
Currently, there is no password reset functionality. Please create a new account.

### Can't See Projects
Make sure you are logged in. Only logged-in users can see projects.

### Tasks Not Showing
- Check that the task is assigned to your project
- Verify the task status is correct

---

## Summary of User Flow

```
1. Start App (npm run dev)
      ↓
2. Sign Up (/signup)
      ↓
3. Login (/login) - automatic after signup
      ↓
4. View Dashboard (/)
      ↓
5. Create Project (/projects)
      ↓
6. Create Task (/tasks)
      ↓
7. Manage Task Status
      ↓
8. View Updates on Dashboard
```

---

## Quick Reference

| Action | URL |
|--------|-----|
| Dashboard | / |
| Login | /login |
| Sign Up | /signup |
| Projects | /projects |
| Tasks | /tasks |

---

## Role-Based Features

### Admin Capabilities
- Can create projects
- Can view ALL tasks in the system (including tasks completed by members)
- Can manage team members

### Member Capabilities
- Can create tasks
- Can update task status
- Can view tasks assigned to them OR in projects they're members of OR in projects they created
- Must confirm when marking tasks as Done

---

## Recent Updates (May 2025)

1. **Text Visibility**: Dashboard and task page text now uses black color for better readability.

2. **Task Completion Confirmation**: Members must confirm when completing a task to prevent accidental status changes.

3. **Admin Visibility**: Admins can now see all tasks including tasks completed by members.

---

## Conclusion

You now know how to use the Team Task Manager application! 

Key points:
1. Sign up to create an account
2. Login to access your dashboard
3. Create projects to organize work
4. Create tasks within projects
5. Update task status as you work
6. View progress on the dashboard

Happy task management!
