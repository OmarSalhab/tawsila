import { useReducer, useCallback, useEffect, useLayoutEffect } from "react";
import {
	login as loginApi,
	getUserInfo,
	postRefresh,
	logout as logoutApi,
} from "../../services/authApi";
import apiClient from "../../services/apiClient";
import { AuthContext } from "./useAuth";
// import { jwtDecode } from "jwt-decode";
const initialState = {
	user: undefined,
	token: undefined,
	isAuthenticated: false,
	loading: false,
	error: undefined,
};
const publicEndpoints = [
	"/api/users/login",
	"/api/users/register/passenger",
	"/api/users/register/driver",
	"/api/users/refresh",
];

function authReducer(state, action) {
	switch (action.type) {
		case "AUTH_START":
			return { ...state, loading: true, error: undefined };
		case "AUTH_SUCCESS":
			return {
				...state,
				loading: false,
				token: action.payload.token,
				user: action.payload.user,
				isAuthenticated: true,
				error: undefined,
			};
		case "AUTH_FAILURE":
			return {
				user: null,
				token: null,
				loading: false,
				isAuthenticated: false,
				error: action.payload,
			};
		case "LOGOUT":
			return initialState;
		case "SET_USER":
			return {
				...state,
				user: action.payload,
			};
		default:
			return state;
	}
}

const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	const login = useCallback(async (data) => {
		try {
			dispatch({ type: "AUTH_START" });
			const response = await loginApi(data);
			console.log(response);

			dispatch({
				type: "AUTH_SUCCESS",
				payload: { user: response.user, token: response.token },
			});
		} catch (error) {
			dispatch({ type: "AUTH_FAILURE", payload: error });
		}
	}, []);

	const logout = useCallback(async () => {
		try {
			await logoutApi();
			dispatch({ type: "LOGOUT" });
		} catch (error) {
			console.log(error);
		}
	}, []);

	//here i should check the token validity
	useEffect(() => {
		const checkToken = async () => {
			try {
				const user = await getUserInfo();
				dispatch({ type: "SET_USER", payload: user });
			} catch (error) {
				dispatch({ type: "AUTH_FAILURE", payload: error });
			}
		};
		checkToken();
	}, []);

	// Request interceptor
	useLayoutEffect(() => {
		const authInterceptor = apiClient.interceptors.request.use(
			(config) => {
				const isPublicEndpoint = publicEndpoints.some((endpoint) =>
					config.url.includes(endpoint)
				);

				if (!isPublicEndpoint) {
					const token = state.token;

					config.headers.Authorization =
						!config._retry && token
							? `Bearer ${token}`
							: config.headers.Authorization;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);
		return () => {
			apiClient.interceptors.request.eject(authInterceptor);
		};
	}, [state.token]);
	
	// Response interceptor
	useLayoutEffect(() => {
		const refreshInterceptor = apiClient.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;
				if (
					error.response.status === 403 &&
					error.response.data.message === "Not authorized"
				) {
					try {
						const response = await postRefresh();
						dispatch({
							type: "AUTH_SUCCESS",
							payload: { token: response.accessToken, user: response.user },
						});
						originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
						originalRequest._retry = true;
						return apiClient(originalRequest);
					} catch {
						dispatch({ type: "AUTH_FAILURE" });
					}
				}

				return Promise.reject(error);
			}
		);
		return () => {
			apiClient.interceptors.response.eject(refreshInterceptor);
		};
	}, []);

	return (
		<AuthContext.Provider value={{ ...state, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
