import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client'; // remove
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';

// const prisma = new PrismaClient();

async function createNewUser() {
  try {
    const client = await clientPromise;
    const db = await client.db('journal');

    // clerk user data
    const user = await currentUser();

    // check if the user already exist
    // const match = await prisma.user.findUnique({
    //   where: {
    //     clerkId: user.id as string,
    //   },
    // });
    const match = await db.collection('User').findOne({
      clerkId: user.id,
    });

    // if the user doesn't already exist create a new user
    if (!match) {
      // await prisma.user.create({
      //   data: {
      //     clerkId: user.id,
      //     email: user?.emailAddresses[0].emailAddress,
      //   },
      // });
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
