import apiClient from "./apiClient";

export const signupPassenger = async (data) => {
	try {
		const response = await apiClient.post(
			"/api/users/register/passenger",
			data
		);
		if (response.status === 201) return response.data;
	} catch (error) {
		throw {
			message: error.response?.data?.message || "Signup failed",
			status: error.response?.status,
		};
	}
};

export const login = async (data) => {
	try {
		const response = await apiClient.post("/api/users/login", data);
		console.log(response);
		
		return response.data;
	} catch (error) {
		if (error?.response?.data?.msg) {
			throw error.response.data;
		} else if (error?.response?.data?.errors) {
			throw error.response.data.errors[0];
		} else {
			throw { msg: "An unexpected error occurred" };
		}
	}
};

export const getUserInfo = async () => {
	try {
		const response = await apiClient.get("/api/users/me");

		if (!response.data) throw new Error(response);
		return response.data;
	} catch (error) {
		console.log(error.message);
	}
};

export const postRefresh = async () => {
	try {
		const response = await apiClient.get(
			"/api/users/refresh",
			{ withCredentials: true }
		);
		
		return response.data;
	} catch (error) {
		throw new Error(error.message);
	}
};

export const logout = async ()=>{
	try {
		const response = await apiClient.post("/api/users/logout");
		return response.data
	} catch (error) {
		console.log(error);
	}
}