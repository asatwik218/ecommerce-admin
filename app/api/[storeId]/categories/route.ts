import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { name, billboardId } = body;

		if (!userId) {
			return new NextResponse("UnAuthenticated", { status: 401 });
		}

		if (!name) {
			return new NextResponse("missing Category Name", { status: 400 });
		}
		if (!billboardId) {
			return new NextResponse("missing Billboard Id", { status: 400 });
		}
    if (!params.storeId) {
			return new NextResponse("missing Store Id", { status: 400 });
		}
    const storeByUserId = await prismadb.store.findFirst({
      where:{
        id:params.storeId,
        userId
      }
    })
    if(!storeByUserId){
      return new NextResponse("UnAuthorised Access", { status: 403 });
    }

		const category = await prismadb.category.create({
			data: {
				name,
				billboardId,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORIES_POST]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		
    if (!params.storeId) {
			return new NextResponse("missing Store Id", { status: 400 });
		}
    const category = await prismadb.category.findMany({
      where:{
        storeId:params.storeId,
      }
    })
		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORIES_GET]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}