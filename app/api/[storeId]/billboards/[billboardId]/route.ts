import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {

		if (!params.billboardId) {
			return new NextResponse("Billboard Id is Required", { status: 400 });
		}

		const billboard = await prismadb.billboard.findFirst({
			where: {
				id: params.billboardId,
			},
		});


		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[Billboard_GET]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse("UNAUTHORIZED", { status: 401 });
		}

		const body = await req.json();
		const { label, imageUrl } = body;

		if (!label) {
			return new NextResponse("Label is Required", { status: 400 });
		}
		if (!imageUrl) {
			return new NextResponse("Image url is Required", { status: 400 });
		}
		if (!params.billboardId) {
			return new NextResponse("Billboard Id is Required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
		if (!storeByUserId) {
			return new NextResponse("UnAuthorised Access", { status: 403 });
		}

		const billboard = await prismadb.billboard.updateMany({
			where: {
				id: params.billboardId,
			},
			data: {
				label,
				imageUrl,
			},
		});
		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[Billboard_Patch]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse("UNAUTHORIZED", { status: 401 });
		}

		if (!params.billboardId) {
			return new NextResponse("Billboard Id is Required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
		if (!storeByUserId) {
			return new NextResponse("UnAuthorised Access", { status: 403 });
		}

		const billboard = await prismadb.billboard.deleteMany({
			where: {
				id: params.billboardId,
			},
		});
		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[Billboard_Delete]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}
