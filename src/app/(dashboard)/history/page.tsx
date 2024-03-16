import HistoryChart from '@/components/HistoryChart';
import { auth } from '@clerk/nextjs';
import clientPromise from '@/lib/mongodb';

async function getData() {
  const { userId }: { userId: string | null } = auth();

  const client = await clientPromise;
  const db = await client.db('journal');

  const analyses = await db.collection('Analysis').find({ userId }).toArray();
  // const analyses = await prisma.analysis.findMany({
  //   where: {
  //     userId: user.id,
  //   },
  //   orderBy: {
  //     createdAt: 'asc',
  //   },
  // });

  const sum = analyses.reduce(
    (all, current) => all + current.sentimentScore,
    0
  );
  const avg = Math.round(sum / analyses.length);

  return { analyses, avg };
}

export default async function Page() {
  const { avg, analyses } = await getData();

  return (
    <div className='w-full h-full'>
      <div>{`Avg. Sentiment ${avg}`}</div>
      <div className='w-full h-full'>
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
}
