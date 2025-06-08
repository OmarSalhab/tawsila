import { useState } from "react";
import { User, MessageCircle } from "lucide-react";
import Profile from "../../components/profile";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import AllRides from "../../components/allRides";

export default function Home() {
	const [showProfile, setShowProfile] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();

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
				<AllRides />
			</div>
			<Profile open={showProfile} onClose={() => setShowProfile(false)} />
		</>
	);
}
