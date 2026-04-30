'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string | null;
  projectName: string | null;
  assignedToName: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdByName: string | null;
  memberNames: string | null;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    const [tasksRes, projectsRes] = await Promise.all([
      fetch('/api/tasks'),
      fetch('/api/projects'),
    ]);
    const tasksData = await tasksRes.json();
    const projectsData = await projectsRes.json();
    setTasks(tasksData);
    setProjects(projectsData);
  };

  if (status === 'loading') return <div className="p-6">Loading...</div>;

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done');

return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-black">To Do</h2>
          <p className="text-2xl text-black">{todoTasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-black">In Progress</h2>
          <p className="text-2xl text-black">{inProgressTasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-black">Done</h2>
          <p className="text-2xl text-black">{doneTasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-black">Overdue</h2>
          <p className="text-2xl text-red-600">{overdueTasks.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4 text-black">My Tasks</h2>
          <ul className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <li key={task.id} className="border-b pb-2">
                <h3 className="font-medium text-black">{task.title}</h3>
                <p className="text-sm text-gray-600">
                  Status: {task.status} | Project: {task.projectName} | Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                </p>
              </li>
            ))}
          </ul>
          {tasks.length > 5 && <p className="text-sm text-gray-500 mt-2 text-black">... and {tasks.length - 5} more</p>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4 text-black">My Projects</h2>
          <ul className="space-y-2">
            {projects.slice(0, 5).map(project => (
              <li key={project.id} className="border-b pb-2">
                <h3 className="font-medium text-black">{project.name}</h3>
                <p className="text-sm text-gray-600">
                  Created by: {project.createdByName} | Members: {project.memberNames || 'None'}
                </p>
              </li>
            ))}
          </ul>
          {projects.length > 5 && <p className="text-sm text-gray-500 mt-2 text-black">... and {projects.length - 5} more</p>}
        </div>
      </div>
    </div>
  );
}
