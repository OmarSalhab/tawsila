import apiClient from "./apiClient";

export const updateUser = async (data, id) => {
	try {
		const response = await apiClient.put(
			`/api/users/update${id.trim()}`,
			data,
			{
				withCredentials: true,
			}
		);

		if (response.status === 200) return response.data;
	} catch (error) {
		throw error?.response?.data || error;
	}
};
