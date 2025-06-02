import { Lock, Phone, User, MapPin } from "lucide-react";
import { signupPassenger } from "../../services/authApi";
import { getRouteIds } from "../../services/routeApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useToast } from "../../hooks/useToast";

const validationSchema = Yup.object().shape({
	name: Yup.string()
		.required("Full name is required")
		.min(4, "Name must be at least 4 characters"),
	phone: Yup.string()
		.required("Phone number is required")
		.matches(
			/^07[0-9]{8}$/,
			"Phone number must start with 07 and be 10 digits"
		),
	password: Yup.string()
		.required("Password is required")
		.min(6, "Password must be at least 6 characters")
		.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
		.matches(
			/[!@#$%^&*(),.?":{}|<>]/,
			"Password must contain at least one special character"
		),
	gender: Yup.string()
		.required("Gender is required")
		.oneOf(["male", "female"], "Please select a valid gender"),
	routeId: Yup.string().required("Route is required"),
});

export default function Signup() {
	const [routeOptions, setRouteOptions] = useState(null);
	const navigate = useNavigate();
	const { addToast } = useToast();

	useEffect(() => {
		const getRoutes = async () => {
			try {
				const ids = await getRouteIds();
				if (ids && ids.routes) {
					setRouteOptions(ids.routes);
				} else {
					setRouteOptions([]);
				}
			} catch (error) {
				console.error("Error loading routes:", error);
				setRouteOptions([]);
			}
		};

		getRoutes();
	}, []);

	const initialValues = {
		name: "",
		phone: "",
		password: "",
		gender: "",
		routeId: routeOptions?.[0]?._id || "",
	};

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
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={async (values, { setSubmitting }) => {
						try {
							const response = await signupPassenger(values);
							if (response) {
								addToast(response.message, "success");
								navigate("/login");
							}
						} catch (error) {
							console.error("Signup error:", error);
						} finally {
							setSubmitting(false);
						}
					}}
					enableReinitialize
				>
					{({ isSubmitting, errors, touched, values }) => (
						<Form className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name
								</label>
								<div className="relative h-[42px] mb-6">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
										<User className="w-5 h-5" />
									</span>
									<Field
										type="text"
										name="name"
										placeholder="John Doe"
										className={`pl-10 pr-3 py-2 w-full rounded-md border ${
											errors.name && touched.name
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-primary focus:border-primary"
										} focus:outline-none focus:ring-0.7 text-gray-700 bg-white`}
									/>
									<ErrorMessage
										name="name"
										component="div"
										className="text-red-500 text-sm mt-1"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Phone Number
								</label>
								<div className="relative h-[42px] mb-6">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
										<Phone className="w-5 h-5 " />
									</span>
									<Field
										type="text"
										name="phone"
										placeholder="07XXXXXXXX"
										className={`pl-10 pr-3 py-2 w-full rounded-md border ${
											errors.phone && touched.phone
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-primary focus:border-primary"
										} focus:outline-none focus:ring-0.7 text-gray-700 bg-white`}
									/>
									<ErrorMessage
										name="phone"
										component="div"
										className="text-red-500 text-sm mt-1"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Password
								</label>
								<div className="relative h-[42px] mb-12">
									<span
										className={`absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400`}
									>
										<Lock className="w-5 h-5" />
									</span>
									<Field
										type="password"
										name="password"
										placeholder="••••••••"
										className={`pl-10 pr-3 py-2 w-full rounded-md border ${
											errors.password && touched.password
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-primary focus:border-primary"
										} focus:outline-none focus:ring-0.7 text-gray-700 bg-white`}
									/>
									<ErrorMessage
										name="password"
										component="div"
										className="text-red-500 text-sm mt-1"
									/>
								</div>
								<div className="mt-1 text-sm text-gray-500">
									<p>Password must contain:</p>
									<ul className="list-disc list-inside">
										<li
											className={
												values.password.length >= 6 ? "text-green-500" : ""
											}
										>
											At least 6 characters
										</li>
										<li
											className={
												/[A-Z]/.test(values.password) ? "text-green-500" : ""
											}
										>
											One uppercase letter
										</li>
										<li
											className={
												/[!@#$%^&*(),.?":{}|<>]/.test(values.password)
													? "text-green-500"
													: ""
											}
										>
											One special character
										</li>
									</ul>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Gender
								</label>
								<div className="flex items-center space-x-6 mt-1">
									<label className="flex items-center space-x-2">
										<Field
											type="radio"
											name="gender"
											value="male"
											className="form-radio text-primary focus:ring-primary"
										/>
										<span className="text-primary font-medium">Male</span>
									</label>
									<label className="flex items-center space-x-2">
										<Field
											type="radio"
											name="gender"
											value="female"
											className="form-radio text-primary focus:ring-primary"
										/>
										<span className="text-primary font-medium">Female</span>
									</label>
								</div>
								<ErrorMessage
									name="gender"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Preferred Route
								</label>
								<div className="relative">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
										<MapPin className="w-5 h-5" />
									</span>
									<Field
										as="select"
										name="routeId"
										className={`pl-10 pr-3 py-2 w-full rounded-md border ${
											errors.routeId && touched.routeId
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-primary focus:border-primary"
										} focus:outline-none focus:ring-0.7 text-gray-700 bg-white appearance-none`}
									>
										{routeOptions ? (
											routeOptions.map((route) => (
												<option key={route._id} value={route._id}>
													{route.roomName}
												</option>
											))
										) : (
											<option value="">Loading routes...</option>
										)}
									</Field>
									<ErrorMessage
										name="routeId"
										component="div"
										className="text-red-500 text-sm mt-1"
									/>
								</div>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-md transition-colors mt-2 disabled:opacity-50"
							>
								{isSubmitting ? "Signing up..." : "Sign Up"}
							</button>
						</Form>
					)}
				</Formik>

				<div className="text-center mt-6 text-gray-600">
					Already have an account?{" "}
					<button
						type="button"
						className="text-primary font-medium hover:underline mr-2"
						onClick={() => {
							navigate("/login");
						}}
					>
						Log In
					</button>
					<button
						type="button"
						className="text-primary font-medium hover:underline"
						onClick={() => {
							navigate("/role");
						}}
					>
						Change Role
					</button>
				</div>
			</div>
		</div>
	);
}
