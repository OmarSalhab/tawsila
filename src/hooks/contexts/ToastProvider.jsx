import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ToastContext } from "./useToast";
import { Info } from "lucide-react";

export const ToastProvider = ({ children }) => {
	// The whole application ...
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback((message, type = "info") => {
		const id = Math.random().toString(36).substr(2, 9);
		setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

		// Auto remove toast after 3 seconds
		setTimeout(() => {
			setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
		}, 3000);
	}, []);

	const removeToast = useCallback((id) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ addToast, removeToast }}>
			{children}
			{createPortal(
				<div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2">
					{toasts.map((toast) => (
						<div
							key={toast.id}
							className={`px-6 py-5 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out flex gap-2 items-center max-w-[320px]  ${
								toast.type === "success"
									? "bg-primary"
									: toast.type === "error"
									? "bg-secondary"
									: "bg-gray-400"
							} text-gray-900 font-medium font-sans`}
							style={{
								animation: "slideIn 0.3s ease-out",
							}}
						>
							<Info className="min-w-6 min-h-6 text-gray-900" />
							{toast.message}
						</div>
					))}
				</div>,
				document.body
			)}
		</ToastContext.Provider>
	);
};
