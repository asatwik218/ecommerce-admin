import React from "react";
import BillboardForm from "./billboard-form";

const BillboardPage = async ({
	params,
}: {
	params: { billboardId: string };
}) => {
  const billboard = await prisma.billboard.findUnique({
    where:{
      id:params.billboardId
    }
  })

  billboard?console.log(billboard):console.log("no billboard");




	return <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BillboardForm initialData={billboard}/>
    </div>
  </div>;
};

export default BillboardPage;
