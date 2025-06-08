import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ChatInput from "../../components/chatInput";
import { useEffect, useRef, useState } from "react";
import useSocket from "../../hooks/useSocket";
import { getChat, getMemebers } from "../../services/getChat";
export default function GlobalChat() {
	const [isTyping, setIsTyping] = useState(false);
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null); // Add this ref
	const { user } = useAuth();
	const { socket, activeMemebersCount } = useSocket();
	const [members, setMembers] = useState(0);

	const handleSubmit = (inputValue) => {
		if (!inputValue.trim()) return;
		// Emit the message to the server
		socket?.emit("send_message", {
			content: inputValue,
			userName: user?.name,
			senderId: user?._id,
			routeId: user?.routeId?._id,
			createdAt: Date.now(),
		});
	};
	useEffect(() => {
		const fetchMemebers = async () => {
			try {
				const count = await getMemebers();
				setMembers(count);
			} catch (error) {
				console.error(error);
			}
		};
		fetchMemebers();
	}, [user?.routeId]);

	useEffect(() => {
		if (socket) {
			const handleMessage = (message) => {
				const newMessage = {
					id: message.msgId,
					userId: message.userId,
					user: message.userName,
					text: message.content,
					time: new Date().toLocaleTimeString([], {
						month: "2-digit",
						day: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					}),
					type: message.role,
				};
				setMessages((prev) => [...prev, newMessage]);
			};
			socket.on("receive_message", handleMessage);
			return () => {
				socket.off("receive_message", handleMessage);
			};
		}
	}, [socket]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		try {
			const fetchMessages = async () => {
				const messagesList = await getChat();
				setMessages(messagesList);
			};
			fetchMessages();
		} catch (error) {
			console.error(error);
		}
	}, [user?.routeId]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);
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
				<div className="flex flex-col justify-center">
					<div className="text-white text-[10px]">
						<span className="text-secondary font-semibold text-sm">
							{members}
						</span>{" "}
						Members
					</div>
					<div className="text-white text-[10px]">
						<span className="text-secondary font-semibold text-sm">
							{activeMemebersCount}
						</span>{" "}
						Active
					</div>
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
							<>
								{messages.map((msg) => (
									<div
										key={msg.id}
										className={
											msg.userId === user._id
												? "flex justify-end"
												: "flex justify-start"
										}
									>
										<div
											className={
												msg.type === "driver"
													? "bg-yellow-100 border border-yellow-200 text-gray-800 max-w-xs p-3 rounded-lg shadow-sm"
													: msg.userId === user._id
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
								))}
								<div ref={messagesEndRef} />
							</>
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
