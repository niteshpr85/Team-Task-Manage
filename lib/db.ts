import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

type UserRow = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  createdByName?: string;
  memberNames?: string | null;
};

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  assignedTo: string | null;
  projectId: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedToName?: string | null;
  projectName?: string | null;
};

const dataDir = path.join(process.cwd(), 'data');
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'dev.db');
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  createdBy TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (createdBy) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS project_members (
  projectId TEXT NOT NULL,
  userId TEXT NOT NULL,
  PRIMARY KEY (projectId, userId),
  FOREIGN KEY (projectId) REFERENCES projects(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  assignedTo TEXT,
  projectId TEXT NOT NULL,
  dueDate TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (assignedTo) REFERENCES users(id),
  FOREIGN KEY (projectId) REFERENCES projects(id)
);
`);

export function getUserByEmail(email: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
}

export function getUserById(id: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
}

export function createUser(user: {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}) {
  const now = new Date().toISOString();
  return db.prepare(
    'INSERT INTO users (id, email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ).run(user.id, user.email, user.password, user.name, user.role, now, now);
}

export function getProjectsForUser(userId: string): ProjectRow[] {
  return db
    .prepare(
      `SELECT p.*, u.name AS createdByName,
         GROUP_CONCAT(m.name, ', ') AS memberNames
       FROM projects p
       LEFT JOIN users u ON p.createdBy = u.id
       LEFT JOIN project_members pm ON p.id = pm.projectId
       LEFT JOIN users m ON pm.userId = m.id
       WHERE p.createdBy = ? OR p.id IN (
         SELECT projectId FROM project_members WHERE userId = ?
       )
       GROUP BY p.id`,
    )
    .all(userId, userId) as ProjectRow[];
}

export function createProject(data: {
  id: string;
  name: string;
  description?: string | null;
  createdBy: string;
  memberIds: string[];
}) {
  const now = new Date().toISOString();
  const insertProject = db.prepare(
    'INSERT INTO projects (id, name, description, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
  );
  const insertMember = db.prepare('INSERT OR IGNORE INTO project_members (projectId, userId) VALUES (?, ?)');

  const transaction = db.transaction(() => {
    insertProject.run(data.id, data.name, data.description ?? null, data.createdBy, now, now);
    for (const userId of data.memberIds) {
      insertMember.run(data.id, userId);
    }
  });

  transaction();

  return db.prepare('SELECT * FROM projects WHERE id = ?').get(data.id) as ProjectRow;
}

export function getUserTasks(userId: string): TaskRow[] {
  // Get user role first
  const user = getUserById(userId);
  
  // Admins can see all tasks
  if (user?.role === 'admin') {
    return db
      .prepare(
        `SELECT t.*, u.name AS assignedToName, p.name AS projectName
         FROM tasks t
         LEFT JOIN users u ON t.assignedTo = u.id
         LEFT JOIN projects p ON t.projectId = p.id
         ORDER BY t.createdAt DESC`,
      )
      .all() as TaskRow[];
  }
  
  // Regular users see tasks assigned to them OR tasks in projects they are members of OR tasks in projects they created
  return db
    .prepare(
      `SELECT t.*, u.name AS assignedToName, p.name AS projectName
       FROM tasks t
       LEFT JOIN users u ON t.assignedTo = u.id
       LEFT JOIN projects p ON t.projectId = p.id
       WHERE t.assignedTo = ? 
         OR t.projectId IN (SELECT projectId FROM project_members WHERE userId = ?)
         OR p.createdBy = ?
       ORDER BY t.createdAt DESC`,
    )
    .all(userId, userId, userId) as TaskRow[];
}

export function createTask(data: {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
  assignedToEmail?: string | null;
  projectId: string | null;
  dueDate?: string | null;
}) {
  const now = new Date().toISOString();
  let assignedTo = null;
  if (data.assignedToEmail) {
    const user = getUserByEmail(data.assignedToEmail);
    assignedTo = user?.id || null;
  }

  db.prepare(
    `INSERT INTO tasks (id, title, description, status, assignedTo, projectId, dueDate, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    data.id,
    data.title,
    data.description ?? null,
    data.status ?? 'todo',
    assignedTo,
    data.projectId,
    data.dueDate ?? null,
    now,
    now,
  );

  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(data.id) as TaskRow;
}

export function updateTask(id: string, updates: { status?: string }) {
  const now = new Date().toISOString();
  const setParts = [];
  const values = [];

  if (updates.status !== undefined) {
    setParts.push('status = ?');
    values.push(updates.status);
  }

  if (setParts.length === 0) return null;

  setParts.push('updatedAt = ?');
  values.push(now);
  values.push(id);

  db.prepare(`UPDATE tasks SET ${setParts.join(', ')} WHERE id = ?`).run(...values);

  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow;
}

export function getProjectIdsForUser(userId: string): string[] {
  const rows = db
    .prepare('SELECT id FROM projects WHERE createdBy = ? UNION SELECT projectId AS id FROM project_members WHERE userId = ?')
    .all(userId, userId) as { id: string }[];
  return rows.map((row) => row.id);
}

export default db;
