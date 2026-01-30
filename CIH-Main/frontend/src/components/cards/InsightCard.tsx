import React from 'react';

interface InsightCardProps {
	title?: string;
	description?: string;
	action?: string;
	onAction?: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({
	title = "AI Insight",
	description = "Based on historical data and current trends, we recommend scheduling maintenance within the next 7 days to prevent potential failure.",
	action = "View Recommendation",
	onAction = () => console.log('Action clicked')
}) => {
		<div className="bg-linear-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30 backdrop-blur-sm">
			<div className="flex items-start gap-4">
				{/* Icon */}
				<div className="bg-blue-500/20 p-3 rounded-lg shrink-0">
					<svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>

				{/* Content */}
				<div className="flex-1">
					<h3 className="text-lg font-bold text-white mb-2">{title}</h3>
					<p className="text-gray-300 text-sm leading-relaxed mb-4">
						{description}
					</p>
					<button
						onClick={onAction}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-blue-500/25"
					>
						{action}
					</button>
				</div>

				{/* Badge */}
				<div className="shrink-0">
					<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
						<div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
						<span className="text-xs font-medium text-blue-400">AI</span>
					</span>
				</div>
			</div>
		</div>
};

export default InsightCard;
