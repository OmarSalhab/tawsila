import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DriverHomePage from "../containers/DriverHomePage";
import DriverSignupPage from "../containers/DriverSignupPage";
import DriverSignupSuccessPage from "../containers/DriverSignupSuccessPage";
import DriverRidePage from "../containers/DriverRidePage";
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
import SocketProvider from "../hooks/contexts/SocketProvider";
import RideProvider from "../hooks/contexts/RideProvider";
const RouteComponents = () => {
	return (
		<BrowserRouter>
			<ToastProvider>
				<AuthProvider>
					<SocketProvider>
						<RideProvider>
							<AppRoutes />
						</RideProvider>
					</SocketProvider>
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
			<Route path="/home" element={<Navigate to={"/"} replace />} />
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
				path="/ride-room-driver"
				element={
					token ? (
						isAuthrized() === "driver" ? (
							<DriverRidePage />
						) : (
							<Navigate to="/" />
						)
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
			<Route
				path="/ride-room-passenger/:tripId"
				element={
					token ? (
						isAuthrized() === "passenger" ? (
							<PassengerRidePage />
						) : (
							<Navigate to="/" />
						)
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
};

export default RouteComponents;
