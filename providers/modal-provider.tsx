"use client";
import React,{ useEffect, useState } from "react";


import StoreModal from "@/components/modals/store-modal";



const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	//to prevent any hydration error
	//until the life cycle function (use effect) has run which can only happen in client side we return null
	if (!isMounted) return null;

	return (
		<>
			<StoreModal />
		</>
	);
};

export default ModalProvider;
