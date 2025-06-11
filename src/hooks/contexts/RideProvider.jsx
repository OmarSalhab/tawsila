import { useReducer, useCallback, useEffect } from "react";
import { RideContext } from "../useRide";
import useAuth from "../useAuth";
import { getAvailableTrips, joinRide } from "../../services/rideApi";
import useSocket from "../useSocket";
import { useLocation } from "react-router-dom";
const initialState = {
	rides: undefined,
	loading: undefined,
	error: null,
	isPassengerJoined: false,

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

		//DRIVER RELATED ACTIONS
		case "FILTER_DRIVER_RIDES":
			return { ...state, filterLoading: true };

		case "RESULT_DRIVER_RIDES": {
			const filteredRides = state.rides.filter(
				(ride) => ride.driverId._id === payload
			);
			return { ...state, driverRides: filteredRides, filterLoading: false };
		}

		// PASSENGER RELATED ACTIONS
		case "ADD_PASSENGER": {
			const { tripId, passenger, seatId } = payload;
			const updatedRides = state.rides.map((ride) =>
				ride._id === tripId
					? {
							...ride,
							joinedPassengers: [
								...(ride.joinedPassengers || []),
								{ passenger, seatId },
							],
					  }
					: ride
			);
			const isCurrentUser = passenger === state.currentUserId;
			return {
				...state,
				rides: updatedRides,
				isPassengerJoined: isCurrentUser ? true : state.isPassengerJoined,
			};
		}

		case "BOOKED_RIDE":
			return {
				...state,
				loading: false,
				rides: payload,
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

		case "SET_CURRENT_USER":
			return { ...state, currentUserId: payload };

		case "CLEAR":
			return { initialState };
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
			dispatch({
				type: "BOOKED_RIDE",
				payload: response,
			});
			return response;
		} catch (error) {
			return error;
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
						const passengerRide = response.filter((ride) => {
							const asignedPassenger = ride.joinedPassengers.filter(
								(passenger) => passenger.passenger === user._id
							);

							return asignedPassenger.length !== 0;
						});

						if (passengerRide.length > 0) {
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
		if (socket && user) {
			socket.on("new_ride", (ride) => {
				dispatch({ type: "ADD_NEW_REALTIME_RIDE", payload: ride });
			});

			socket.on("passenger_joined", (message) => {
				dispatch({ type: "ADD_PASSENGER", payload: message });
			});

			return () => {
				socket.off("new_ride");
				socket.off("passenger_joined");
			};
		}
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
		<RideContext.Provider value={{ ...state, joinPassenger }}>
			{children}
		</RideContext.Provider>
	);
};

export default RideProvider;
