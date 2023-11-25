"use client";
import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type ColorsColumn = {
	id: string;
	name: string;
	value: string;
	createdAt: string;
};

export const columns: ColumnDef<ColorsColumn>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "value",
		header: "Value",
		cell: ({ row }) => (
			<div>
				{row.original.value}
				<div
					className='h-6 w-6 rounded-full border'
					style={{ backgroundColor: row.original.value }}
				/>
			</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Date",
	},
	{
		id: "action",
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
