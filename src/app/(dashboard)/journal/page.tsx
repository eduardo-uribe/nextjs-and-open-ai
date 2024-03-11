import prisma from '@/utils/prisma';
import { analyze } from '@/utils/ai';
import { getUserByClerkId } from '../../../utils/auth';
import NewEntryCard from '@/components/NewEntryCard';
import EntryCard from '@/components/EntryCard';
import Link from 'next/link';
import Questions from '@/components/Questions';

async function getEntries() {
  const user = await getUserByClerkId();

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return entries;
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
          return (
            <Link href={`/journal/${entry.id}`} key={entry.id}>
              <EntryCard entry={entry} />
            </Link>
          );
        })}
      </section>
    </main>
  );
}