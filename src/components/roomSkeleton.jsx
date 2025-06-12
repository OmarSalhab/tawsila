import { Skeleton } from "./rideSkeleton";

const RoomSkeleton = () => (
  <div className="h-screen bg-gray-50">
    {/* Header */}
    <div className="w-full bg-primary py-4 flex items-center px-4">
      <Skeleton className="w-6 h-6 rounded-full mr-2" />
      <div className="flex flex-col flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-4 w-16 ml-4" />
    </div>

    {/* Tabs */}
    <div className="flex bg-gray-100 border-b border-gray-200">
      <Skeleton className="flex-1 h-8 mx-2" />
      <Skeleton className="flex-1 h-8 mx-2" />
    </div>

    {/* Ride Details */}
    <div className="bg-white rounded-lg shadow-md p-4 mt-4 mx-3">
      <Skeleton className="h-5 w-32 mb-3" />
      <div className="flex items-center mb-2">
        <Skeleton className="w-10 h-10 rounded-full mr-3" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex items-center mb-2 space-x-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-4" />
        <Skeleton className="h-3 w-16" />
      </div>
      <hr className="my-2" />
      <div className="flex flex-wrap gap-4 mb-2">
        <div>
          <Skeleton className="h-3 w-10 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div>
          <Skeleton className="h-3 w-10 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div>
          <Skeleton className="h-3 w-10 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div>
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
      <div>
        <Skeleton className="h-3 w-20 mb-1" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>

    {/* Seat Selection */}
    <div className="bg-white rounded-lg shadow-md p-4 mt-14 mx-3">
      <Skeleton className="h-5 w-32 mb-3" />
      <div className="flex flex-col items-center">
        <div className="bg-white border border-gray-200 rounded-lg p-4 w-full max-w-xs flex flex-col items-center relative">
          <div className="relative w-full h-32 mb-4">
            <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
            <div className="absolute top-[47%] left-[19%] right-[19%] flex justify-between px-2">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-8 w-16 rounded" />
            </div>
            <div className="absolute bottom-[26%] left-[27%] right-[27%] flex justify-center px-1 gap-1">
              <Skeleton className="h-8 w-10 rounded" />
              <Skeleton className="h-8 w-10 rounded" />
              <Skeleton className="h-8 w-10 rounded" />
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="w-4 h-4 rounded" />
        </div>
      </div>
      <Skeleton className="w-full h-10 mt-6 rounded-md" />
    </div>
  </div>
);

export default RoomSkeleton;