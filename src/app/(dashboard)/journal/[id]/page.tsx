import Editor from '@/components/Editor';
import { getUserByClerkId } from '@/utils/auth';
import prisma from '@/utils/prisma';

async function getEntry(id) {
  const user = await getUserByClerkId();

  const entry = await prisma.journalEntry.findUnique({
    where: {
      id,
      userId: user.id,
    },
    include: {
      analysis: true,
    },
  });

  return entry;
}

export default async function Page({ params }) {
  const entry = await getEntry(params.id);

  return (
    <div className='h-full w-full'>
      <Editor entry={entry} />
    </div>
  );
}
