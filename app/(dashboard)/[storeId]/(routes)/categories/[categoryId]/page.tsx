import React from "react";
import CategoryForm from "./category-form";
import prismadb from "@/lib/prismadb";

const CategoryPage = async ({ params }: { params: { storeId:string, categoryId: string } }) => {
	console.log(params.categoryId);
	const category = await prismadb.category.findUnique({
		where: {
			id: params.categoryId,
		},
	});

	const billboards = await prismadb.billboard.findMany({
		where:{
			storeId:params.storeId
		}
	})

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<CategoryForm billboards={billboards} initialData={category} />
			</div>
		</div>
	);
};

export default CategoryPage;
