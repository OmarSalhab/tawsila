import { useState } from "react";
import { User, MessageCircle } from "lucide-react";
import DriverAllRides from "../../components/driverAllRides";
import DriverMyRides from "../../components/driverMyRides";
import CreateRide from "../../components/createRide";
import { useNavigate } from "react-router-dom";
import Profile from "../../components/profile";

const staticRides = [
  {
    id: 1,
    driverName: "Ahmad",
    driverGender: "male",
    driverRating: 4.8,
    origin: "Amman",
    destination: "Zarqa",
    route: "Amman-Zarqa",
    departureTime: "15:30",
    date: "Today",
    price: "3.50 JD",
    availableSeats: 2,
    passengersCount: 2,
    maxPassengers: 4,
    description: "Regular commute ride from Amman to Zarqa.",
    status: "Active",
  },
  {
    id: 2,
    driverName: "Fatima",
    driverGender: "female",
    driverRating: 4.9,
    origin: "Irbid",
    destination: "Amman",
    route: "Irbid-Amman",
    departureTime: "08:00",
    date: "Today",
    price: "8.00 JD",
    availableSeats: 1,
    passengersCount: 3,
    maxPassengers: 4,
    description: "Morning ride from Irbid to Amman.",
    status: "Active",
  },
  {
    id: 3,
    driverName: "Omar",
    driverGender: "male",
    driverRating: 4.7,
    origin: "Salt",
    destination: "Amman",
    route: "Salt-Amman",
    departureTime: "17:00",
    date: "Today",
    price: "2.50 JD",
    availableSeats: 2,
    passengersCount: 2,
    maxPassengers: 4,
    description: "Evening ride from Salt to Amman.",
    status: "Active",
  },
];

export default function DriverHome() {
  const [tab, setTab] = useState("myRides");
  const [rides] = useState(staticRides);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const myRides = [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="w-full bg-primary py-4 flex items-center justify-between px-4">
        <User className="text-white w-6 h-6 z-10" onClick={() => setShowProfile(true)}/>
        <h1 className="text-white text-xl font-bold text-center flex-1 -ml-6">Available Rides</h1>
        <MessageCircle className="text-white w-6 h-6 z-10" onClick={()=> navigate("/route-chat-room")}/>
      </div>
      {/* Tabs */}
      <div className="flex w-full max-w-md mx-auto mt-4 rounded-lg overflow-hidden bg-gray-100">
        <button
          className={`flex-1 py-2 text-center font-semibold text-base transition-colors ${tab === "myRides" ? "bg-white text-black shadow" : "text-gray-400"}`}
          onClick={() => setTab("myRides")}
        >
          My Rides
        </button>
        <button
          className={`flex-1 py-2 text-center font-semibold text-base transition-colors ${tab === "allRides" ? "bg-white text-black shadow" : "text-gray-400"}`}
          onClick={() => setTab("allRides")}
        >
          All Rides
        </button>
      </div>
      <div className="px-3">
        {tab === "myRides" ? <DriverMyRides rides={myRides} /> : <DriverAllRides rides={rides} />}
      </div>
      <CreateRide onClick={handleCreateRide} />
      <Profile open={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}

// Placeholder event handler
function handleCreateRide() {
  // Logic for creating a new ride (to be implemented)
} 