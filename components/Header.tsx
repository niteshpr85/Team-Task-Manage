'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <header className="bg-blue-600 text-white p-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-90">
          Team Task Manager
        </Link>
        {session ? (
          <nav className="flex items-center space-x-8 gap-6">
            <Link href="/" className="text-lg font-medium hover:underline hover:text-blue-100 transition">
              Dashboard
            </Link>
            <Link href="/projects" className="text-lg font-medium hover:underline hover:text-blue-100 transition">
              Projects
            </Link>
            <Link href="/tasks" className="text-lg font-medium hover:underline hover:text-blue-100 transition">
              Tasks
            </Link>
            <span className="text-base font-medium px-4 py-2 bg-blue-700 rounded-lg">
              Welcome, {session.user?.name} ({session.user?.role})
            </span>
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </nav>
        ) : (
          <nav className="flex space-x-6 gap-4">
            <Link href="/login" className="text-lg font-medium hover:underline hover:text-blue-100 transition">
              Login
            </Link>
            <Link href="/signup" className="text-lg font-medium hover:underline hover:text-blue-100 transition px-4 py-2 bg-blue-700 rounded-lg">
              Sign Up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}