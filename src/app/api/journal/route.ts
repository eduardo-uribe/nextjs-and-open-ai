import { analyze } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// import prisma from '@/utils/prisma';

// route handler
export async function POST(request: Request) {
  try {
    const user = await getUserByClerkId();

    const client = await clientPromise;
    const db = await client.db('journal');

    const doc = await db.collection('JournalEntry').insertOne({
      userId: user.id,
      content: 'Write about your day',
    });

    const entry = await db
      .collection('JournalEntry')
      .findOne(new ObjectId(doc.insertedId.toString()));

    const entryData = {
      id: entry?._id.toString(),
      userId: entry.userId,
      content: entry.content,
    };

    const analysis = await analyze(entry.content);

    await db.collection('Analysis').insertOne({
      userId: user.id,
      entryId: entry._id.toString(),
      ...analysis,
    });

    revalidatePath('/journal');

    return NextResponse.json(entryData);
  } catch (error) {
    console.log(error);
  }
}
