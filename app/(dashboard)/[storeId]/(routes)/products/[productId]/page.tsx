import React from "react";
import ProductForm from "./product-form";

const ProductPage = async ({
	params,
}: {
	params: { storeId : string, productId: string };
}) => {
  const product = await prisma.product.findUnique({
    where:{
      id:params.productId
    },
    include:{
      images:true
    }

  })
  const categories = await prisma.category.findMany({
    where:{
      storeId:params.storeId
    }
  })
  const sizes = await prisma.size.findMany({
    where:{
      storeId:params.storeId
    }
  })
  const colors = await prisma.color.findMany({
    where:{
      storeId:params.storeId
    }
  })

  product?console.log(product):console.log("no product");

	return <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductForm initialData={product} categories={categories} colors={colors} sizes={sizes}/>
    </div>
  </div>;
};

export default ProductPage;