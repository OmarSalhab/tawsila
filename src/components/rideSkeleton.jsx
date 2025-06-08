const RideSkeleton = () => {
	return (
		<div className="space-y-4">
			{[1, 2, 3].map((index) => (
				<div key={index} className="bg-white p-4 rounded-lg shadow-sm mt-8">
					<div className="flex items-center space-x-4">
						{/* Driver info skeleton */}
						<Skeleton className="h-12 w-12 rounded-full" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>

					{/* Route info skeleton */}
					<div className="mt-4 space-y-2">
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-[100px]" />
							<Skeleton className="h-4 w-[100px]" />
						</div>
						<Skeleton className="h-4 w-full" />
					</div>

					{/* Price and seats skeleton */}
					<div className="mt-4 flex items-center justify-between">
						<Skeleton className="h-4 w-[80px]" />
						<Skeleton className="h-4 w-[120px]" />
					</div>
				</div>
			))}
		</div>
	);
};
export function Skeleton({ className, ...props }) {
    return (
      <div
        className={`animate-pulse rounded-md bg-gray-200 ${className}`}
        {...props}
      />
    );
  }
export default RideSkeleton;
