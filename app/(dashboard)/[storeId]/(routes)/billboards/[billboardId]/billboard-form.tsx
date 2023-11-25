"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Store } from "@prisma/client";
import { Trash } from "lucide-react";
import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AlertModal from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
import UseOrigin from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps {
	initialData: Billboard | null;
}

const formSchema = z.object({
	label: z.string().min(1),
	imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const title = initialData ? "Edit Billboard" : "Create Billboard";
	const description = initialData
		? "Edit a Billboard"
		: "Create a new Billboard";
	const toastMsg = initialData
		? "Billboard updated successfully!"
		: "Billboard created successfully!";
	const action = initialData ? "Save Changes" : "Create Billboard";

	const { storeId, billboardId } = useParams();
	const router = useRouter();
	const origin = UseOrigin();

	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			label: "",
			imageUrl: "",
		},
	});

	const onSubmit = async (data: BillboardFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(`/api/${storeId}/billboards/${billboardId}`, data);
			} else {
				await axios.post(`/api/${storeId}/billboards`, data);
			}
			router.refresh();
			router.push(`/${storeId}/billboards`);
			toast.success(toastMsg);
			console.log(data);
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong!");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
			router.refresh();
			router.push(`/${storeId}/billboards`);
			toast.success("Billboard deleted successfully!");
		} catch (error) {
			toast.error(
				"Make Sure you remove all categories using this billboard first"
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
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className='flex items-center justify-between'>
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={loading}
						variant='destructive'
						size='sm'
						onClick={() => {
							setOpen(true);
						}}
					>
						<Trash className='h-4 w-4' />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 w-full'
				>
					<FormField
						control={form.control}
						name='imageUrl'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Background Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange("")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='label'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder='Billboard Label'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className=''>
						{action}
					</Button>
				</form>
			</Form>
			<Separator />
		</>
	);
};

export default BillboardForm;
