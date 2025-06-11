import { createContext, useContext } from "react";

export const RideContext = createContext(null);

const useRide = () => {
	const context = useContext(RideContext);
	if (!context)
		throw `the useRide hook needs to be called inside of a RideProvider.`;
	return context;
};

export default useRide;
