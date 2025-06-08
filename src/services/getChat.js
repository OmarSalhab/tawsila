import apiClient from "./apiClient";

export const getChat = async () => {
	try {
		const response = await apiClient.get("api/global-chat", {
			withCredentials: true,
		});
		return response.data.data;
	} catch (error) {
		throw error.data?.message || error;
	}
};
export const getMemebers = async () => {
	try {
		const response = await apiClient.get("api/global-chat/members", {
			withCredentials: true,
		});
		return response.data.data;
	} catch (error) {
		throw error.data?.message || error;
	}
};
