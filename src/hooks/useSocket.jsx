import { createContext, useContext } from "react";
export const Context = createContext(null);

const useSocket = () => {
	const context = useContext(Context);
    if (!context) throw new Error("useSocket must be used within an socketProvider");
	return context;
};

export default useSocket;
