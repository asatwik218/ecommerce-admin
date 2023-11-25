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
		const { name, value } = body;

		if (!userId) {
			return new NextResponse("UnAuthenticated", { status: 401 });
		}

		if (!name) {
			return new NextResponse("missing Name", { status: 400 });
		}
		if (!value) {
			return new NextResponse("missing Value", { status: 400 });
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

		const color = await prismadb.color.create({
			data: {
				name,
				value,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(color);
	} catch (error) {
		console.log("[Color_POST]", error);
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
    const colors = await prismadb.color.findMany({
      where:{
        storeId:params.storeId,
      }
    })
		return NextResponse.json(colors);
	} catch (error) {
		console.log("[Colors_GET]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}