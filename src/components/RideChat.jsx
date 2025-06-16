import { useRef, useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Reply } from "lucide-react";
import useAuth from "../hooks/useAuth";
import ChatInput from "./chatInput";
import useSocket from "../hooks/useSocket";
import { getRoomChat } from "../services/chatApi";
import MessageSkeleton from "./messageSkeleton";

export default function RideChat({ tripId }) {
	const [isTyping, setIsTyping] = useState(false);
	const [messages, setMessages] = useState(null);
	const [replayToUser, setReplayToUser] = useState(null);

	const messagesEndRef = useRef(null);
	const { user } = useAuth();
	const { socket } = useSocket();

	const handleSubmit = async (inputValue) => {
		if (!inputValue.trim()) return;
		if (replayToUser) {
			socket?.emit("send_room_message", {
				content: inputValue,
				userName: user?.name,
				senderId: user?._id,
				reply: replayToUser.id,
				tripId: tripId,
				createdAt: Date.now(),
			});
			setReplayToUser(null);
		} else {
			socket?.emit("send_room_message", {
				content: inputValue,
				userName: user?.name,
				senderId: user?._id,
				tripId: tripId,
				createdAt: Date.now(),
			});
		}
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	useEffect(() => {
		if (socket) {
			const handleMessage = (message) => {
				if (message.reply) {
					const newMessage = {
						id: message.msgId,
						userId: message.userId,
						user: message.userName,
						reply: message.reply,
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
				} else {
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
				}
			};
			socket.on("receive_room_message", handleMessage);
			return () => {
				socket.off("receive_room_message", handleMessage);
			};
		}
	}, [socket]);

	useEffect(() => {
		try {
			const fetchMessages = async () => {
				const messagesList = await getRoomChat(tripId);
				setMessages(messagesList);
			};
			fetchMessages();
		} catch (error) {
			console.error(error);
		}
	}, [tripId]);


	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div
			className={`flex flex-col h-[90%] bg-white`}
		>
			{/* Chat messages */}
			<div
				className="flex-1 overflow-y-auto px-2 py-4 space-y-4 bg-white"
				onClick={() => setIsTyping(false)}
			>
				{messages ? (
					messages.length > 0 ? (
						<>
							{messages.map((msg) => (
								<>
									{msg.reply ? (
										<>
											<div
												key={msg.id}
												className={
													msg.userId === user._id
														? "flex flex-col items-end "
														: "flex flex-col items-start "
												}
											>
												<div className=" bg-slate-200 rounded-md opacity-60">
													<div className="overflow-clip max-h-[110px] max-w-[220px] text-center p-3 ">
														{
															messages.find((chat) => chat.id === msg.reply)
																.text
														}
													</div>
												</div>
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
														<button onClick={() => setReplayToUser(msg)}>
															<Reply className="w-4 h-4 text-gray-400 m-2" />{" "}
														</button>
													</div>
													<div className="text-sm mb-1">{msg.text}</div>
													<div className="text-xs text-right text-gray-400">
														{msg.time}
													</div>
												</div>
											</div>
										</>
									) : (
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
													<button onClick={() => setReplayToUser(msg)}>
														<Reply className="w-4 h-4 text-gray-400 m-2" />{" "}
													</button>
												</div>
												<div className="text-sm mb-1">{msg.text}</div>
												<div className="text-xs text-right text-gray-400">
													{msg.time}
												</div>
											</div>
										</div>
									)}
									<div ref={messagesEndRef} />
								</>
							))}
						</>
					) : (
						<p className="text-gray-400 text-lg text-center">
							No messages yet. Be the first to say hello!
						</p>
					)
				) : (
					<MessageSkeleton count={5}/>
				)}
			</div>
			{/* Input Bar */}
			{replayToUser && (
				<div className="w-full bg-gray-100 rounded-lg flex justify-between p-3 max-h-[100px]">
					<div className="overflow-auto">{replayToUser.text}</div>
					<div
						className="m-2"
						onClick={() => {
							setReplayToUser(null);
						}}
					>
						X
					</div>
				</div>
			)}

			{/* Message input */}
			<ChatInput setIsTyping={setIsTyping} handleSubmit={handleSubmit}>
				<div className="m-2 cursor-pointer">
					<MapPin className="w-6 h-6 text-gray-500" />
				</div>
			</ChatInput>
		</div>
	);
}
