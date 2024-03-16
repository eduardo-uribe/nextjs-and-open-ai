import { getUserByClerkId } from '@/utils/auth';
import { qa } from '@/utils/ai';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  const { question } = await request.json();
  const user = await getUserByClerkId();

  const client = await clientPromise;
  const db = client.db('JournalEntry');

  const entries = await db
    .collection('JournalEntry')
    .find({ userId: user.id })
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
