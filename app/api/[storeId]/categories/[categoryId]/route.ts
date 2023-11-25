import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {

		if (!params.categoryId) {
			return new NextResponse("Category Id is Required", { status: 400 });
		}

		const category = await prismadb.category.findFirst({
			where: {
				id: params.categoryId,
			},
			include:{
				billboard:true
			}
		});


		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse("UNAUTHORIZED", { status: 401 });
		}

		const body = await req.json();
		const { name, billboardId } = body;

		if (!name) {
			return new NextResponse("name is Required", { status: 400 });
		}
		if (!billboardId) {
			return new NextResponse("BillboardID is Required", { status: 400 });
		}
		if (!params.categoryId) {
			return new NextResponse("CategoryID is Required", { status: 400 });
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

		const category = await prismadb.category.updateMany({
			where: {
				id: params.categoryId,
			},
			data: {
				name,
				billboardId,
			},
		});
		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_Patch]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse("UNAUTHORIZED", { status: 401 });
		}

		if (!params.categoryId) {
			return new NextResponse("Category Id is Required", { status: 400 });
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

		const category = await prismadb.category.deleteMany({
			where: {
				id: params.categoryId,
			},
		});
		return NextResponse.json(category);
	} catch (error) {
		console.log("[Category_Delete]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}
