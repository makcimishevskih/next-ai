import { z } from 'zod';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server';
import { formSchema } from '@/app/(root)/(routes)/companion/[companionId]/components/schema';

type PatchParams = {
   params : {
     companionId : string 
  }
}

export async function PATCH(req: Request, { params } : PatchParams
) {
  try {
    const body: z.infer<typeof formSchema> = await req.json();
    const user = await currentUser();

    if (!params.companionId) {
      return new NextResponse("Companion ID is required", { status: 400 });
    }

    const {src, name, description, instructions, seed, categoryId} = body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status:401 });
    }
    if (!src || !name || !description || !instructions|| !seed || !categoryId) {
      return new NextResponse("Missing required fields", { status:400 });
    }
    
    // TODO: CHECK FOR SUBSCRIPTION

    const companion = await prismadb.companion.update({
      where: {
        userId: user.id,
        id: params.companionId
      },
      data: {
        userId: user.id,
        userName: user.firstName,
        ...body
      }
    });
    return NextResponse.json(companion);
  } catch (err) {
    console.log("[COMPANION_PATCH]", err);
    return new NextResponse(`[COMPANION_PATCH] Internal Error: ${err}`, { status: 500 });
  }
}

export async function DELETE (req: Request, { params }:PatchParams ) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse(`[COMPANION_DELETE] Unauthorized`, { status: 401 })
    }
    
    const companion = await prismadb.companion.delete({
      where: {
        userId,
        id: params.companionId
      }
    });
    
    return NextResponse.json(companion);
  } catch(err) {
    return new NextResponse(`[COMPANION_DELETE] Internal Error: ${err}`, { status: 500 })
  }


}