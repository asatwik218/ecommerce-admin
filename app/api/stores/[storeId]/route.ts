import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse("UNAUTHORIZED", { status: 401 });
		}

		const body = await req.json();
		const { name } = body;

		if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
		}
    if(!params.storeId){
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where:{ 
        id:params.storeId,
        userId
      },
      data:{
        name
      }
    })
    return NextResponse.json(store);

	} catch (error) {
		console.log("[Store_Patch]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse("UNAUTHORIZED", { status: 401 });
		}

    if(!params.storeId){
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where:{ 
        id:params.storeId,
        userId
      }
    })
    return NextResponse.json(store);

	} catch (error) {
		console.log("[Store_Delete]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}
