import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

async function createNewUser() {
  const user = await currentUser();

  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id as string,
    },
  });

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user?.emailAddresses[0].emailAddress,
      },
    });
  }

  redirect('/journal');
}

export default async function Page() {
  await createNewUser();
  return <h1>Loading...</h1>;
}
