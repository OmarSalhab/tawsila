export default function MessageSkeleton({ count = 7 }) {
  // Example: [true, true, false, true, false] means 3 from user, 2 from other
  // You can randomize or set a pattern as needed
  const pattern = [true, true, false, true, false];
  return (
    <div className="space-y-4 px-2 py-4">
      {Array.from({ length: count }).map((_, i) => {
        const isUser = pattern[i % pattern.length];
        return (
          <div
            key={i}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div className="flex flex-col items-end max-w-xs w-full">
              <div
                className={`rounded-lg shadow-sm p-3 mb-1 animate-pulse ${
                  isUser
                    ? "bg-primary/20 self-end"
                    : "bg-gray-200 self-start"
                }`}
              >
                <div
                  className={`h-4 ${
                    isUser ? "w-28" : "w-36"
                  } bg-gray-300 rounded mb-2`}
                />
                <div
                  className={`h-3 ${
                    isUser ? "w-16" : "w-24"
                  } bg-gray-200 rounded`}
                />
              </div>
              <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        );
      })}
    </div>
  );
}