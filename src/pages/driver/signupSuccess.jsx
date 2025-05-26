import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

const SignupSuccess = () => {
	const [showAnimation, setShowAnimation] = useState(false);

	useEffect(() => {
		// Trigger animation after component mounts
		const timer = setTimeout(() => {
			setShowAnimation(true);
		}, 300);

		return () => clearTimeout(timer);
	}, []);

	const handleBackToLogin = () => {};

	return (
		<div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4">
			<div className="text-center space-y-8 max-w-md mx-auto">
				{/* Animated Check Icon */}
				<div className="flex justify-center">
					<div
						className={`transform transition-all duration-1000 ${
							showAnimation
								? "scale-100 rotate-0 opacity-100"
								: "scale-50 rotate-180 opacity-0"
						}`}
					>
						<CheckCircle
							className="w-24 h-24 text-green-400 animate-pulse"
							strokeWidth={2}
						/>
					</div>
				</div>

				{/* Success Message */}
				<div
					className={`space-y-4 transform transition-all duration-1000 delay-500 ${
						showAnimation
							? "translate-y-0 opacity-100"
							: "translate-y-8 opacity-0"
					}`}
				>
					<h1 className="text-2xl font-bold text-white">
						Driver Documents Sent Successfully!
					</h1>
					<p className="text-white text-lg leading-relaxed">
						We have received your driver application and documents. Please wait
						for review - this process typically takes 1 to 2 business days.
					</p>
					<p className="text-white opacity-80 text-sm">
						You will be notified via phone once your application is approved.
					</p>
				</div>

				{/* Back Button */}
				<div
					className={`transform transition-all duration-1000 delay-1000 ${
						showAnimation
							? "translate-y-0 opacity-100"
							: "translate-y-8 opacity-0"
					}`}
				>
					<button
						onClick={handleBackToLogin}
						className="bg-white text-primary px-8 py-3 text-lg font-semibold rounded-md "
					>
						Back to Login
					</button>
				</div>
			</div>
		</div>
	);
};

export default SignupSuccess;
