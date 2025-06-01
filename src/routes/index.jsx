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
import useAuth from "../hooks/contexts/useAuth";
import LoadingSkeleton from "../components/loadingSkeleton";

const RouteComponents = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<ToastProvider>
					<AppRoutes />
				</ToastProvider>
			</AuthProvider>
		</BrowserRouter>
	);
};

const AppRoutes = () => {
	const { token } = useAuth();
	if (token === undefined) return <LoadingSkeleton />;
	return (
		<Routes>
			<Route
				path="/"
				element={
					token ? <PassengerHomePage /> : <Navigate to="/login" replace />
				}
			/>
			<Route path="/login" element={<SharedLoginPage />} />
			<Route path="/role" element={<SharedRolePage />} />
			<Route path="/signup-driver" element={<DriverSignupPage />} />
			<Route path="/signup-success" element={<DriverSignupSuccessPage />} />
			<Route path="/signup-passenger" element={<PassengerSignupPage />} />
			<Route
				path="/home-driver"
				element={token ? <DriverHomePage /> : <Navigate to="/login" replace />}
			/>
			<Route
				path="/home-passenger"
				element={
					token ? <PassengerHomePage /> : <Navigate to="/login" replace />
				}
			/>
			<Route path="/route-chat-room" element={<SharedGlobalChat />} />
			<Route path="/ride-room-passenger" element={<PassengerRidePage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
};

export default RouteComponents;
