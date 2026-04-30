import { authOptions } from '@/lib/auth';
import { createProject, getProjectsForUser, getUserByEmail } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = getProjectsForUser(session.user.id);
    return NextResponse.json(projects);
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

    const { name, description, memberEmails } = await request.json();

    const memberIds = memberEmails.map((email: string) => {
      const user = getUserByEmail(email);
      return user?.id;
    }).filter(Boolean);

    const project = createProject({
      id: crypto.randomUUID(),
      name,
      description,
      createdBy: session.user.id,
      memberIds,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}