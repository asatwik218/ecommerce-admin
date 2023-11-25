"use client";
import React, { useState } from "react";
import { CategoryColumn } from "./columns";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";

type Props = {
	data: CategoryColumn;
};

const CellAction = ({ data }: Props) => {
	const router = useRouter();
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const onCopy = (id: string) => {
		window.navigator.clipboard.writeText(id);
		toast.success("Category ID Copied to clipboard!");
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
			router.refresh();
			toast.success("Category deleted successfully!");
		} catch (error) {
			toast.error(
				"Make Sure you remove all produces using this category first"
			);
			console.log(error);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};
	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => {
					setOpen(false);
				}}
				onConfirm={onDelete}
				loading={loading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant={"ghost"} className='h-8 w-8 p-0'>
						<span className='sr-only'>Open Menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => {
							onCopy(data.id);
						}}
					>
						<Copy className='mr-2 h-4 w-4 ' />
						Copy
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							router.push(`/${params.storeId}/categories/${data.id}`);
						}}
					>
						<Edit className='mr-2 h-4 w-4 ' />
						Update
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setOpen(true);
						}}
					>
						<Trash className='mr-2 h-4 w-4 ' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default CellAction;
