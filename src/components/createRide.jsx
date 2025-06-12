import { Car, X, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import { createRide } from "../services/rideApi";
export default function CreateRide() {
	const [open, setOpen] = useState(false);
	const [time, setTime] = useState("");
	const [selectedDate, setSelectedDate] = useState("today");
	const [seats, setSeats] = useState(4);
	const [price, setPrice] = useState("2.5JD");
	const { addToast } = useToast();
	const [description, setDescription] = useState("");
	
	// Get today's and tomorrow's dates in a nice format
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const formatDate = (date) => {
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	const combineDateAndTime = (date, time) => {
		if (!time) return null;

		const selectedDate =
			date === "today"
				? new Date()
				: new Date(new Date().setDate(new Date().getDate() + 1));
		const [hours, minutes] = time.split(":").map(Number);

		const combinedDateTime = new Date(selectedDate);
		combinedDateTime.setHours(hours, minutes, 0, 0);

		// Check if the selected time is in the past
		const now = new Date();
		if (combinedDateTime < now) {
			addToast("Cannot select a time in the past", "info");
			return false;
		}

		return combinedDateTime;
	};

	const handleSubmit = async () => {
		const departureTime = combineDateAndTime(selectedDate, time);
		if (!departureTime) return;
		const newPrice = parseFloat(price.split("JD")[0].trim());
		const newForm = {
			departureTime: departureTime,
			price: newPrice,
			description: description,
			availableSeats: seats,
		};
		try {
			const response = await createRide(newForm);
			console.log(response);

			addToast("created the ride successfully", "success");
			setTime("");
			setDescription("");
			setOpen(false);
		} catch (error) {
			addToast(error.message, "error");
		}
	};

	
	useEffect(() => {
		if (seats === 1) setPrice("7JD");
		if (seats === 2) setPrice("5JD");
		if (seats === 3) setPrice("3JD");
		if (seats === 4) setPrice("2.5JD");
	}, [seats]);
	return (
		<>
			<button
				type="button"
				className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg w-[90vw] max-w-xs text-base"
				onClick={() => setOpen(true)}
			>
				<Car className="w-5 h-5 mr-2" />
				Create New Ride
			</button>
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
					<div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-2 p-6 fixed bottom-0">
						<button
							className="absolute top-4 right-4 text-gray-500 "
							onClick={() => setOpen(false)}
							aria-label="Close"
						>
							<X className="w-6 h-6" />
						</button>
						<h2 className="text-xl font-bold text-center mb-6">
							Create New Ride
						</h2>
						<form className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-black-900 mb-1">
									Date
								</label>
								<div className="grid grid-cols-2 gap-3">
									<button
										type="button"
										onClick={() => setSelectedDate("today")}
										className={`relative p-4 rounded-lg border transition-all ${
											selectedDate === "today"
												? "border-primary bg-primary/5"
												: "border-gray-200 hover:border-primary/50"
										}`}
									>
										<div className="flex flex-col items-center">
											<span className="text-sm text-gray-500">Today</span>
											<span className="text-lg font-semibold text-gray-900">
												{formatDate(today)}
											</span>
										</div>
										{selectedDate === "today" && (
											<div className="absolute top-2 right-2">
												<div className="w-2 h-2 rounded-full bg-primary" />
											</div>
										)}
									</button>
									<button
										type="button"
										onClick={() => setSelectedDate("tomorrow")}
										className={`relative p-4 rounded-lg border transition-all ${
											selectedDate === "tomorrow"
												? "border-primary bg-primary/5"
												: "border-gray-200 hover:border-primary/50"
										}`}
									>
										<div className="flex flex-col items-center">
											<span className="text-sm text-gray-500">Tomorrow</span>
											<span className="text-lg font-semibold text-gray-900">
												{formatDate(tomorrow)}
											</span>
										</div>
										{selectedDate === "tomorrow" && (
											<div className="absolute top-2 right-2">
												<div className="w-2 h-2 rounded-full bg-primary" />
											</div>
										)}
									</button>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-black-900 mb-1">
									Time
								</label>
								<div className="relative">
									<input
										type="time"
										placeholder="--:--  --"
										className="pl-4 pr-10 py-2 w-full rounded-md border [&::-webkit-calendar-picker-indicator]:hidden border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white"
										onChange={(e) => setTime(e.target.value)}
									/>
									<Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-black-900 mb-1">
									Price (JD)
								</label>
								<input
									type="text"
									disabled={true}
									value={price}
									className="pl-4 pr-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white disabled:text-gray-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-black-900 mb-1">
									Available Seats
								</label>
								<div className="relative">
									<select
										value={seats}
										onChange={(e) => setSeats(Number(e.target.value))}
										className="pl-4 pr-10 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white appearance-none"
									>
										{[1, 2, 3, 4].map((num) => (
											<option key={num} value={num}>
												{num} {num === 1 ? "seat" : "seats"}
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-black-900 mb-1">
									Description
								</label>
								<textarea
									placeholder="Add details about your ride..."
									className="pl-4 pr-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white min-h-[80px] resize-none"
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2 mt-6">
								<button
									type="button"
									className="w-full bg-secondary border border-gray-400 text-black font-semibold py-2 rounded-md mb-2"
									onClick={() => setOpen(false)}
								>
									Cancel
								</button>
								<button
									type="button"
									className="w-full bg-primary text-white font-semibold py-2 rounded-md"
									onClick={handleSubmit}
								>
									Create Ride
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
