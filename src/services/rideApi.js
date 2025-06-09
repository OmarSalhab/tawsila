import apiClient from "./apiClient";

export const getAvailableTrips = async () => {
	try {
		const response = await apiClient.get("/api/trips/available", {
			withCredentials: true,
		});
        
        console.log(response.data);
		
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
		throw error?.data?.message || error;
	}
};