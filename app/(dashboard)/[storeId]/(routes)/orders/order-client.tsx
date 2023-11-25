"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { OrdersColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

type Props = {
	data: OrdersColumn[];
};

const OrderClient = ({ data }: Props) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<Heading
				title={`Order (${data.length})`}
				description='Manage Orders for your store'
			/>

			<Separator />
			<DataTable searchKey={"products"} columns={columns} data={data} />
		</>
	);
};

export default OrderClient;
