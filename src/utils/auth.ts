import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserByClerkId() {
  const { userId } = await auth();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId,
    },
  });

  return user;
}
