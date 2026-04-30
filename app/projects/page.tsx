'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdByName: string | null;
  memberNames: string | null;
}

export default function Projects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberEmails, setMemberEmails] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchProjects();
  }, [session, status]);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        memberEmails: memberEmails.split(',').map(email => email.trim()).filter(email => email),
      }),
    });

    if (res.ok) {
      setName('');
      setDescription('');
      setMemberEmails('');
      setShowForm(false);
      fetchProjects();
    } else {
      alert('Failed to create project');
    }
  };

  if (status === 'loading') return <div className="p-6">Loading...</div>;

return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Create Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700">
              Member Emails (comma-separated)
            </label>
            <input
              type="text"
              value={memberEmails}
              onChange={(e) => setMemberEmails(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black bg-white"
              placeholder="user1@example.com, user2@example.com"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create Project
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
<div key={project.id} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2 text-black">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description || 'No description'}</p>
            <p className="text-sm text-gray-500">Created by: {project.createdByName}</p>
            <p className="text-sm text-gray-500">Members: {project.memberNames || 'None'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}