import { analyze } from '@/utils/ai';
import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { userId }: { userId: string | null } = auth();

    // mongodb client connection
    const client = await clientPromise;
    const db = await client.db('journal');

    // create a journal entry document
    const doc = await db.collection('JournalEntry').insertOne({
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      content: 'Write about your day',
    });

    // read the created document
    const entry = await db
      .collection('JournalEntry')
      .findOne(new ObjectId(doc.insertedId.toString()));

    entry._id = entry?._id.toString();

    const analysis = await analyze(entry.content);

    await db.collection('Analysis').insertOne({
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      entryId: entry._id,
      ...analysis,
    });

    revalidatePath('/journal');

    return NextResponse.json(entry);
  } catch (error) {
    console.log(error);
  }
}
