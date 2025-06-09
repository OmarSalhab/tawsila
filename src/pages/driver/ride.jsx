import { ArrowLeft, User } from "lucide-react";
import { useState } from "react";
import RideChat from "../../components/rideChat";
import {Link } from "react-router-dom";
const ride = {
	driverName: "Ahmad",
	driverGender: "male",
	driverRating: 4.8,
	origin: "Amman",
	destination: "Zarqa",
	date: "Today",
	time: "15:30",
	price: "3.50 JD",
	availableSeats: 2,
	description:
		"Regular commute ride from Amman to Zarqa. Pick-up point near Mecca Mall and drop-off at Zarqa New Bus Station.",
};

const seatLayout = [
	{ id: 1, label: "Left Back" },
	{ id: 2, label: "Middle Back" },
	{ id: 3, label: "Right Back" },
];

export default function Ride() {
	const [selectedSeat, setSelectedSeat] = useState(null);
	const [tab, setTab] = useState("Seats");
    

	return (
		<div className="h-screen bg-gray-50 ">
			{/* Header */}
			<div className="w-full bg-primary py-4 flex items-center px-4">
				<button type="button" className="text-white mr-2">
                <Link to="/home-driver"><ArrowLeft className="w-6 h-6" /> </Link>
				</button>
				<div className="flex flex-col flex-1">
					<span className="text-white text-base font-semibold">
						{ride.origin} to {ride.destination}
					</span>
					<span className="text-white text-xs font-normal opacity-80">
						{ride.date} at {ride.time}
					</span>
				</div>
			</div>
			{/* Tabs */}
			<div className="flex bg-gray-100 border-b border-gray-200">
				<button
					className={`flex-1 py-2 text-center font-medium ${
						tab === "Seats" &&
						"border-b-2 border-primary text-primary bg-white focus:outline-none"
					} `}
					onClick={() => setTab("Seats")}
				>
					Seats
				</button>
				<button
					className={`flex-1 py-2 text-center font-medium ${
						tab === "Chat" &&
						"border-b-2 border-primary text-primary bg-white focus:outline-none"
					} `}
					onClick={() => setTab("Chat")}
				>
					Chat
				</button>
			</div>
			{tab === "Seats" ? (
				<>
					{/* Ride Details */}
					<div className="bg-white rounded-lg shadow-md p-4 mt-4 mx-3">
						<h3 className="text-lg font-semibold mb-3">Ride Details</h3>
						<div className="flex items-center mb-2">
							<span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
								<User className="w-6 h-6 text-gray-400" />
							</span>
							<div>
								<div className="font-semibold text-gray-900">
									{ride.driverName}
								</div>
								<div className="text-xs text-gray-500">Driver</div>
							</div>
						</div>
						<div className="flex items-center mb-2">
							<span className="flex items-center text-sm">
								<span className="w-3 h-3 rounded-full bg-primary mr-1" />
								{ride.origin}
							</span>
							<span className="mx-2 text-gray-400">|</span>
							<span className="flex items-center text-sm">
								<span className="w-3 h-3 rounded-full bg-secondary mr-1" />
								{ride.destination}
							</span>
						</div>
						<hr className="my-2" />
						<div className="flex flex-wrap gap-4 mb-2">
							<div>
								<div className="text-xs text-gray-500">Date</div>
								<div className="text-sm text-gray-900 font-semibold">
									{ride.date}
								</div>
							</div>
							<div>
								<div className="text-xs text-gray-500">Time</div>
								<div className="text-sm text-gray-900 font-semibold">
									{ride.time}
								</div>
							</div>
							<div>
								<div className="text-xs text-gray-500">Price</div>
								<div className="text-sm text-gray-900 font-semibold">
									{ride.price}
								</div>
							</div>
							<div>
								<div className="text-xs text-gray-500">Available Seats</div>
								<div className="text-sm text-gray-900 font-semibold">
									{ride.availableSeats}
								</div>
							</div>
						</div>
						<div>
							<div className="text-xs text-gray-500 mb-1">Description</div>
							<div className="text-sm text-gray-700">{ride.description}</div>
						</div>
					</div>
					{/* Seat Selection */}
					<div className="bg-white rounded-lg shadow-md p-4 mt-4 mx-3">
						<h3 className="text-lg font-semibold mb-3">Select Your Seat</h3>
						<div className="flex flex-col items-center">
							<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 w-full max-w-xs flex flex-col items-center">
								<div className="flex w-full justify-between mb-4">
									<span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded font-semibold">
										Driver
									</span>
									<span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded font-semibold">
										Front
									</span>
								</div>
								<div className="flex w-full justify-between mt-6">
									{seatLayout.map((seat) => (
										<button
											key={seat.id}
											type="button"
											className={`text-xs font-semibold px-3 py-2 rounded transition-colors border-2 ${
												selectedSeat === seat.id
													? "bg-primary text-white border-primary"
													: "bg-white text-gray-700 border-gray-300"
											}`}
											onClick={() => setSelectedSeat(seat.id)}
										>
											{seat.label}
										</button>
									))}
								</div>
							</div>
							{/* Legend */}
							<div className="flex items-center gap-4 mt-4">
								<div className="flex items-center gap-1">
									<span className="w-4 h-4 rounded bg-primary inline-block" />
									<span className="text-xs text-gray-700">Selected</span>
								</div>
								<div className="flex items-center gap-1">
									<span className="w-4 h-4 rounded bg-gray-300 inline-block" />
									<span className="text-xs text-gray-700">Driver</span>
								</div>
								<div className="flex items-center gap-1">
									<span className="w-4 h-4 rounded border border-gray-300 bg-white inline-block" />
									<span className="text-xs text-gray-700">Available</span>
								</div>
							</div>
						</div>
						<button
							type="button"
							className="w-full bg-primary text-white font-semibold py-2 rounded-md mt-6"
							onClick={() => {}}
						>
							Book Ride
						</button>
					</div>
				</>
			) : (
				<RideChat />
			)}
		</div>
	);
}
