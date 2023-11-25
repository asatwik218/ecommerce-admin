import React from "react";
import BillboardForm from "./size-form";

const SizePage = async ({
	params,
}: {
	params: { sizeId: string };
}) => {
  const size = await prisma.size.findUnique({
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
