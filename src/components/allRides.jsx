import RideSkeleton from "./rideSkeleton";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../services/formatTime";

export default function AllRides({ user, rides,passengerRoom }) {
	const navigate = useNavigate();

	if (user.role === "passenger") {
		return (
			<div className="p-3">
				{rides.length === 0 ? (
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
						{rides.map((trip) => (
							<div
								key={trip._id}
								className="relative bg-white rounded-lg shadow-md p-4 flex flex-col mb-2"
							>
								{/* Orange bar */}
								<span className="absolute left-0 top-0 h-full w-1.5 rounded-l-lg bg-secondary" />
								<div className="flex items-center justify-between mb-1">
									<span className="text-gray-500 text-sm ">
										Driver{" "}
										<span className="ml-1 font-semibold text-gray-900">
											{trip.driverId.name}
										</span>
									</span>
									<span
										className={`text-xs font-semibold ${
											trip.driverId.gender === "male"
												? "text-blue-600"
												: "text-pink-600"
										}`}
									>
										{trip.driverId.gender.charAt(0).toUpperCase() +
											trip.driverId.gender.slice(1)}
									</span>
									<span className="flex items-center text-black-500 text-xs font-semibold bg-yellow-100 rounded px-1.5 py-0.5 ml-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-3 fill-current h-3 mr-0.5 text-secondary"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.307a.563.563 0 00.424.307l4.749.693c.462.067.646.636.312.96l-3.432 3.343a.563.563 0 00-.162.5l.81 4.725c.079.462-.406.815-.823.598l-4.243-2.23a.563.563 0 00-.523 0l-4.243 2.23c-.417.217-.902-.136-.823-.598l.81-4.726a.563.563 0 00-.162-.499L2.344 9.766c-.334-.324-.15-.893.312-.96l4.75-.693a.563.563 0 00.424-.307l2.125-4.307z"
											/>
										</svg>
										{trip.driverId.ratingValue}
									</span>
									<div className="flex flex-col items-end">
										<span className="bg-sky-200 text-primary text-sm font-medium p-[2px] rounded-sm">
											{new Date(trip.departureTime) <= new Date()
												? `Ended`
												: trip.dayMonth ===
												  new Date().toLocaleDateString("en-GB", {
														day: "2-digit",
														month: "2-digit",
												  })
												? `Today`
												: `Tomorrow`}
										</span>
										<span className="bg-gray-100 text-gray-700 text-xs font-semibold rounded px-4 py-0.5 ml-2">
											{formatTime(trip.time)}
										</span>
									</div>
								</div>
								<div className="flex flex-row items-center">
									<div className="flex flex-col items-left w-4/5">
										<span className="flex items-center text-sm">
											<span className="w-3 h-3 rounded-full bg-primary mr-1" />
											{trip.routeId.from}
										</span>
										<div className="w-0.5 h-6 bg-gray-300 ml-1.5 my-1"></div>
										<span className="flex items-center text-sm">
											<span className="w-3 h-3 rounded-full bg-secondary mr-1 " />
											{trip.routeId.to}
										</span>
									</div>
									<span className="text-right w-1/5">
										<span className="block text-xs text-gray-400">Price</span>
										<span className="text-sm font-semibold text-gray-900">
											{`${trip.price.toFixed(2)} JD`}
										</span>
									</span>
								</div>
								<div className="flex flex-row items-center justify-between">
									<div className="flex items-center justify-between mt-2">
										<span className="text-gray-700 text-sm">
											{trip.joinedPassengers.length}/{trip.availableSeats}{" "}
											passengers
										</span>
									</div>
									<button
										type="button"
										className="mt-3 border border-primary text-primary font-semibold rounded-md py-2 px-3 transition-colors"
										onClick={() => navigate(`/ride-room-passenger/${trip._id}`)}
									>
										{passengerRoom === trip._id ? "Show" : "Join Ride"}
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		);
	} else if (user.role === "driver") {
		return (
			<div className="p-3">
				{rides.length === 0 ? (
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
						{rides.map((trip) => (
							<div
								key={trip._id}
								className="relative bg-white rounded-lg shadow-md p-4 flex flex-col mb-2"
							>
								{/* Orange bar */}
								<span className="absolute left-0 top-0 h-full w-1.5 rounded-l-lg bg-secondary" />
								<div className="flex items-center justify-between mb-1">
									<span className="text-gray-500 text-sm ">
										Driver{" "}
										<span className="ml-1 font-semibold text-gray-900">
											{trip?.driverId?.name}
										</span>
									</span>
									<span
										className={`text-xs font-semibold ${
											trip.driverId.gender === "male"
												? "text-blue-600"
												: "text-pink-600"
										}`}
									>
										{trip.driverId.gender.charAt(0).toUpperCase() +
											trip.driverId.gender.slice(1)}
									</span>
									<span className="flex items-center text-black-500 text-xs font-semibold bg-yellow-100 rounded px-1.5 py-0.5 ml-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-3 fill-current h-3 mr-0.5 text-secondary"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.307a.563.563 0 00.424.307l4.749.693c.462.067.646.636.312.96l-3.432 3.343a.563.563 0 00-.162.5l.81 4.725c.079.462-.406.815-.823.598l-4.243-2.23a.563.563 0 00-.523 0l-4.243 2.23c-.417.217-.902-.136-.823-.598l.81-4.726a.563.563 0 00-.162-.499L2.344 9.766c-.334-.324-.15-.893.312-.96l4.75-.693a.563.563 0 00.424-.307l2.125-4.307z"
											/>
										</svg>
										{trip.driverId.ratingValue}
									</span>
									<div className="flex flex-col items-end">
										<span className="bg-sky-200 text-primary text-sm font-medium p-[2px] rounded-sm">
											{new Date(trip.departureTime) <= new Date()
												? `Ended`
												: trip.dayMonth ===
												  new Date().toLocaleDateString("en-GB", {
														day: "2-digit",
														month: "2-digit",
												  })
												? `Today`
												: `Tomorrow`}
										</span>
										<span className="bg-gray-100 text-gray-700 text-xs font-semibold rounded px-4 py-0.5 ml-2">
											{formatTime(trip.time)}
										</span>
									</div>
								</div>
								<div className="flex flex-row items-center">
									<div className="flex flex-col items-left w-4/5">
										<span className="flex items-center text-sm">
											<span className="w-3 h-3 rounded-full bg-primary mr-1" />
											{trip.routeId.from}
										</span>
										<div className="w-0.5 h-6 bg-gray-300 ml-1.5 my-1"></div>
										<span className="flex items-center text-sm">
											<span className="w-3 h-3 rounded-full bg-secondary mr-1 " />
											{trip.routeId.to}
										</span>
									</div>
									<span className="text-right w-1/5">
										<span className="block text-xs text-gray-400">Price</span>
										<span className="text-sm font-semibold text-gray-900">
											{`${trip.price.toFixed(2)} JD`}
										</span>
									</span>
								</div>
								<div className="flex flex-row items-center justify-between mt-4">
									<div className="flex items-center justify-between mt-2">
										<span className="text-gray-700 text-sm">
											{trip.joinedPassengers?.length}/{trip.availableSeats}{" "}
											passengers
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		);
	}
}
