const LoadingSkeleton = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="w-full bg-primary py-4 flex items-center justify-between px-4">
          <div className="w-6 h-6 bg-white/20 rounded-full animate-pulse" />
          <div className="w-32 h-6 bg-white/20 rounded animate-pulse" />
          <div className="w-6 h-6 bg-white/20 rounded-full animate-pulse" />
        </div>
  
        {/* Content Skeleton */}
        <div className="p-4 space-y-4">
          {/* Card Skeletons */}
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg shadow-md p-4 flex flex-col mb-2"
            >
              {/* Orange bar */}
              <span className="absolute left-0 top-0 h-full w-1.5 rounded-l-lg bg-gray-200 animate-pulse-slow" />
              
              {/* Driver Info Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
  
              {/* Route Info */}
              <div className="flex flex-row items-center mb-3">
                <div className="flex flex-col items-left w-4/5 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="w-0.5 h-6 bg-gray-200 ml-1.5 animate-pulse" />
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-1/5">
                  <div className="w-12 h-3 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="w-16 h-5 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
  
              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default LoadingSkeleton;