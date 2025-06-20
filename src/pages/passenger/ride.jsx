import { ArrowLeft, CarFront, User } from "lucide-react";
import { useEffect, useState } from "react";
import RideChat from "../../components/rideChat";
import { Link, useParams } from "react-router-dom";
import carInterior from "../../assets/machine-inside-interior-of-the-vehicle-vector-2AKH64B.jpg";
import useSocket from "../../hooks/useSocket";
import useRide from "../../hooks/useRide";
import RoomSkeleton from "../../components/roomSkeleton";
const formatTime = (time) => {
	const formatedTime =
		parseInt(time.split(":")[0]) >= 12
			? parseInt(time.split(":")[0]) === 12
				? `${time} PM`
				: `${parseInt(time.split(":")[0]) - 12}:${time.split(":")[1]} PM`
			: parseInt(time.split(":")[0]) === 0
			? `12:${time.split(":")[1]} AM`
			: `${time} AM`;
	return formatedTime;
};

export default function Ride() {
	const [selectedSeat, setSelectedSeat] = useState(null);
	const [tab, setTab] = useState("Seats");
	const { tripId } = useParams();
	const [ride, setRide] = useState(null);
	const { isPassengerJoined, joinPassenger, rides } = useRide();
	const { socket, activeRoomMemebersCount, joinRoom, leaveRoom } = useSocket();
	const [seatLayout, setSeatLayout] = useState([
		{ id: 1, label: "Front", booked: false },
		{ id: 2, label: "Left Back", booked: false },
		{ id: 3, label: "Middle Back", booked: false },
		{ id: 4, label: "Right Back", booked: false },
	]);
	useEffect(() => {
		if (rides) {
			const targetRide = rides.find(
				(ride) => ride._id.toString() === tripId.toString()
			);
			setRide(targetRide);
			if (targetRide) {
				// Get all booked seat IDs
				const bookedSeatIds = targetRide.joinedPassengers.map((p) => p.seatId);

				// Update seatLayout to mark booked seats
				setSeatLayout((prev) =>
					prev.map((seat) => ({
						...seat,
						booked: bookedSeatIds.includes(seat.id),
					}))
				);
			}
		}
	}, [rides, tripId]);

	const handleBooking = async () => {
		try {
			await joinPassenger(selectedSeat, tripId);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (socket && tripId) {
			joinRoom(tripId);
			return () => {
				leaveRoom(tripId);
			};
		}
	}, [socket, tripId, joinRoom, leaveRoom]);

	if (!ride) return <RoomSkeleton />;

	return (
		<div className="h-screen bg-gray-50 ">
			{/* Header */}
			<div className="w-full bg-primary py-4 flex items-center px-4">
				<button type="button" className="text-white mr-2">
					<Link to="/home-passenger">
						<ArrowLeft className="w-6 h-6" />{" "}
					</Link>
				</button>
				<div className="flex flex-col flex-1">
					<span className="text-white text-base font-semibold">
						{ride.routeId.from} to {ride.routeId.to}
					</span>
					<span className="text-white text-xs font-normal opacity-80">
						{ride.dayMonth} at {formatTime(ride.time)}
					</span>
				</div>
				<div className="text-white underline">
					Members {activeRoomMemebersCount}
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
									{ride.driverId.name}
								</div>
								<div className="text-xs text-gray-500">Driver</div>
								<div className="text-xs text-gray-500">
									{ride.driverId.gender}
								</div>
							</div>
						</div>
						<div className="flex items-center mb-2">
							<span className="flex items-center text-sm">
								<span className="w-3 h-3 rounded-full bg-primary mr-1" />
								{ride.routeId.from}
							</span>
							<span className="mx-2 text-gray-400">|</span>
							<span className="flex items-center text-sm">
								<span className="w-3 h-3 rounded-full bg-secondary mr-1" />
								{ride.routeId.to}
							</span>
						</div>
						<hr className="my-2" />
						<div className="flex flex-wrap gap-4 mb-2">
							<div>
								<div className="text-xs text-gray-500">Date</div>
								<div className="text-sm text-gray-900 font-semibold">
									{ride.dayMonth}
								</div>
							</div>
							<div>
								<div className="text-xs text-gray-500">Time</div>
								<div className="text-sm text-gray-900 font-semibold">
									{formatTime(ride.time)}
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
							<div className="bg-white border border-gray-200 rounded-lg p-4 w-full max-w-xs flex flex-col items-center relative">
								{/* Car Interior Container */}
								<div className="relative w-full h-full mb-4">
									{/* Background Image */}
									<img
										src={carInterior}
										className="w-full h-full object-cover rounded-lg"
										alt="seat selection image"
									/>
									<div className="absolute top-[47%] left-[19%] right-[19%] flex justify-between px-2">
										<span className="bg-gray-300 text-gray-700 text-xs px-3 py-2 rounded font-semibold">
											Driver
										</span>
										<button
											key={1}
											type="button"
											disabled={seatLayout[0].booked || isPassengerJoined}
											className={`text-xs font-semibold px-3 py-2 rounded transition-colors border-2
       										 ${
															seatLayout[0].booked
																? "bg-primary text-gray-400 border-gray-300 cursor-not-allowed"
																: ""
														}
       										 ${
															selectedSeat === 1 && !seatLayout[0].booked
																? "bg-primary text-white border-primary"
																: ""
														}
        									${
														!seatLayout[0].booked && selectedSeat !== 1
															? "bg-white/90 text-gray-700 border-gray-300"
															: ""
													}
    										`}
											onClick={() =>
												!seatLayout[0].booked && setSelectedSeat(1)
											}
										>
											Front
										</button>
									</div>

									{/* Seat Buttons Container */}
									<div className="absolute bottom-[26%] left-[27%] right-[27%] flex justify-center px-1 gap-1">
										{seatLayout.slice(1).map((seat) => (
											<button
												key={seat.id}
												type="button"
												disabled={seat.booked || isPassengerJoined}
												className={`text-xs font-medium px-1 py-1 rounded transition-colors border-2
            									${
																seat.booked
																	? "bg-primary text-gray-400 border-gray-300 cursor-not-allowed"
																	: ""
															}
            									${
																selectedSeat === seat.id && !seat.booked
																	? "bg-primary text-white border-primary"
																	: ""
															}
            									${
																!seat.booked && selectedSeat !== seat.id
																	? "bg-white/90 text-gray-700 border-gray-300"
																	: ""
															}
        										`}
												onClick={() => setSelectedSeat(seat.id)}
											>
												{seat.label}
											</button>
										))}
									</div>
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
							disabled={isPassengerJoined}
							className="w-full bg-primary text-white font-semibold py-2 rounded-md mt-6 disabled:bg-secondary"
							onClick={handleBooking}
						>
							{isPassengerJoined ? (
								<div className="flex justify-center items-center gap-2 ">
									<CarFront className="w-6 h-6 text-white" />
									<div className="font-semibold">
										Joined, Wait To Get Picked Up!
									</div>
								</div>
							) : (
								"Book Ride"
							)}
						</button>
					</div>
				</>
			) : (
				<RideChat tripId={tripId} />
			)}
		</div>
	);
}
