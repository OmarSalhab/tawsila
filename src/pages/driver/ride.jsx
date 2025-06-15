import { ArrowLeft, User } from "lucide-react";
import { useEffect, useState } from "react";
import RideChat from "../../components/rideChat";
import { Link, useParams } from "react-router-dom";
import { formatTime } from "../../services/formatTime";
import useRide from "../../hooks/useRide";
import useSocket from "../../hooks/useSocket";
import carInterior from "../../assets/machine-inside-interior-of-the-vehicle-vector-2AKH64B.jpg";
import RoomSkeleton from "../../components/roomSkeleton";
import { getPassengers } from "../../services/rideApi";

export default function Ride() {
	const [selectedSeat, setSelectedSeat] = useState(null);
	const [tab, setTab] = useState("Passengers");
	const [ride, setRide] = useState(null);
	const [passengers, setPassengers] = useState(null);
	const { socket, activeRoomMemebersCount, joinRoom, leaveRoom } = useSocket();
	const { isPassengerJoined, rides, kickPassenger } = useRide();
	const { tripId } = useParams();
	const [seatLayout, setSeatLayout] = useState([
		{ id: 1, label: "Front", booked: false },
		{ id: 2, label: "Left Back", booked: false },
		{ id: 3, label: "Middle Back", booked: false },
		{ id: 4, label: "Right Back", booked: false },
	]);

	const handleKickPassenger = async (passengerId) => {
		try {
			await kickPassenger(passengerId, tripId);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCompletion = async () => {};

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
				setSeatLayout(
					(prev) =>
						prev.map((seat) => ({
							...seat,
							booked: bookedSeatIds.includes(seat.id),
						}))
					//----------------------------------
				);
				const getUsers = async () => {
					try {
						console.log("the effect that will run after the rides updated");

						const users = targetRide.joinedPassengers.map((p) => p.passenger);
						const response = await getPassengers(tripId, users);
						console.log(`the new users array ${response}`);

						setPassengers(response);
					} catch (error) {
						console.log(error);
					}
				};
				getUsers();
			}
		}
	}, [rides, tripId]);

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
					<Link to="/home-driver">
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
						tab === "Passengers" &&
						"border-b-2 border-primary text-primary bg-white focus:outline-none"
					} `}
					onClick={() => setTab("Passengers")}
				>
					Passengers
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
			{tab === "Passengers" ? (
				<>
					{/* Passenger Details */}
					<div className="space-y-4 px-4 py-2">
						{passengers && passengers.length > 0 ? (
							passengers.map((p) => (
								<div
									key={p._id}
									className="flex items-center justify-between bg-white rounded-lg shadow p-4 border border-gray-100"
								>
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-primary uppercase">
											{p.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</div>
										<div>
											<div className="font-semibold text-gray-800">
												{p.name}
											</div>
											<div className="text-xs text-gray-500 capitalize">
												{p.gender} &bull; Rating:{" "}
												<span className="font-medium text-yellow-500">
													{p.ratingValue}
												</span>
											</div>
										</div>
									</div>
									<button
										className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors"
										onClick={() => handleKickPassenger(p._id)}
									>
										Kick
									</button>
								</div>
							))
						) : (
							<div className="text-gray-500 text-center py-4">
								No passengers yet.
							</div>
						)}
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
											disabled={true}
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
												disabled={true}
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
							onClick={handleCompletion}
						>
							{false ? (
								<div className="flex justify-center items-center gap-2 ">
									<CarFront className="w-6 h-6 text-white" />
									<div className="font-semibold">
										Joined, Wait To Get Picked Up!
									</div>
								</div>
							) : (
								"Ride Is Completed"
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
