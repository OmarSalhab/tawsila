import { useState } from "react";
import { User, MessageCircle } from "lucide-react";
import AllRides from "../../components/allRides";
import DriverMyRides from "../../components/driverMyRides";
import CreateRide from "../../components/createRide";
import { useNavigate } from "react-router-dom";
import Profile from "../../components/profile";


export default function DriverHome() {
	const [tab, setTab] = useState("myRides");
	const [showProfile, setShowProfile] = useState(false);
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gray-50 pb-24">
			{/* Header */}
			<div className="w-full bg-primary py-4 flex items-center justify-between px-4">
				<User
					className="text-white w-6 h-6 z-10"
					onClick={() => setShowProfile(true)}
				/>
				<h1 className="text-white text-xl font-bold text-center flex-1 -ml-6">
					Available Rides
				</h1>
				<MessageCircle
					className="text-white w-6 h-6 z-10"
					onClick={() => navigate("/route-chat-room")}
				/>
			</div>
			{/* Tabs */}
			<div className="flex w-full max-w-md mx-auto mt-4 rounded-lg overflow-hidden bg-gray-100">
				<button
					className={`flex-1 py-2 text-center font-semibold text-base transition-colors ${
						tab === "myRides" ? "bg-white text-black shadow" : "text-gray-400"
					}`}
					onClick={() => setTab("myRides")}
				>
					My Rides
				</button>
				<button
					className={`flex-1 py-2 text-center font-semibold text-base transition-colors ${
						tab === "allRides" ? "bg-white text-black shadow" : "text-gray-400"
					}`}
					onClick={() => setTab("allRides")}
				>
					All Rides
				</button>
			</div>

			<div className="px-3">
				{tab === "myRides" ? <DriverMyRides /> : <AllRides />}
			</div>

			<CreateRide onClick={handleCreateRide} />
			<Profile open={showProfile} onClose={() => setShowProfile(false)} />
		</div>
	);
}

// Placeholder event handler
function handleCreateRide() {
	// Logic for creating a new ride (to be implemented)
}
