import { Car } from "lucide-react";
import RideSkeleton from "./rideSkeleton";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../services/formatTime";

export default function DriverMyRides({ myRides }) {
	const navigate = useNavigate();

	
	if (myRides.length === 0) {
		return (
			<div className="bg-white rounded-lg shadow-md p-8 mt-8 flex flex-col items-center justify-center text-center mx-auto max-w-md">
				<Car className="w-10 h-10 text-gray-400 mb-3" />
				<p className="text-gray-500 text-lg mb-1">
					You haven't created any rides
				</p>
				<p className="text-gray-400 text-sm">
					Create your first ride to get started
				</p>
			</div>
		);
	}
	return (
		<div className="space-y-4 mt-4">
			{myRides.map((ride) => (
				<div
					key={ride._id}
					className="relative bg-white rounded-lg shadow-md p-4 flex flex-col mb-2"
					onClick={() => {
						navigate(`/ride-room-driver/${ride._id}`);
					}}
				>
					<span className="absolute left-0 top-0 h-full w-1.5 rounded-l-lg bg-secondary" />
					<div className="flex items-center justify-between mb-1">
						<span className="text-gray-500 text-sm">
							Driver{" "}
							<span className="font-bold text-gray-900">
								{ride.driverId.name}
							</span>
						</span>
						<span
							className={`text-xs font-semibold ${
								ride.driverId.gender === "male"
									? "text-blue-500"
									: "text-pink-500"
							}`}
						>
							{ride.driverId.gender.charAt(0).toUpperCase() +
								ride.driverId.gender.slice(1)}
						</span>
						<span className="flex items-center text-black-500 text-xs font-semibold bg-yellow-100 rounded px-1.5 py-0.5 ml-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-3 h-3 fill-current mr-0.5 text-secondary"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.307a.563.563 0 00.424.307l4.749.693c.462.067.646.636.312.96l-3.432 3.343a.563.563 0 00-.162.5l.81 4.725c.079.462-.406.815-.823.598l-4.243-2.23a.563.563 0 00-.523 0l-4.243 2.23c-.417.217-.902-.136-.823-.598l.81-4.726a.563.563 0 00-.162-.499L2.344 9.766c-.334-.324-.15-.893.312-.96l4.75-.693a.563.563 0 00.424-.307l2.125-4.307z"
								/>
							</svg>
							{ride.driverId.ratingValue}
						</span>
						<div className="flex flex-col items-end">
							<span className="bg-sky-200 text-primary text-sm font-medium p-[2px] rounded-sm">
								{ride.dayMonth <=
								new Date().toLocaleDateString("en-GB", {
									day: "2-digit",
									month: "2-digit",
								})
									? ride.dayMonth <
									  new Date().toLocaleDateString("en-GB", {
											day: "2-digit",
											month: "2-digit",
									  })
										? `Ended`
										: `Today`
									: `Tomorrow`}
							</span>
							<span className="bg-gray-100 text-gray-700 text-xs font-semibold rounded px-4 py-0.5 ml-2">
								{formatTime(ride.time)}
							</span>
						</div>
					</div>
					<div className="flex items-center space-x-2 mt-2 mb-1">
						<span className="flex items-center text-sm">
							<span className="w-3 h-3 rounded-full bg-primary mr-1" />
							{ride.routeId.from}
						</span>
						<span className="text-gray-400">|</span>
						<span className="flex items-center text-sm">
							<span className="w-3 h-3 rounded-full bg-secondary mr-1" />
							{ride.routeId.to}
						</span>
					</div>
					<div className="flex items-center justify-between mt-2">
						<span className="text-gray-500 text-sm">
							{ride.joinedPassengers?.length}/{ride.availableSeats} passengers
						</span>
						<span className="text-right">
							<span className="block text-xs text-gray-400">Price</span>
							<span className="text-sm font-semibold text-gray-900">
								{`${ride.price.toFixed(2)} JD`}
							</span>
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
