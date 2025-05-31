import apiClient from "./apiClient";

export const signupPassenger = async (data) => {
	try {
		const response = await apiClient.post(
			"/api/users/register/passenger",
			data,
			{ withCredentials: true }
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
		const response = await apiClient.post("/api/users/login", data, {
			withCredentials: true,
		});
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
		const response = await apiClient.get("/api/users/me", {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
};

export const postRefresh = async () => {
	try {
		const response = await fetch("http://localhost:9001/api/users/refresh", {
			method: "GET",
			credentials: "include",
		});
		console.log(response);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		console.log(data);
		  return data;
	} catch (error) {
		throw error.response?.data || error;
	}
};

export const logout = async () => {
	try {
		await apiClient.post("/api/users/logout", {}, { withCredentials: true });
	} catch (error) {
		throw error.response?.data || error;
	}
};
