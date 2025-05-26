import { useEffect, useState } from "react";
import { User, MessageCircle } from "lucide-react";
import Profile from "../../components/profile";
import GlobalChat from "../shared/globalChat";

const staticTrips = [
	{
		id: 1,
		driverName: "Ahmad",
		driverGender: "male",
		driverRating: 4.8,
		origin: "Amman",
		destination: "Zarqa",
		route: "Amman-Zarqa",
		departureTime: "15:30",
		date: "Today",
		price: "3.50 JD",
		availableSeats: 2,
		passengersCount: 2,
		maxPassengers: 4,
		description: "Regular commute ride from Amman to Zarqa.",
		status: "Active",
	},
	{
		id: 2,
		driverName: "Fatima",
		driverGender: "female",
		driverRating: 4.9,
		origin: "Irbid",
		destination: "Amman",
		route: "Irbid-Amman",
		departureTime: "08:00",
		date: "Today",
		price: "8.00 JD",
		availableSeats: 1,
		passengersCount: 3,
		maxPassengers: 4,
		description: "Morning ride from Irbid to Amman.",
		status: "Active",
	},
	{
		id: 3,
		driverName: "Omar",
		driverGender: "male",
		driverRating: 4.7,
		origin: "Salt",
		destination: "Amman",
		route: "Salt-Amman",
		departureTime: "17:00",
		date: "Today",
		price: "2.50 JD",
		availableSeats: 2,
		passengersCount: 2,
		maxPassengers: 4,
		description: "Evening ride from Salt to Amman.",
		status: "Active",
	},
];

export default function Home() {
	const [trips, setTrips] = useState([]);
	const [showProfile, setShowProfile] = useState(false);

	useEffect(() => {
		// Simulate fetching trips
		setTrips(staticTrips); // Set to [] to test empty state
	}, []);

	return (
		<>
			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<div className="w-full bg-primary py-4 flex items-center justify-between px-4">
					<User
						className="text-white w-6 h-6 z-10"
						onClick={() => setShowProfile(true)}
					/>

					<h1 className="text-white text-xl font-bold text-center flex-1 -ml-6">
						Available Rides
					</h1>
					<MessageCircle className="text-white w-6 h-6 z-10" />
				</div>
				<div className="p-3">
					{trips.length === 0 ? (
						<div className="bg-white rounded-lg shadow-md p-6 mt-8 flex flex-col items-center justify-center text-center mx-auto max-w-md">
							<p className="text-gray-500 text-lg mb-1">
								No rides available for this route right now.
							</p>
							<p className="text-gray-400 text-sm">
								Check back later or try a different route.
							</p>
						</div>
					) : (
						<div className="space-y-4 mt-4">
							{trips.map((trip) => (
								<div
									key={trip.id}
									className="relative bg-white rounded-lg shadow-md p-4 flex flex-col mb-2"
								>
									{/* Orange bar */}
									<span className="absolute left-0 top-0 h-full w-1.5 rounded-l-lg bg-secondary" />
									<div className="flex items-center justify-between mb-1">
										<span className="text-gray-500 text-sm ">
											Driver{" "}
											<span className="ml-1 font-semibold text-gray-900">
												{trip.driverName}
											</span>
										</span>
										<span
											className={`text-sm font-semibold ${
												trip.driverGender === "male"
													? "text-blue-600"
													: "text-pink-600"
											}`}
										>
											{trip.driverGender.charAt(0).toUpperCase() +
												trip.driverGender.slice(1)}
										</span>
										<span className="flex items-center text-black-500 text-sm font-semibold bg-yellow-100 rounded px-1.5 py-0.5 ml-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-4 h-4 mr-0.5 text-secondary"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.307a.563.563 0 00.424.307l4.749.693c.462.067.646.636.312.96l-3.432 3.343a.563.563 0 00-.162.5l.81 4.725c.079.462-.406.815-.823.598l-4.243-2.23a.563.563 0 00-.523 0l-4.243 2.23c-.417.217-.902-.136-.823-.598l.81-4.726a.563.563 0 00-.162-.499L2.344 9.766c-.334-.324-.15-.893.312-.96l4.75-.693a.563.563 0 00.424-.307l2.125-4.307z"
												/>
											</svg>
											{trip.driverRating}
										</span>
										<span className="bg-gray-100 text-gray-700 text-md font-semibold rounded px-4 py-0.5 ml-2">
											{trip.departureTime} AM
										</span>
									</div>
									<div className="flex flex-row items-center">
										<div className="flex flex-col items-left w-4/5">
											<span className="flex items-center text-sm">
												<span className="w-3 h-3 rounded-full bg-primary mr-1" />
												{trip.origin}
											</span>
											<div className="w-0.5 h-6 bg-gray-300 ml-1.5 my-1"></div>
											<span className="flex items-center text-sm">
												<span className="w-3 h-3 rounded-full bg-secondary mr-1 " />
												{trip.destination}
											</span>
										</div>
										<span className="text-right w-1/5">
											<span className="block text-xs text-gray-400">Price</span>
											<span className="text-lg font-semibold text-gray-900">
												{trip.price}
											</span>
										</span>
									</div>
									<div className="flex flex-row items-center justify-between">
										<div className="flex items-center justify-between mt-2">
											<span className="text-gray-700 text-sm">
												{trip.passengersCount}/{trip.maxPassengers} passengers
											</span>
										</div>
										<button
											type="button"
											className="mt-3 border border-primary text-primary font-semibold rounded-md py-2 px-3 transition-colors"
										>
											Join Ride
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			<Profile open={showProfile} onClose={() => setShowProfile(false)} />
		</>
	);
}
