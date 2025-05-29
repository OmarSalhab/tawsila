import apiClient from "./apiClient";

export const getRouteIds = async () => {
	try {
		const response = await apiClient.get("/api/routes");
		if (response.status === 200) return response.data;
	} catch (error) {
		console.log(error.response);
	}
};
