import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ChatInput from "../../components/chatInput";
import { useState } from "react";

const messages = [
	{
		id: 1,
		user: "Ahmad (Driver)",
		text: "I'll be starting from Mecca Mall exactly at 15:30.",
		time: "14:15",
		type: "driver",
	},
	{
		id: 2,
		user: "Sara",
		text: "Is there enough space for a small luggage?",
		time: "14:20",
		type: "passenger",
	},
	{
		id: 3,
		user: "Ahmad (Driver)",
		text: "Yes, there's room in the trunk for small bags.",
		time: "14:22",
		type: "driver",
	},
	{
		id: 4,
		user: "You",
		text: "Can we make a quick stop at Zarqa Mall?",
		time: "14:30",
		type: "me",
	},
];

export default function GlobalChat() {
	const { user } = useAuth();
	const [isTyping, setIsTyping] = useState(false);

	const handleSubmit = (inputValue) => {
		console.log(inputValue);
	};
	return (
		<div className="h-screen bg-gray-50 ">
			{/* Header */}
			<div className="w-full bg-primary py-4 flex items-center px-4">
				<button type="button" className="text-white mr-2">
					<Link to={`/home-${user?.role}`}>
						<ArrowLeft className="w-6 h-6" />
					</Link>
				</button>
				<div className="flex flex-col flex-1">
					<span className="text-white text-base font-semibold">
						{user?.routeId?.roomName}
					</span>
					<span className="text-white text-xs font-normal opacity-80">
						Route-specific ride sharing group
					</span>
				</div>
        <div className="text-white text-[10px]">
        <span className="text-secondary font-semibold text-sm">178</span> Memebers 
        </div>
			</div>
			{/* Chat Body */}
			<div
				className={`flex flex-col ${isTyping ? "h-[53%]" : "h-[90%]"} bg-white`}
			>
				<div
					className="flex-1 overflow-y-auto px-2 py-4 space-y-4 bg-white"
					onClick={() => setIsTyping(false)}
				>
					{messages ? (
						messages.length > 0 ? (
							messages.map((msg) => (
								<div
									key={msg.id}
									className={
										msg.type === "me"
											? "flex justify-end"
											: "flex justify-start"
									}
								>
									<div
										className={
											msg.type === "driver"
												? "bg-yellow-100 border border-yellow-200 text-gray-800 max-w-xs p-3 rounded-lg shadow-sm"
												: msg.type === "me"
												? "bg-primary text-white max-w-xs p-3 rounded-lg shadow-sm"
												: "bg-gray-100 text-gray-800 max-w-xs p-3 rounded-lg shadow-sm"
										}
									>
										<div className="flex items-center mb-1">
											<span className="font-medium text-sm">
												{msg.user}
												{msg.type === "driver" && (
													<span className="text-xs text-yellow-600 ml-1">
														(Driver)
													</span>
												)}
											</span>
										</div>
										<div className="text-sm mb-1">{msg.text}</div>
										<div className="text-xs text-right text-gray-400">
											{msg.time}
										</div>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-400 text-lg text-center">
								No messages yet. Be the first to say hello!
							</p>
						)
					) : (
						<div className="flex justify-center mt-5 text-xl">loading...</div>
					)}
				</div>
				{/* Input Bar */}
				<ChatInput setIsTyping={setIsTyping} handleSubmit={handleSubmit} />
			</div>
		</div>
	);
}
