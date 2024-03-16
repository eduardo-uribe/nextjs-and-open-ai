import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function getUserByClerkId() {
  try {
    const { userId } = await auth();

    // replace with mongodb custom query language
    const client = await clientPromise;
    const db = client.db('journal');

    const user = await db.collection('User').findOne({
      clerkId: `${userId}`,
    });

    const userdata = {
      id: user?._id.toString(),
      clerkId: user.clerkId,
      email: user.email,
    };

    return userdata;
  } catch (error) {}
}
