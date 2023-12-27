import React from "react";
import BillboardForm from "./size-form";
import prismadb from "@/lib/prismadb";

const SizePage = async ({
	params,
}: {
	params: { sizeId: string };
}) => {
  const size = await prismadb.size.findUnique({
    where:{
      id:params.sizeId
    }
  })

  size?console.log(size):console.log("no size");




	return <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BillboardForm initialData={size}/>
    </div>
  </div>;
};

export default SizePage;
