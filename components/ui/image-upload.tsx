"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

type ImageUploadProps = {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: string[];
};

const ImageUpload = ({
	disabled,
	onChange,
	onRemove,
	value,
}: ImageUploadProps) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onUpload = (result: any) => {
		onChange(result.info.secure_url);
	};

	//to prevent any hydration error
	//until the life cycle function (use effect) has run which can only happen in client side we return null
	if (!isMounted) return null;

	return (
		<div>
			<div className='mb-4 flex items-center gap-4'>
				{value.map((url) => (
					<div
						key={url}
						className='relative w-[200px] h-[200px] rounded-md overflow-hidden'
					>
						<div className='z-10 absolute top-2 right-2'>
							<Button
								type='button'
								onClick={() => onRemove(url)}
								variant='destructive'
								size='sm'
							>
								<Trash className='h-4 w-4' />
							</Button>
						</div>
						<Image fill className='object-cover' alt='image' src={url} />
					</div>
				))}
			</div>
			<CldUploadWidget onUpload={onUpload} uploadPreset='urmq7hba'>
				{({ open }) => {
					const onClick = () => {
						open();
					};
					return (
						<Button
							className='button'
							onClick={onClick}
							type='button'
							variant='secondary'
							disabled={disabled}
						>
							<ImagePlus className='mr-2 w-4 h-4' />
							Upload an Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
