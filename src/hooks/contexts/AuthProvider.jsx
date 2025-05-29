import { useReducer, useCallback, useEffect, useLayoutEffect } from "react";
import {
	login as loginApi,
	getUserInfo,
	postRefresh,
} from "../../services/authApi";
import { AuthContext } from "./useAuth";
import { jwtDecode } from "jwt-decode";
const initialState = {
	user: null,
	token: null,
	isAuthenticated: false,
	loading: false,
	error: undefined,
};

function authReducer(state, action) {
	switch (action.type) {
		case "LOGIN_START":
			return { ...state, loading: true, error: undefined };
		case "LOGIN_SUCCESS":
			return {
				...state,
				loading: false,
				token: action.payload.token,
				user: action.payload.user,
				isAuthenticated: true,
				error: undefined,
			};
		case "LOGIN_FAILURE":
			return {
				...state,
				loading: false,
				isAuthenticated: false,
				error: action.payload,
			};
		case "LOGOUT":
			return initialState;

		case "SET_CRED":
			return {
				...state,
				user: action.payload.user,
			};
		case "SET_Auth":
			return {
				...state,
				isAuthenticated: true,
			};
		default:
			return state;
	}
}


const isTokenExpired = (token) => {
	if (!token) return true;
	try {
		const { exp } = jwtDecode(token);
		return Date.now() >= exp * 1000;
	} catch {
		return true;
	}
};

const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	const login = useCallback(async (data) => {
		try {
			dispatch({ type: "LOGIN_START" });
			const response = await loginApi(data);
			console.log(response);

			dispatch({
				type: "LOGIN_SUCCESS",
				payload: { user: response.user, token: response.token },
			});
		} catch (error) {
			dispatch({ type: "LOGIN_FAILURE", payload: error });
		}
	}, []);

	const logout = useCallback(() => {
		dispatch({ type: "LOGOUT" });
	}, []);
	//here i should check the token validite
	useEffect(() => {
		const checkToken = async () => {
			if (!state.token || isTokenExpired(state.token)) {
				// Try to refresh
				try {
					const response = await postRefresh();
					console.log(response);
					
					dispatch({
						type: "LOGIN_SUCCESS",
						payload: { user: response.user, token: response.accessToken },
					});
				} catch(error) {
					console.log(error);
					
					logout();
				}
			} else {
				// Token is valid, get user info
				dispatch({ type: "SET_Auth" });
				const user = await getUserInfo();
				dispatch({ type: "SET_USER", payload: user });
			}
		};
		setTimeout(() => {
			 checkToken();
		}, 15000);
	}, [logout,state.token]);

	// useEffect(() => {
	// 	const getUser = async () => {
	// 		const response = await getUserInfo();
	// 		if (!response) throw new Error("users state didnt set");
	// 		dispatch({ type: "SET_USER", payload: response });
	// 	};
	// 	getUser();
	// }, []);

	return (
		<AuthContext.Provider value={{ ...state, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
