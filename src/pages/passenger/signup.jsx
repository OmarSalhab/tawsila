import { Lock, Phone, User, MapPin } from "lucide-react";

export default function Signup() {
	return (
		<div className="min-h-screen flex flex-col items-center bg-gray-50">
			<div className="w-full bg-primary py-8 flex justify-center">
				<h1 className="text-white text-2xl font-bold">Jordan Rides Connect</h1>
			</div>
			<div className="w-full max-w-xs flex flex-col flex-1 justify-center mt-8">
				<h2 className="text-2xl font-bold text-center mb-1">
					Create a Passenger Account
				</h2>
				<p className="text-gray-500 text-center mb-6">
					Join our ride-sharing community
				</p>
				<form className="space-y-4" onSubmit={handleSignupSubmit}>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Full Name
						</label>
						<div className="relative">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
								<User className="w-5 h-5" />
							</span>
							<input
								type="text"
								name="fullname"
								placeholder="John Doe"
								className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white"
								onChange={handleFullNameChange}
							/>
						</div>
					</div>
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
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Gender
						</label>
						<div className="flex items-center space-x-6 mt-1">
							<label className="flex items-center space-x-2">
								<input
									type="radio"
									name="gender"
									value="male"
									className="form-radio text-primary focus:ring-primary"
									onChange={handleGenderChange}
								/>
								<span className="text-primary font-medium">Male</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="radio"
									name="gender"
									value="female"
									className="form-radio text-primary focus:ring-primary"
									onChange={handleGenderChange}
								/>
								<span className="text-primary font-medium">Female</span>
							</label>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Preferred Route
						</label>
						<div className="relative">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
								<MapPin className="w-5 h-5" />
							</span>
							<select
								name="route"
								className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white appearance-none"
								onChange={handleRouteChange}
								defaultValue="Amman-Zarqa"
							>
								<option value="Amman-Zarqa">Amman-Zarqa</option>
								<option value="Zarqa-Amman">Zarqa-Amman</option>
								{/* Add more routes as needed */}
							</select>
						</div>
					</div>
					<button
						type="submit"
						className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-md transition-colors mt-2"
					>
						Sign Up
					</button>
				</form>
				<div className="text-center mt-6 text-gray-600">
					Already have an account?{" "}
					<button
						type="button"
						className="text-primary font-medium hover:underline mr-2"
					>
						Log In
					</button>
					<button
						type="button"
						className="text-primary font-medium hover:underline"
					>
						Change Role
					</button>
				</div>
			</div>
		</div>
	);
}

// Placeholder event handlers
function handleSignupSubmit(e) {
	e.preventDefault(); /* validation logic here */
}
function handleFullNameChange() {
	/* full name validation here */
}
function handlePhoneChange() {
	/* phone validation here */
}
function handlePasswordChange() {
	/* password validation here */
}
function handleGenderChange() {
	/* gender validation here */
}
function handleRouteChange() {
	/* route validation here */
}
