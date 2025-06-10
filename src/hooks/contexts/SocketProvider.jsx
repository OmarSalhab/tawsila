import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Context } from "../useSocket";
import useAuth from "../useAuth";
const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [activeMemebersCount, setActiveMemebersCount] = useState(0);
	const [activeRoomMemebersCount,setActiveRoomMemebersCount]= useState(0);
	const { user, isAuthenticated } = useAuth();

	useEffect(() => {
		let socketInit = null;
		if (isAuthenticated) {
			socketInit = io("http://localhost:9001", {
				reconnection: true,
				reconnectionAttempts: 3,
			});

			socketInit.on("connect", () => {
				console.log("Socket connected successfully! ");
			});

			setSocket(socketInit);
		}
		return () => {
			if (socketInit) {
				socketInit.disconnect();
			}
		};
	}, [isAuthenticated]);

	useEffect(() => {
		if (socket && user?.routeId._id) {
			socket.emit("join_route", user.routeId._id);
		}
	}, [socket, user]);

	

	useEffect(() => {
		if (socket) {
			socket.on("memebers_count", (count) => {
				setActiveMemebersCount(count);
			});

			return () => {
				socket.off("memebers_count", (count) => {
					setActiveMemebersCount(count);
				});
			};
		}
	}, [socket]);

	useEffect(() => {
		if (socket) {
			socket.on("room_memebers_count", (count) => {
				setActiveRoomMemebersCount(count);
			});

			return () => {
				socket.off("room_memebers_count", (count) => {
					setActiveRoomMemebersCount(count);
				});
			};
		}
	}, [socket]);
	return (
		<Context.Provider value={{ socket, activeMemebersCount,activeRoomMemebersCount }}>
			{children}
		</Context.Provider>
	);
};

export default SocketProvider;
