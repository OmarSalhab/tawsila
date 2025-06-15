import { useReducer, useCallback, useEffect } from "react";
import { RideContext } from "../useRide";
import useAuth from "../useAuth";
import {
	getAvailableTrips,
	joinRide,
	kickPassenger as kickPassengerApi,
} from "../../services/rideApi";
import useSocket from "../useSocket";
import { useLocation } from "react-router-dom";
const initialState = {
	rides: undefined,
	loading: undefined,
	error: null,
	isPassengerJoined: false,
	passengerRoom: null,

	driverRides: undefined,
	filterLoading: false,

	currentUserId: null,
};
const RideReducer = (state, { type, payload }) => {
	switch (type) {
		// ALL USESRS RELATED ACTIONS
		case "GET_ALL_AVAILABLE_RIDES":
			return { ...state, loading: true };

		case "SUCCESS_ALL_AVAILABLE_RIDES": {
			const updatedRides = payload.sort(
				(a, b) => new Date(a.departureTime) - new Date(b.departureTime)
			);
			return {
				...state,
				loading: false,
				rides: updatedRides,
				isPassengerJoined: false,
			};
		}

		case "FAILED_ALL_AVAILABLE_RIDES":
			return { ...state, error: payload };

		case "SET_CURRENT_USER":
			return { ...state, currentUserId: payload };

		case "CLEAR":
			return { initialState };

		//DRIVER RELATED ACTIONS
		case "FILTER_DRIVER_RIDES":
			return { ...state, filterLoading: true };

		case "RESULT_DRIVER_RIDES": {
			const filteredRides = state.rides.filter(
				(ride) => ride.driverId._id === payload
			);
			return { ...state, driverRides: filteredRides, filterLoading: false };
		}

		case "KICK_REALTIME_PASSENGER": {
			const { tripId, passenger, allRides } = payload;
			const updatedRides = state.rides.map((ride) =>
				ride._id === tripId
					? {
							...ride,
							joinedPassengers: ride.joinedPassengers.filter(
								(p) => p.passenger !== passenger
							),
					  }
					: ride
			);
			const isCurrentUser = passenger === state.currentUserId;
			console.log(
				`is current user: ${isCurrentUser}, allRides ${allRides}, updatedRides ${updatedRides}`
			);

			return {
				...state,
				passengerRoom: isCurrentUser ? null : state.passengerRoom,
				rides: isCurrentUser ? allRides : updatedRides,
				isPassengerJoined: isCurrentUser ? false : state.isPassengerJoined,
			};
		}

		case "COMPLETE_RIDE": {
			const { tripId } = payload;
			const updatedRides = state.rides.map((ride) =>
				ride._id === tripId ? { ...ride, status: "completed" } : ride
			);
			return { ...state, rides: updatedRides };
		}

		// PASSENGER RELATED ACTIONS
		case "BOOKED_RIDE":
			return {
				...state,
				loading: false,
				rides: payload,
				passengerRoom: payload[0]._id,
				isPassengerJoined: true,
			};

		//REALTIME UPDATES ACTIONS VIA *SOCKET
		case "ADD_NEW_REALTIME_RIDE": {
			if (state.rides.some((ride) => ride._id === payload._id)) {
				return state;
			}
			const updatedRides = [...state.rides, payload].sort(
				(a, b) => new Date(a.departureTime) - new Date(b.departureTime)
			);
			return { ...state, rides: updatedRides };
		}

		case "ADD_REALTIME_PASSENGER": {
			const { tripId, passenger, seatId, ride } = payload;
			console.log(tripId, passenger, seatId, ride);

			const updatedRides = state.rides.map((Ride) =>
				Ride._id === tripId
					? {
							...Ride,
							joinedPassengers: [
								...(Ride.joinedPassengers || []),
								{ passenger, seatId },
							],
					  }
					: Ride
			);
			const isCurrentUser = passenger === state.currentUserId;
			return {
				...state,
				passengerRoom: isCurrentUser ? ride[0]._id : state.passengerRoom,
				rides: isCurrentUser ? ride : updatedRides,
				isPassengerJoined: isCurrentUser ? true : state.isPassengerJoined,
			};
		}
	}
};
const RideProvider = ({ children }) => {
	const [state, dispatch] = useReducer(RideReducer, initialState);

	const { user } = useAuth();
	const { socket } = useSocket();
	const location = useLocation();

	const joinPassenger = useCallback(async (selectedSeat, tripId) => {
		try {
			const response = await joinRide(selectedSeat, tripId);
			return response;
		} catch (error) {
			console.log(error);
			return error;
		}
	}, []);

	const kickPassenger = useCallback(async (passengerId, tripId) => {
		try {
			await kickPassengerApi(passengerId, tripId);
		} catch (error) {
			console.log(error);
		}
	}, []);

	

	//RESPONSIBLE FOR FETCHING RIDES AND HANDLEING JOINED PASSENGERS ONE TIME OR WHEN THE USER CHANGES
	useEffect(() => {
		if (user) {
			const fetchAllAvailableRides = async () => {
				try {
					dispatch({ type: "GET_ALL_AVAILABLE_RIDES" });
					if (user.role === "driver") {
						const response = await getAvailableTrips();
						dispatch({
							type: "SUCCESS_ALL_AVAILABLE_RIDES",
							payload: response,
						});
					} else if (user.role === "passenger") {
						const response = await getAvailableTrips();

						if (!response) throw Error(`Error while fetching available rides`);
						const passengerRide = response.filter((ride) =>
							ride.joinedPassengers.some(
								(passenger) => passenger.passenger === user._id
							)
						);

						if (passengerRide.length && response.length) {
							dispatch({
								type: "BOOKED_RIDE",
								payload: passengerRide,
							});
						} else {
							dispatch({
								type: "SUCCESS_ALL_AVAILABLE_RIDES",
								payload: response,
							});
						}
					}
				} catch (error) {
					dispatch({ type: "FAILED_ALL_AVAILABLE_RIDES", payload: error });
				}
			};
			fetchAllAvailableRides();
		}
	}, [user]);

	//RESPONSIBLE FOR FILTERING (IN DRIVER PATH ONLY) RIDES ONE TIME OR WHEN THE USER CHANGES OR AVAILABLE RIDES
	useEffect(() => {
		if (location.pathname === "/home-driver" && state.rides && user) {
			console.log("driver useEffect");
			dispatch({ type: "FILTER_DRIVER_RIDES" });
			dispatch({ type: "RESULT_DRIVER_RIDES", payload: user._id });
		}
	}, [user, location, state.rides]);

	//RESPONSIBLE FOR THE REALTIME UPDATES USING *SOCKET EVENTS
	useEffect(() => {
		const handleNewRide = (ride) => {
			dispatch({ type: "ADD_NEW_REALTIME_RIDE", payload: ride });
		};
		const handlePassengerJoined = (message) => {
			dispatch({ type: "ADD_REALTIME_PASSENGER", payload: message });
		};
		const handlePassengerKicked = async (message) => {
			console.log(
				`user id from the auth : ${user._id}, passenger id from socket emit ${message.passenger}`
			);

			if (message.passenger === user._id) {
				const allRides = await getAvailableTrips();
				console.log(
					`the allRides got called after checking that the user is the same one that got kicked: ${allRides}`
				);
				dispatch({
					type: "KICK_REALTIME_PASSENGER",
					payload: { ...message, allRides },
				});
			} else {
				dispatch({ type: "KICK_REALTIME_PASSENGER", payload: message });
			}
		};
		if (socket && user) {
			socket.on("new_ride", handleNewRide);
			socket.on("passenger_joined", handlePassengerJoined);
			socket.on("room_passenger_kicked", handlePassengerKicked);
		}

		return () => {
			if (socket) {
				socket.off("new_ride", handleNewRide);
				socket.off("passenger_joined", handlePassengerJoined);
				socket.off("room_passenger_kicked", handlePassengerKicked);
			}
		};
	}, [socket, user]);

	useEffect(() => {
		if (user) {
			dispatch({ type: "SET_CURRENT_USER", payload: user._id });
		}
	}, [user]);

	useEffect(() => {
		if (user === null) {
			dispatch({ type: "CLEAR" });
		}
	}, [user]);

	return (
		<RideContext.Provider
			value={{ ...state, joinPassenger, kickPassenger }}
		>
			{children}
		</RideContext.Provider>
	);
};

export default RideProvider;
