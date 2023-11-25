"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size, Store } from "@prisma/client";
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

interface SizeFormProps {
	initialData: Size | null;
}

const formSchema = z.object({
	name: z.string().min(1),
	value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm = ({ initialData }: SizeFormProps) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const title = initialData ? "Edit Size" : "Create Size";
	const description = initialData ? "Edit a Size" : "Create a new Size";
	const toastMsg = initialData
		? "Size updated successfully!"
		: "Size created successfully!";
	const action = initialData ? "Save Changes" : "Create Size";

	const { storeId, sizeId } = useParams();
	const router = useRouter();
	const origin = UseOrigin();

	const form = useForm<SizeFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: "",
			value: "",
		},
	});

	const onSubmit = async (data: SizeFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(`/api/${storeId}/sizes/${sizeId}`, data);
			} else {
				await axios.post(`/api/${storeId}/sizes`, data);
			}
			router.refresh();
			router.push(`/${storeId}/sizes`);
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
			await axios.delete(`/api/${storeId}/sizes/${sizeId}`);
			router.refresh();
			router.push(`/${storeId}/sizes`);
			toast.success("Size deleted successfully!");
		} catch (error) {
			toast.error(
				"Make Sure you remove all products using this size first"
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
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder='Size Name'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder='Size Value'
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

export default SizeForm;
