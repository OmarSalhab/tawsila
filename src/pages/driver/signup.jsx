import {
	Lock,
	Phone,
	User,
	MapPin,
	CreditCard,
	UploadCloud,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { getRouteIds } from "../../services/routeApi";

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
	route: Yup.string().required("Route is required"),
	idNumber: Yup.string()
		.required("National ID is required")
		.matches(/^[0-9]{10}$/, "National ID must be exactly 10 digits"),
	idPhoto: Yup.string()
		.required("Image URL is required")
		.matches(
			/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i,
			"Please enter a valid image URL (jpg, jpeg, png)"
		),
});

export default function Signup() {
	const navigate = useNavigate();
	const [routeOptions, setRouteOptions] = useState();
	const [imageUrl, setImageUrl] = useState();
	const initialValues = {
		name: "",
		phone: "",
		password: "",
		gender: "",
		routeId: routeOptions?.[0]?._id || "",
		idNumber: "",
		idPhoto: "",
	};

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

	return (
		<div className="min-h-screen flex flex-col items-center bg-gray-50">
			<div className="w-full bg-primary py-8 flex justify-center">
				<h1 className="text-white text-2xl font-bold">Jordan Rides Connect</h1>
			</div>
			<div className="w-full max-w-xs flex flex-col flex-1 justify-center mt-8 mb-3">
				<h2 className="text-2xl font-bold text-center mb-1">
					Create a Driver Account
				</h2>
				<p className="text-gray-500 text-center mb-6">
					Join our ride-sharing community
				</p>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={async (values, { setSubmitting }) => {
						try {
							// Handle form submission here
							console.log(values);
							navigate("/login");
						} catch (error) {
							console.error("Signup error:", error);
						} finally {
							setSubmitting(false);
						}
					}}
				>
					{({ isSubmitting, errors, touched, values }) => (
						<Form className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name
								</label>
								<div className="relative h-[42px]">
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
										className="text-red-500 text-sm mt-1 bg-gray-50"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1 pt-1">
									Phone Number
								</label>
								<div className="relative h-[42px]">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
										<Phone className="w-5 h-5" />
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
										className="text-red-500 text-sm mt-1 bg-gray-50"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1 pt-1">
									Password
								</label>
								<div className="relative h-[42px]">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
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
										className="text-red-500 text-sm mt-1 bg-gray-50"
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
									className="text-red-500 text-sm mt-1 bg-gray-50"
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

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									ID Number
								</label>
								<div className="relative h-[42px]">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
										<CreditCard className="w-5 h-5" />
									</span>
									<Field
										type="text"
										name="idNumber"
										placeholder="9XXXXXXXXX"
										className={`pl-10 pr-3 py-2 w-full rounded-md border ${
											errors.idNumber && touched.idNumber
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-primary focus:border-primary"
										} focus:outline-none focus:ring-0.7 text-gray-700 bg-white`}
									/>
									<ErrorMessage
										name="idNumber"
										component="div"
										className="text-red-500 text-sm mt-1 bg-gray-50"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1 pt-1">
									Upload ID Photo
								</label>
								<div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center text-center bg-white">
									{imageUrl ? (
										<>
											<img src={imageUrl} className="w-full h-60" />
											<label className="inline-block mt-3 cursor-pointer">
												<span className="bg-white text-black px-4 py-2 border border-gray-300 rounded-md font-medium">
													Select File
												</span>
												<Field
													type="file"
													name="idPhoto"
													className="hidden"
													onChange={(event) => {
														const file = event.currentTarget.files[0];
														if (file) {
															// Create a URL for the file
															const fileUrl = URL.createObjectURL(file);
															setImageUrl(fileUrl);
                                                  
															// Update the form value with the URL
															event.target.value = fileUrl;
														}
													}}
												/>
											</label>
										</>
									) : (
										<>
											<UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
											<p className="text-gray-500 text-sm mb-2">
												Drag and drop your ID photo here or click to browse
											</p>
											<label className="inline-block cursor-pointer">
												<span className="bg-white text-black px-4 py-2 border border-gray-300 rounded-md font-medium">
													Select File
												</span>
												<Field
													type="file"
													name="idPhoto"
													className="hidden"
													onChange={(event) => {
														const file = event.currentTarget.files[0];
														if (file) {
															// Create a URL for the file
															const fileUrl = URL.createObjectURL(file);
															setImageUrl(fileUrl);

															// Update the form value with the URL
															event.target.value = fileUrl;
														}
													}}
												/>
											</label>
											<ErrorMessage
												name="idPhoto"
												component="div"
												className="text-red-500 text-sm mt-1 "
											/>
										</>
									)}
								</div>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-primary text-white font-semibold py-2 rounded-md transition-colors mt-2 disabled:opacity-50"
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
						onClick={() => navigate("/login")}
					>
						Log In
					</button>
					<button
						type="button"
						className="text-primary font-medium hover:underline"
						onClick={() => navigate("/role")}
					>
						Change Role
					</button>
				</div>
			</div>
		</div>
	);
}
