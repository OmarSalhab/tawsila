import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DriverHomePage from "../containers/DriverHomePage";
import DriverSignupPage from "../containers/DriverSignupPage";
import DriverSignupSuccessPage from "../containers/DriverSignupSuccessPage";
import PassengerHomePage from "../containers/PassengerHomePage";
import PassengerRidePage from "../containers/PassengerRidePage";
import PassengerSignupPage from "../containers/PassengerSignupPage";
import SharedGlobalChat from "../containers/SharedGlobalChat";
import SharedLoginPage from "../containers/SharedLoginPage";
import SharedRolePage from "../containers/SharedRolePage";
import NotFoundPage from "../containers/NotFoundPage";
import { ToastProvider } from "../hooks/contexts/ToastProvider";
import AuthProvider from "../hooks/contexts/AuthProvider";
import useAuth from "../hooks/useAuth";
import LoadingSkeleton from "../components/loadingSkeleton";

const RouteComponents = () => {
	return (
		<BrowserRouter>
			<ToastProvider>
				<AuthProvider>
					<AppRoutes />
				</AuthProvider>
			</ToastProvider>
		</BrowserRouter>
	);
};

const AppRoutes = () => {
	const { token, isAuthrized } = useAuth();
	if (token === undefined) return <LoadingSkeleton />;

	return (
		<Routes>
			<Route
				path="/"
				element={
					token ? (
						isAuthrized() === "passenger" ? (
							<PassengerHomePage />
						) : (
							<DriverHomePage />
						)
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
			<Route path="/login" element={<SharedLoginPage />} />
			<Route
				path="/role"
				element={token ? <Navigate to={"/"} replace /> : <SharedRolePage />}
			/>
			<Route
				path="/signup-driver"
				element={token ? <Navigate to={"/"} replace /> : <DriverSignupPage />}
			/>
			<Route
				path="/signup-success"
				element={
					token ? <Navigate to={"/"} replace /> : <DriverSignupSuccessPage />
				}
			/>
			<Route
				path="/signup-passenger"
				element={
					token ? <Navigate to={"/"} replace /> : <PassengerSignupPage />
				}
			/>
			<Route
				path="/home-driver"
				element={
					token ? (
						isAuthrized() === "driver" ? (
							<DriverHomePage />
						) : (
							<Navigate to="/" replace />
						)
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
			<Route
				path="/home-passenger"
				element={
					token ? (
						isAuthrized() === "passenger" ? (
							<PassengerHomePage />
						) : (
							<Navigate to="/" replace />
						)
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
			<Route
				path="/route-chat-room"
				element={
					token ? <SharedGlobalChat /> : <Navigate to="/login" replace />
				}
			/>
			<Route
				path="/ride-room-passenger"
				element={
					token ? <PassengerRidePage /> : <Navigate to="/login" replace />
				}
			/>
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
};

export default RouteComponents;
