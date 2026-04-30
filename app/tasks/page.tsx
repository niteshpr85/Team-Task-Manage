'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  projectName: string | null;
  assignedToName: string | null;
}

interface Project {
  id: string;
  name: string;
}

export default function Tasks() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedToEmail, setAssignedToEmail] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        status: taskStatus,
        dueDate: dueDate || null,
        projectId: projectId || null,
        assignedToEmail: assignedToEmail || null,
      }),
    });

    if (res.ok) {
      setTitle('');
      setDescription('');
      setTaskStatus('todo');
      setDueDate('');
      setProjectId('');
      setAssignedToEmail('');
      setShowForm(false);
      fetchData();
    } else {
      alert('Failed to create task');
    }
  };

const updateTaskStatus = async (taskId: string, newStatus: string) => {
    // For completing a task, ask for confirmation
    if (newStatus === 'done') {
      const confirmed = confirm('Are you sure you want to mark this task as done?');
      if (!confirmed) return;
    }
    
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      fetchData();
    } else {
      alert('Failed to update task');
    }
  };

  if (status === 'loading') return <div className="p-6">Loading...</div>;

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Create Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black bg-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black bg-white"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black bg-white"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black bg-white"
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Assign to (Email)</label>
            <input
              type="email"
              value={assignedToEmail}
              onChange={(e) => setAssignedToEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black bg-white"
              placeholder="user@example.com"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create Task
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-600">To Do</h2>
<ul className="space-y-2">
            {todoTasks.map(task => (
              <li key={task.id} className="border p-3 rounded">
                <h3 className="font-medium text-black">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">Project: {task.projectName}</p>
                <p className="text-sm text-gray-500">Assigned to: {task.assignedToName}</p>
                <p className="text-sm text-gray-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                <div className="mt-2">
                  <button
                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Start
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">In Progress</h2>
<ul className="space-y-2">
            {inProgressTasks.map(task => (
              <li key={task.id} className="border p-3 rounded">
                <h3 className="font-medium text-black">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">Project: {task.projectName}</p>
                <p className="text-sm text-gray-500">Assigned to: {task.assignedToName}</p>
                <p className="text-sm text-gray-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                <div className="mt-2">
                  <button
                    onClick={() => updateTaskStatus(task.id, 'done')}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => updateTaskStatus(task.id, 'todo')}
                    className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Back to To Do
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Done</h2>
<ul className="space-y-2">
            {doneTasks.map(task => (
              <li key={task.id} className="border p-3 rounded">
                <h3 className="font-medium text-black">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">Project: {task.projectName}</p>
                <p className="text-sm text-gray-500">Assigned to: {task.assignedToName}</p>
                <p className="text-sm text-gray-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                <div className="mt-2">
                  <button
                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Reopen
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}