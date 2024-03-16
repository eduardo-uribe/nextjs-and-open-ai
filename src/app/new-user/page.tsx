import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';

async function createNewUser() {
  try {
    const client = await clientPromise;
    const db = await client.db('journal');

    // clerk user data
    const user = await currentUser();

    const match = await db.collection('User').findOne({
      clerkId: user.id,
    });

    // if the user doesn't already exist create a new user
    if (!match) {
      await db.collection('User').insertOne({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      });
    }

    redirect('/journal');
  } catch (error) {
    console.log(error);
  }
}

export default async function Page() {
  await createNewUser();
  return <h1>Loading...</h1>;
}
