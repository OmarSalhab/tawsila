import axios from "axios";
const publicEndpoints = [
	"api/users/login",
	"api/users/register/passenger",
	"api/users/register/driver",
];

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor
apiClient.interceptors.request.use(
	(config) => {
		const isPublicEndpoint = publicEndpoints.some((endpoint) =>
			config.url.includes(endpoint)
	);
	if (!isPublicEndpoint) {
		
		const token = localStorage.getItem("token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle errors here
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.error("Response Error:", error.response.data);
		} else if (error.request) {
			// The request was made but no response was received
			console.error("Request Error:", error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			console.error("Error:", error.message);
		}
		return Promise.reject(error);
	}
);

export default apiClient;
