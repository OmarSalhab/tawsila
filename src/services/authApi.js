import apiClient from "./apiClient";

export const signupDriver = async (data) => {
	try {
		const response = await apiClient.post("/api/users/register/driver", data, {
			withCredentials: true,
		});
		if (response.status === 201) return response.data;
	} catch (error) {
		throw {
			message: error.response?.data?.message || "Signup failed",
			status: error.response?.status,
		};
	}
};

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

export const refresh = async () => {
	try {
		const response = await apiClient.get("/api/users/refresh", {
			withCredentials: true,
		});

		return response.data;
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
