import { authOptions } from '@/lib/auth';
import { createTask, getUserTasks } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = getUserTasks(session.user.id);
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, status, assignedToEmail, projectId, dueDate } = await request.json();

    const task = createTask({
      id: crypto.randomUUID(),
      title,
      description,
      status: status || 'todo',
      assignedToEmail,
      projectId,
      dueDate,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}