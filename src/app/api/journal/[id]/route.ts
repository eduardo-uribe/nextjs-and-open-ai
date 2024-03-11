import { analyze } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function PATCH(request: Request, { params }) {
  const { content } = await request.json();
  const user = await getUserByClerkId();

  const updatedEntry = await prisma.journalEntry.update({
    where: {
      id: params.id,
      userId: user.id,
    },
    data: {
      content,
    },
  });

  const analysis = await analyze(updatedEntry.content);

  const updated = await prisma.analysis.upsert({
    where: {
      entryId: updatedEntry.id,
    },
    update: { ...analysis },
    create: {
      userId: user.id,
      entryId: updatedEntry.id,
      ...analysis,
    },
  });

  revalidatePath('/journal');

  return NextResponse.json({ data: { ...updatedEntry, analysis: updated } });
}
