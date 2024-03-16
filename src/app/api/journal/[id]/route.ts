import { analyze } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { updateEntry } from '@/utils/api';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const content: string = await request.json();
  const user = await getUserByClerkId();

  const client = await clientPromise;
  const db = client.db('journal');

  const updatedEntry = await db.collection('JournalEntry').findOneAndUpdate(
    {
      _id: new ObjectId(params.id),
      userId: user.id,
    },
    {
      $set: { content: content },
    },
    {
      returnDocument: 'after',
    }
  );

  updatedEntry._id = updatedEntry._id.toString();

  const analysis = await analyze(updatedEntry.content);

  const updatedAnalysis = await db.collection('Analysis').findOneAndUpdate(
    {
      entryId: updatedEntry._id,
    },
    {
      $set: {
        sentimentScore: analysis?.sentimentScore,
        mood: analysis?.mood,
        summary: analysis?.summary,
        subject: analysis?.subject,
        negative: analysis?.negative,
        color: analysis?.color,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    }
  );

  updatedAnalysis._id = updatedAnalysis._id.toString();

  revalidatePath('/journal');
  return NextResponse.json({ ...updatedEntry, analysis: updatedAnalysis });
}
