import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import clientPromise from '@/lib/mongodb';
import { qa } from '@/utils/ai';

export async function POST(request: Request) {
  const { question } = await request.json();
  const { userId }: { userId: string | null } = auth();

  const client = await clientPromise;
  const db = client.db('JournalEntry');

  const entries = await db
    .collection('JournalEntry')
    .find({ userId })
    .toArray();
  // const entries = await prisma.journalEntry.findMany({
  //   where: {
  //     userId: user.id,
  //   },
  //   select: {
  //     id: true,
  //     content: true,
  //     createdAt: true,
  //   },
  // });

  const answer = await qa(question, entries);

  return NextResponse.json({ data: answer });
}
