import { X, User } from "lucide-react";
import useAuth from "../hooks/useAuth";
import ProfileSetting from "./profileSetting";
import { useState } from "react";
export default function Profile({ open, onClose }) {
	const { user, logout } = useAuth();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const handleLogout = async () => {
		await logout();
	};
	
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex">
			{/* Overlay */}
			<div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />
			{/* Sidebar */}
			<div className="relative bg-white w-80 max-w-full h-full shadow-xl p-6 animate-slideInLeft">
				<button
					className="absolute top-4 right-4 text-gray-500"
					onClick={onClose}
					aria-label="Close"
				>
					<X className="w-6 h-6" />
				</button>
				<div className="flex flex-col items-center mt-2">
					<span className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
						<User className="w-16 h-16 text-gray-400" />
					</span>
					<span className={`absolute top-[100px] left-1/2 -translate-x-1/2  ${user?.gender === "male" ? "text-blue-600 bg-blue-100":"text-pink-600 bg-pink-100"} text-sm px-2 py-0.5 rounded-full font-semibold border border-blue-200`}>
						{user?.gender}
					</span>
					<div className="mt-6 text-center">
						<div className="text-xl font-bold">{user?.name}</div>
						<div className="text-gray-500 text-sm mt-1 mb-2">{user?.phone}</div>
						<div className="flex items-center justify-center gap-1 mb-2">
							<span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-sm font-semibold flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-4 h-4 mr-1"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.307a.563.563 0 00.424.307l4.749.693c.462.067.646.636.312.96l-3.432 3.343a.563.563 0 00-.162.5l.81 4.725c.079.462-.406.815-.823.598l-4.243-2.23a.563.563 0 00-.523 0l-4.243 2.23c-.417.217-.902-.136-.823-.598l.81-4.726a.563.563 0 00-.162-.499L2.344 9.766c-.334-.324-.15-.893.312-.96l4.75-.693a.563.563 0 00.424-.307l2.125-4.307z"
									/>
								</svg>
								{user?.ratingValue}
							</span>
						</div>
					</div>
					<div className="bg-gray-50 rounded-lg p-4 w-full mt-4 mb-6">
						<div className="flex justify-between text-sm mb-1">
							<span className="text-gray-500">Route</span>
							<span className="font-medium text-gray-900">{user?.routeId?.roomName}</span>
						</div>
						<div className="flex justify-between text-sm mb-1">
							<span className="text-gray-500">Member since</span>
							<span className="font-normal text-red-600 ">
								{formatDate(user?.createdAt)}
							</span>
						</div>
						<div className="flex justify-between text-sm mb-1">
							<span className="text-gray-500">Total rides</span>
							<span className="font-medium text-gray-900">{user?.ratingsCount}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-500">Role</span>
							<span className="font-medium text-gray-900">{user?.role.toUpperCase()}</span>
						</div>
					</div>
					<div className="flex flex-col w-full gap-2 text-base">
						<button
							type="button"
							className="text-left py-2 px-2 rounded hover:bg-gray-100"
						>
							My Trips
						</button>
						<button
							type="button"
							className="text-left py-2 px-2 rounded hover:bg-gray-100"
							onClick={() => {
								setIsProfileOpen(true);
							}}
						>
							Settings
						</button>
						<button
							type="button"
							className="text-left py-2 px-2 rounded hover:bg-gray-100"
						>
							Support
						</button>
					</div>
					<button
						type="button"
						className="w-full border border-red-500 text-red-600 font-semibold py-2 rounded-md mt-8 hover:bg-red-50"
						onClick={handleLogout}
					>
						Log Out
					</button>
				</div>
			</div>
			{isProfileOpen && (
				<ProfileSetting user={user} onClose={() => setIsProfileOpen(false)} />
			)}
		</div>
	);
}

function formatDate(dateString){
	const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInYears > 0) {
    return ` ${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  } else if (diffInMonths > 0) {
    return ` ${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  } else if (diffInDays > 0) {
    return ` ${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffInHours > 0) {
    return ` ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInMinutes > 0) {
    return ` ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'Just joined';
  }
}
