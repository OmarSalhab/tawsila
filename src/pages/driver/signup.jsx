import {
	Lock,
	Phone,
	User,
	MapPin,
	CreditCard,
	UploadCloud,
	Car,
	EyeIcon,
	EyeClosed,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { getRouteIds } from "../../services/routeApi";
import { signupDriver } from "../../services/authApi";
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
	carModel: Yup.string()
		.required("Full car model name is required")
		.min(10, "model must be at least 10 characters"),
	nationalId: Yup.string()
		.required("National ID is required")
		.matches(/^[0-9]{10}$/, "National ID must be exactly 10 digits"),
	imageUrl: Yup.string()
		.required("Image URL is required")
		.matches(
			/^blob:http:\/\/.+$/i,
			"Please enter a valid image URL (jpg, jpeg, png)"
		),
	routeId: Yup.string().required("Route is required"),
});

const supaUpload = async (formData) => {
	try {
		const supabaseUrl = import.meta.env.VITE_SUPA_URL;
		const supabaseKey = import.meta.env.VITE_SUPA_KEY;

		const supabase = createClient(supabaseUrl, supabaseKey);
		const filePath = `users-nationalId/${formData?.fileName}`;

		// First check if the file already exists
		const { data: existingFile } = await supabase.storage
			.from("tawsila")
			.getPublicUrl(filePath);

		if (existingFile?.publicUrl) {
			// If file exists, return its URL
			return existingFile.publicUrl;
		}

		// If file doesn't exist, proceed with upload
		const { data, error } = await supabase.storage
			.from("tawsila")
			.upload(filePath, formData?.file);

		if (error) {
			// If error is due to duplicate file, try to get the existing file's URL
			if (error.message.includes("duplicate")) {
				const { data: urlData } = await supabase.storage
					.from("tawsila")
					.getPublicUrl(filePath);
				return urlData.publicUrl;
			}
			throw error;
		}

		const { data: urlData } = await supabase.storage
			.from("tawsila")
			.getPublicUrl(data.path);

		return urlData.publicUrl;
	} catch (error) {
		console.error("Error uploading to Supabase:", error);
		throw error;
	}
};

export default function Signup() {
	const navigate = useNavigate();
	const [routeOptions, setRouteOptions] = useState(null);
	const [formData, setFormData] = useState({ file: "", fileName: "" });
	const { addToast } = useToast();
	const [showPassword, setShowPassword] = useState(false);
	const initialValues = {
		name: "",
		phone: "",
		password: "",
		gender: "",
		routeId: routeOptions?.[0]?._id || "",
		carModel: "",
		nationalId: "",
		imageUrl: "",
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

	useEffect(() => {
		return () => {
			if (
				initialValues.imageUrl &&
				initialValues.imageUrl.startsWith("blob:")
			) {
				URL.revokeObjectURL(initialValues.imageUrl);
			}
		};
	}, [initialValues.imageUrl]);

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
							// First upload the image to Supabase

							const image = await supaUpload(formData);
							if (!image) {
								throw new Error("Failed to upload image");
							}

							// Prepare the data for signup
							const signupData = {
								...values,
								imageUrl: image, // Add the uploaded image URL to the signup data
							};

							// Call the signup API
							const response = await signupDriver(signupData);
							if (response) {
								// If signup is successful, navigate to login
								navigate("/signup-success");
							}
						} catch (error) {
							addToast(error?.message, error);
						} finally {
							setSubmitting(false);
						}
					}}
					enableReinitialize
				>
					{({ isSubmitting, errors, touched, values, setFieldValue }) => (
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
										type={showPassword ? "text" : "password"}
										name="password"
										placeholder="••••••••"
										className={`pl-10 pr-3 py-2 w-full rounded-md border ${
											errors.password && touched.password
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-primary focus:border-primary"
										} focus:outline-none focus:ring-0.7 text-gray-700 bg-white`}
									/>
									<span
										className={`absolute inset-y-0 right-3 flex items-center pl-3 text-gray-500`}
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeIcon className="w-5 h-5" />
										) : (
											<EyeClosed className="w-5 h-5" />
										)}
									</span>
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
								<div className="relative  h-[42px]">
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
										name="nationalId"
										placeholder="9XXXXXXXXX"
										className={`pl-10 pr-3 py-2 w-full rounded-md border ${
											errors.nationalId && touched.nationalId
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-primary focus:border-primary"
										} focus:outline-none focus:ring-0.7 text-gray-700 bg-white`}
									/>
									<ErrorMessage
										name="nationalId"
										component="div"
										className="text-red-500 text-sm mt-1 bg-gray-50"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Car Model
								</label>
								<div className="relative h-[42px]">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
										<Car className="w-5 h-5" />
									</span>
									<Field
										type="text"
										name="carModel"
										placeholder="Kia Niro 2020"
										className={`pl-10 pr-3 py-2 w-full rounded-md border ${
											errors.carModel && touched.carModel
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-primary focus:border-primary"
										} focus:outline-none focus:ring-0.7 text-gray-700 bg-white`}
									/>
									<ErrorMessage
										name="carModel"
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
									{values.imageUrl ? (
										<img src={values.imageUrl} className="w-full h-60" />
									) : (
										<>
											<UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
											<p className="text-gray-500 text-sm mb-2">
												Drag and drop your ID photo here or click to browse
											</p>
										</>
									)}
									<label className="inline-block mt-3 cursor-pointer">
										<span className="bg-white text-black px-4 py-2 border border-gray-300 rounded-md font-medium">
											Select File
										</span>
										<Field
											type="file"
											name="imageUrl"
											accept="image/*"
											className="hidden"
											onChange={(event) => {
												const file = event.currentTarget.files[0];
												if (file) {
													// Create a URL for the file
													const fileUrl = URL.createObjectURL(file);

													setFieldValue("imageUrl", fileUrl);

													const fileExt = file.name.split(".").pop();
													const fileName = `${Date.now()}.${fileExt}`;

													setFormData({ file: file, fileName: fileName });
												}
											}}
											value={undefined}
										/>
										<ErrorMessage
											name="imageUrl"
											component="div"
											className="text-red-500 text-sm mt-1 "
										/>
									</label>
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
