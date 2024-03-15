import Editor from '@/components/Editor';
import { getUserByClerkId } from '@/utils/auth';
import clientPromise from '@/lib/mongodb';

// import prisma from '@/utils/prisma';

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
            _id: id,
            userId: user.id,
          },
        },
        {
          $lookup: {
            from: 'Analysis', // Name of the collection to join with
            localField: '_id', // Field in the JournalEntry collection
            foreignField: 'entryId', // Field in the analysis collection
            as: 'analysis', // Name for the joined field in the result
          },
        },
        { $unwind: '$analysis' }, // Flatten the array of analysis documents
      ])
      .toArray();

    // Now 'entry' will contain the populated 'analysis' field

    // const entry = await prisma.journalEntry.findUnique({
    //   where: {
    //     id,
    //     userId: user.id,
    //   },
    //   include: {
    //     analysis: true,
    //   },
    // });

    return entry;
  } catch (error) {
    console.log(error);
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id);

  console.log('JOURNAL/ID SERVER COMPONENT PAGE');
  console.log(entry);

  return (
    <div className='h-full w-full'>
      <p>TESTING THIS PAGE!</p>
      {/* <Editor entry={entry} /> */}
    </div>
  );
}
