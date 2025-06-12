import { useState } from "react";
import { User, MessageCircle } from "lucide-react";
import Profile from "../../components/profile";
import { useNavigate } from "react-router-dom";
import AllRides from "../../components/allRides";
import useAuth from "../../hooks/useAuth";
import useRide from "../../hooks/useRide";
import RideSkeleton from "../../components/rideSkeleton";

export default function Home() {
	const [showProfile, setShowProfile] = useState(false);

	const navigate = useNavigate();
	const { user } = useAuth();
	const { rides, loading, isPassengerJoined,passengerRoom } = useRide();
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
					<MessageCircle
						className="text-white w-6 h-6 z-10"
						onClick={() => navigate("/route-chat-room")}
					/>
				</div>
				{loading || !rides ? (
					<RideSkeleton />
				) : (
					<AllRides
						user={user}
						rides={rides}
						isPassengerJoined={isPassengerJoined}
						passengerRoom={passengerRoom}
					/>
				)}
			</div>
			<Profile open={showProfile} onClose={() => setShowProfile(false)} />
		</>
	);
}
