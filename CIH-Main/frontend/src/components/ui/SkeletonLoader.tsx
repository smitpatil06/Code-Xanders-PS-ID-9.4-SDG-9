import React from 'react';

interface SkeletonLoaderProps {
	width?: string;
	height?: string;
	className?: string;
	count?: number;
	circle?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
	width = 'w-full',
	height = 'h-4',
	className = '',
	count = 1,
	circle = false,
}) => {
	const baseClasses = `${width} ${height} bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse ${
		circle ? 'rounded-full' : 'rounded-lg'
	} ${className}`;

	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className={`${baseClasses} mb-3`}></div>
			))}
		</>
	);
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
	<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${count} gap-4 lg:gap-6`}>
		{Array.from({ length: count }).map((_, i) => (
			<div key={i} className="bg-gray-900 rounded-xl p-6 border border-gray-800 animate-pulse">
				<SkeletonLoader width="w-24" height="h-4" className="mb-4" />
				<SkeletonLoader width="w-full" height="h-10" className="mb-2" />
				<SkeletonLoader width="w-3/4" height="h-4" />
			</div>
		))}
	</div>
);

export const TableSkeleton: React.FC = () => (
	<div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden animate-pulse">
		<div className="px-6 py-4 border-b border-gray-800">
			<SkeletonLoader width="w-32" height="h-6" className="mb-2" />
			<SkeletonLoader width="w-48" height="h-4" />
		</div>
		<div className="p-6 space-y-4">
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={i} className="flex gap-4">
					<SkeletonLoader width="w-16" height="h-4" />
					<SkeletonLoader width="w-24" height="h-4" />
					<SkeletonLoader width="w-32" height="h-4" />
					<SkeletonLoader width="w-20" height="h-4" />
				</div>
			))}
		</div>
	</div>
);

export const ChartSkeleton: React.FC = () => (
	<div className="bg-gray-900 rounded-xl p-6 border border-gray-800 animate-pulse">
		<SkeletonLoader width="w-32" height="h-5" className="mb-4" />
		<div className="h-64 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg"></div>
	</div>
);
