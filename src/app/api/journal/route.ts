import { analyze } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// route handler
export async function POST(request: Request) {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: 'Write about your day.',
    },
  });

  const analysis = await analyze(entry.content);
  await prisma.analysis.create({
    data: {
      userId: user.id,
      entryId: entry.id,
      ...analysis,
    },
  });

  revalidatePath('/journal');

  return NextResponse.json({ data: entry });
}
