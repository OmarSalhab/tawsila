// RatingModal.jsx
import { useState } from "react";
import { X, Star } from "lucide-react";

export default function RatingModal({ open, onClose, users, onSubmit, role }) {
  // ratings: [{ id: userId, rating: star }, ...]
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleStarClick = (userId, star) => {
    setRatings((prev) => {
      const existing = prev.find((r) => r.id === userId);
      if (existing) {
        // Update rating
        return prev.map((r) =>
          r.id === userId ? { ...r, rating: star } : r
        );
      } else {
        // Add new rating
        return [...prev, { id: userId, rating: star }];
      }
    });
    setError("");
  };

  const handleRate = () => {
    // Validate all users have a rating
    const allRated =
      users.length === ratings.filter((r) => r.rating > 0).length &&
      users.every((u) => ratings.some((r) => r.id === u._id));
    if (!allRated) {
      setError("Please rate all users before submitting.");
      return;
    }
    onSubmit(ratings);
    setRatings([]);
    setError("");
    onClose();
  };

  const getUserRating = (userId) => {
    const found = ratings.find((r) => r.id === userId);
    return found ? found.rating : 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-2 p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-center mb-4">
          {role === "driver" ? "Rate Your Passengers" : "Rate Your Driver"}
        </h2>
        <div className="space-y-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-primary uppercase">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.gender}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => handleStarClick(user._id, star)}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        getUserRating(user._id) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {error && (
          <div className="text-red-500 text-center mt-4 text-sm">{error}</div>
        )}
        <button
          className="w-full bg-primary text-white font-semibold py-2 rounded-md mt-6 disabled:bg-secondary"
          onClick={handleRate}
        >
        {role === "driver" ? "Rate Passengers" : "Rate Driver"}
        </button>
      </div>
    </div>
  );
}