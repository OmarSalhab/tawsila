import apiClient from "./apiClient";

export const getRouteIds = async () => {
	try {
		const response = await apiClient.get("/api/routes", {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
};
