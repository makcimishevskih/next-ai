import { z } from 'zod';
import prismadb from '@/lib/prismadb';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server'
import { formSchema } from '@/app/(root)/(routes)/companion/[companionId]/components/schema';
 
export async function POST(
  req: Request
) {
  try {
    const body: z.infer<typeof formSchema> = await req.json();
    const user = await currentUser();

    const {src, name, description, instructions, seed, categoryId} = body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status:401 });
    }
    if (!src || !name || !description || !instructions|| !seed || !categoryId) {
      return new NextResponse("Missing required fields", { status:400 });
    }

    // TODO: CHECK FOR SUBSCRIPTION

    const companion = await prismadb.companion.create({
      data: {
        userId: user.id,
        userName: user.firstName,
        ...body
      }
    });

    return NextResponse.json(companion);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}