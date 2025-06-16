const LoadingSkeleton = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Skeleton */}
			<div className="w-full bg-primary py-4 flex items-center justify-between px-4">
				<div className="w-6 h-6 bg-white/20 rounded-full animate-pulse" />
				<div className="w-32 h-6 bg-white/20 rounded animate-pulse" />
				<div className="w-6 h-6 bg-white/20 rounded-full animate-pulse" />
			</div>
		</div>
	);
};

export default LoadingSkeleton;
