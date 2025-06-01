import { Lock, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/contexts/useAuth";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../../hooks/contexts/useToast";
export default function Login() {
	const navigate = useNavigate();
	const { login, loading, error, isAuthenticated } = useAuth();
	const [loginForm, setLoginForm] = useState({
		phone: "",
		password: "",
	});
	const { addToast } = useToast();
	const isFirstRender = useRef(true);

	useEffect(() => {
		// Skip the first render
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (error?.msg ) {
			if(error?.msg === 'No refresh token') return 
			addToast(error.msg, "error");
		}
		if (isAuthenticated) {
			navigate("/home-passenger");
		}
	}, [error, addToast, navigate, isAuthenticated]);

	async function handleLoginSubmit(e) {
		e.preventDefault();
		if (!loginForm.phone || !loginForm.password) return;
		await login(loginForm);
	}
	function handlePhoneChange(e) {
		setLoginForm({ ...loginForm, phone: e.target.value });
	}
	function handlePasswordChange(e) {
		setLoginForm({ ...loginForm, password: e.target.value });
	}
	return (
		<div className="relative min-h-screen flex flex-col items-center bg-gray-50">
			<div className="w-full bg-primary py-8 flex justify-center">
				<h1 className="text-white text-2xl font-bold">Jordan Rides Connect</h1>
			</div>
			<div className="w-full max-w-xs flex flex-col flex-1 justify-center mt-8">
				<h2 className="text-2xl font-bold text-center mb-1">Welcome Back</h2>
				<p className="text-gray-500 text-center mb-6">
					Log in to continue your journey
				</p>
				<form className="space-y-4" onSubmit={handleLoginSubmit}>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Phone Number
						</label>
						<div className="relative">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
								<Phone className="w-5 h-5" />
							</span>
							<input
								type="text"
								name="phone"
								placeholder="07XXXXXXXX"
								className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white"
								onChange={handlePhoneChange}
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<div className="relative">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
								<Lock className="w-5 h-5" />
							</span>
							<input
								type="password"
								name="password"
								placeholder="••••••••"
								className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white"
								onChange={handlePasswordChange}
							/>
						</div>
					</div>
					<div className="flex justify-end">
						<button
							type="button"
							className="text-primary text-sm font-medium hover:underline"
						>
							Forgot password?
						</button>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-md transition-colors disabled:bg-slate-500"
					>
						Log In
					</button>
				</form>
				<div className="text-center mt-6 text-gray-600">
					Don't have an account?{" "}
					<button
						type="button"
						className="text-primary font-medium hover:underline"
						onClick={() => {
							navigate("/role");
						}}
					>
						Sign Up
					</button>
				</div>
			</div>
		</div>
	);
}
