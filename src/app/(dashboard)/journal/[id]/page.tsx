import Editor from '@/components/Editor';
import { getUserByClerkId } from '@/utils/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getEntry(id: string) {
  try {
    const user = await getUserByClerkId();

    const client = await clientPromise;
    const db = await client.db('journal');

    const entry = await db
      .collection('JournalEntry')
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            userId: user.id,
          },
        },
        { $addFields: { entry_id: { $toString: '$_id' } } },
        {
          $lookup: {
            from: 'Analysis',
            localField: 'entry_id',
            foreignField: 'entryId',
            as: 'analysis',
          },
        },
        {
          $unwind: {
            path: '$analysis',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    const entrydata = entry[0];
    entrydata._id = entrydata._id.toString();
    entrydata.analysis._id = entrydata.analysis._id.toString();

    return entrydata;
  } catch (error) {
    console.log(error);
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id);

  return (
    <div className='h-full w-full'>
      <Editor entry={entry} />
    </div>
  );
}
