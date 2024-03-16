import { analyze } from '@/utils/ai';
import { getUserByClerkId } from '../../../utils/auth';
import NewEntryCard from '@/components/NewEntryCard';
import EntryCard from '@/components/EntryCard';
import Link from 'next/link';
import Questions from '@/components/Questions';
import clientPromise from '@/lib/mongodb';

async function getEntries() {
  try {
    const user = await getUserByClerkId();

    const client = await clientPromise;
    const db = await client.db('journal');

    const entries = await db
      .collection('JournalEntry')
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return entries;
  } catch (error) {}
}

export default async function Page() {
  const entries = await getEntries();

  return (
    <main className='p-10 bg-zinc-400/10 h-full'>
      <h2 className='text-3xl mb-8'>Journal</h2>
      <div className='my-8'>
        <Questions />
      </div>
      <section className='grid grid-cols-3 gap-4'>
        <NewEntryCard />
        {entries.map(function (entry) {
          entry._id = entry._id.toString();
          return (
            <Link href={`/journal/${entry._id}`} key={entry._id}>
              <EntryCard entry={entry} />
            </Link>
          );
        })}
      </section>
    </main>
  );
}
