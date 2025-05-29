import { useReducer, useCallback, useEffect } from "react";
import { login as loginApi } from "../../services/authApi";
import { AuthContext } from "./useAuth";

const initialState = {
	user: null,
	isAuthenticated: localStorage.getItem("token"),
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
			return {
				user: null,
				isAuthenticated: null,
				loading: false,
				error: undefined,
			};
		case "SET_USER":
			return {
				...state,
				user: action.payload,
			}
		default:
			return state;
	}
}

const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);


	useEffect(()=>{
		const getUser
		dispatch()
	},[state.user])
	const login = useCallback(async (data) => {
		try {
			dispatch({ type: "LOGIN_START" });
			const response = await loginApi(data);
			dispatch({
				type: "LOGIN_SUCCESS",
				payload: { user: response.user },
			});
			localStorage.setItem("token", response.token);
		} catch (error) {
			dispatch({ type: "LOGIN_FAILURE", payload: error });
		}
	}, []);

	const logout = useCallback(() => {
		dispatch({ type: "LOGOUT" });
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	}, []);

	return (
		<AuthContext.Provider value={{ ...state, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
