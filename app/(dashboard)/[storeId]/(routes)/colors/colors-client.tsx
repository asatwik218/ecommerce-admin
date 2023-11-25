"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ColorsColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

type Props = {
	data: ColorsColumn[];
};

const ColorsClient = ({ data }: Props) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Colors(${data.length})`}
					description='Manage Colors for your store'
				/>
				<Button
					onClick={() => {
						router.push(`/${params.storeId}/colors/new`);
					}}
				>
					<Plus className='mr-2 h-4 w-4' />
					Add New
				</Button>
			</div>
			<Separator/>
			<DataTable searchKey={"name"} columns={columns} data={data} />
			<Heading title="API" description="API calls for Colors"/>
			<Separator/>
			<ApiList entityName="colors" entityIdName="colorId"/>
		</>
	);
};

export default ColorsClient;
