import { getUserByClerkId } from '@/utils/auth';
import prisma from '@/utils/prisma';
import { qa } from '@/utils/ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { question } = await request.json();
  const user = await getUserByClerkId();

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  const answer = await qa(question, entries);

  return NextResponse.json({ data: answer });
}
