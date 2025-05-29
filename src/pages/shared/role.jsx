import { User, Car } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Role() {
	const [selected, setSelected] = useState(null);
	const navigate = useNavigate();
	return (
		<div className="min-h-screen flex flex-col items-center bg-gray-50">
			<div className="w-full bg-primary py-8 flex justify-center">
				<h1 className="text-white text-2xl font-bold">Jordan Rides Connect</h1>
			</div>
			<div className="w-full max-w-xs flex flex-col flex-1 justify-center mt-8">
				<h2 className="text-2xl font-bold text-center mb-1">
					Choose Your Role
				</h2>
				<p className="text-gray-500 text-center mb-6">
					Select how you want to use our service
				</p>
				<div className="space-y-4">
					<button
						type="button"
						className={`w-full bg-white rounded-lg border transition-all duration-150 flex flex-col items-center px-4 py-6 focus:outline-none active:scale-95 ${
							selected === "passenger"
								? "border-primary scale-95"
								: "border-gray-200"
						}`}
						onClick={() => handleSelect("passenger", setSelected, navigate)}
					>
						<span className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
							<User className="w-8 h-8 text-primary" />
						</span>
						<span className="text-lg font-semibold text-gray-900 mb-1">
							Passenger
						</span>
						<span className="text-gray-500 text-center text-sm">
							Join rides and travel with others. Find the best rides that match
							your schedule and budget.
						</span>
					</button>
					<button
						type="button"
						className={`w-full bg-white rounded-lg border transition-all duration-150 flex flex-col items-center px-4 py-6 focus:outline-none active:scale-95 ${
							selected === "rider"
								? "border-primary scale-95"
								: "border-gray-200"
						}`}
						onClick={() => handleSelect("driver", setSelected, navigate)}
					>
						<span className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
							<Car className="w-8 h-8 text-primary" />
						</span>
						<span className="text-lg font-semibold text-gray-900 mb-1">
							Rider
						</span>
						<span className="text-gray-500 text-center text-sm">
							Offer rides and earn money. Create rides and set your own schedule
							and prices.
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}

// Placeholder event handler
function handleSelect(role, setSelected, navigate) {
	setSelected(role);
	navigate(`/signup-${role}`);
	// Add any additional logic for selection here
}
