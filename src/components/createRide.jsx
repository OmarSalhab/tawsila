import { Car, X, Calendar, Clock } from "lucide-react";
import { useState } from "react";

export default function CreateRide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg w-[90vw] max-w-xs text-base"
        onClick={() => setOpen(true)}
      >
        <Car className="w-5 h-5 mr-2" />
        Create New Ride
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-2 p-6 fixed bottom-0">
            <button
              className="absolute top-4 right-4 text-gray-500 "
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-center mb-6">Create New Ride</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black-900 mb-1">Date</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="pl-4 pr-10 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black-900 mb-1">Time</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="--:--  --"
                    className="pl-4 pr-10 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black-900 mb-1">Price (JD)</label>
                <input
                  type="text"
                  placeholder="e.g. 3.50"
                  className="pl-4 pr-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black-900 mb-1">Available Seats</label>
                <input
                  type="text"
                  placeholder="4"
                  className="pl-4 pr-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black-900 mb-1">Description</label>
                <textarea
                  placeholder="Add details about your ride..."
                  className="pl-4 pr-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0.7 focus:ring-primary focus:border-primary text-gray-700 bg-white min-h-[80px] resize-none"
                />
              </div>
              <div className="flex flex-col gap-2 mt-6">
                <button
                  type="button"
                  className="w-full bg-secondary border border-gray-400 text-black font-semibold py-2 rounded-md mb-2"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="w-full bg-primary text-white font-semibold py-2 rounded-md"
                  onClick={() => {}}
                >
                  Create Ride
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 