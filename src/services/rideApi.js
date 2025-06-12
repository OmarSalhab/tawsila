import apiClient from "./apiClient";

export const getAvailableTrips = async () => {
	try {
		const response = await apiClient.get("/api/trips/available", {
			withCredentials: true,
		});

		console.log(response.data.data);

		return response.data.data;
	} catch (error) {
		throw error?.data?.message || error;
	}
};

export const getMyRides = async () => {
	try {
		const response = await apiClient.get("/api/trips/me", {
			withCredentials: true,
		});

		return response.data.data;
	} catch (error) {
		throw error?.data?.message || error;
	}
};

export const createRide = async (data) => {
	try {
		const response = await apiClient.post("/api/trips/", data, {
			withCredentials: true,
		});
		return response.data.data;
	} catch (error) {
		throw error?.data?.data?.message || error;
	}
};

export const joinRide = async (seatId, tripId) => {
	try {
		console.log(seatId, tripId);

		const response = await apiClient.post(
			`/api/trips/join/${tripId}`,
			{ seatId },
			{
				withCredentials: true,
			}
		);
		console.log(response.data.data);

		return response.data.data;
	} catch (error) {
		throw error?.data?.data?.message || error;
	}
};

export const getPassengers = async (tripId, users) => {
	try {
		const response = await apiClient.post(
			`/api/trips/${tripId}`,
			{ users },
			{ withCredentials: true }
		);

		return response.data.data;
	} catch (error) {
		throw error.data?.data?.message || error;
	}
};

export const kickPassenger = async (passengerId, tripId) => {
	try {
		const response = await apiClient.delete(
			`/api/trips/kick/${tripId}/${passengerId}`,
			{ withCredentials: true }
		);
		console.log(response);
		
		return response.data.data;
	} catch (error) {
		throw error.data?.data?.message || error;
	}
};
