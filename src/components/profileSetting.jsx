import { User, Phone, Lock, X, MapPin } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { getRouteIds } from "../services/routeApi";
import { useToast } from "../hooks/useToast";
import useAuth from "../hooks/useAuth";

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
});

const ProfileSetting = ({ user, onClose }) => {
	const [routeOptions, setRouteOptions] = useState();
    const { addToast } = useToast();
	const { updateUser } = useAuth();
	const initialValues = {
		name: user?.name || "",
		phone: user?.phone || "",
		password: "",
		gender: user?.gender || "",
		routeId: user?.routeId?._id || "",
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
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 ">
			<div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto animate-slideInBottom">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-10">
					<h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
					<button
						onClick={onClose}
						className="p-2 -m-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form Content */}
				<div className="p-4">
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={async (values, { setSubmitting }) => {
							try {
                                await updateUser(values,user._id);
								onClose();
                                addToast("User Updated Successfully", "success");
							} catch (error) {
								console.error("Update error:", error);
							} finally {
								setSubmitting(false);
							}
						}}
					>
						{({ isSubmitting, errors, touched, values }) => (
							<Form className="space-y-5">
								{/* Name Field */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Full Name
									</label>
									<div className="relative h-[50px]">
										<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
											<User className="w-5 h-5" />
										</span>
										<Field
											type="text"
											name="name"
											placeholder="John Doe"
											className={`pl-10 pr-3 py-3 w-full rounded-lg border ${
												errors.name && touched.name
													? "border-red-500 focus:border-red-500 focus:ring-red-500"
													: "border-gray-300 focus:ring-primary focus:border-primary"
											} focus:outline-none focus:ring-2 text-gray-700 bg-white`}
										/>
										<ErrorMessage
											name="name"
											component="div"
											className="text-red-500 text-sm mt-1.5 bg-white"
										/>
									</div>
								</div>

								{/* Phone Field */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Phone Number
									</label>
									<div className="relative h-[50px]">
										<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
											<Phone className="w-5 h-5" />
										</span>
										<Field
											type="tel"
											name="phone"
                                            disabled={true}
											placeholder="07XXXXXXXX"
											className={`pl-10 pr-3 py-3 w-full rounded-lg border ${
												errors.phone && touched.phone
													? "border-red-500 focus:border-red-500 focus:ring-red-500"
													: "border-gray-300 focus:ring-primary focus:border-primary"
											} focus:outline-none focus:ring-2 text-gray-700 opacity-65  bg-white`}
										/>
										<ErrorMessage
											name="phone"
											component="div"
											className="text-red-500 text-sm mt-1.5 bg-white"
										/>
									</div>
								</div>

								{/* Password Field */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Password
									</label>
									<div className="relative h-[50px]">
										<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
											<Lock className="w-5 h-5" />
										</span>
										<Field
											type="password"
											name="password"
											placeholder="••••••••"
											className={`pl-10 pr-3 py-3 w-full rounded-lg border ${
												errors.password && touched.password
													? "border-red-500 focus:border-red-500 focus:ring-red-500"
													: "border-gray-300 focus:ring-primary focus:border-primary"
											} focus:outline-none focus:ring-2 text-gray-700 bg-white`}
										/>
										<ErrorMessage
											name="password"
											component="div"
											className="text-red-500 text-sm mt-1.5 bg-white"
										/>
									</div>
									<div className="mt-2 text-sm text-gray-500">
										<p className="mb-1">Password must contain:</p>
										<ul className="space-y-1">
											<li
												className={`flex items-center ${
													values.password.length >= 6 ? "text-green-500" : ""
												}`}
											>
												<span className="mr-2">•</span>
												At least 6 characters
											</li>
											<li
												className={`flex items-center ${
													/[A-Z]/.test(values.password) ? "text-green-500" : ""
												}`}
											>
												<span className="mr-2">•</span>
												One uppercase letter
											</li>
											<li
												className={`flex items-center ${
													/[!@#$%^&*(),.?":{}|<>]/.test(values.password)
														? "text-green-500"
														: ""
												}`}
											>
												<span className="mr-2">•</span>
												One special character
											</li>
										</ul>
									</div>
								</div>
								{/* Perferred Route */}
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
											className="text-red-500 text-sm mt-1 bg-white"
										/>
									</div>
								</div>

								{/* Gender Field */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Gender
									</label>
									<div className="flex items-center space-x-6">
										<label className="flex items-center space-x-2">
											<Field
												type="radio"
												name="gender"
												value="male"
												className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
											/>
											<span className="text-gray-700">Male</span>
										</label>
										<label className="flex items-center space-x-2">
											<Field
												type="radio"
												name="gender"
												value="female"
												className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
											/>
											<span className="text-gray-700">Female</span>
										</label>
									</div>
									<ErrorMessage
										name="gender"
										component="div"
										className="text-red-500 text-sm mt-1.5 bg-white"
									/>
								</div>

								{/* Update Button */}
								<div className="pt-4">
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-base"
									>
										{isSubmitting ? "Updating..." : "Update Profile"}
									</button>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
};

export default ProfileSetting;
