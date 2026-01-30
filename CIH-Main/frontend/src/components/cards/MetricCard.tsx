import React from 'react';

interface MetricCardProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	subtext: string;
	subtextColor: string;
	subtextIcon?: React.ReactNode;
	valueColor?: string;
	highlighted?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
	icon,
	label,
	value,
	subtext,
	subtextColor,
	subtextIcon,
	valueColor = 'text-white',
	highlighted = false
}) => {
	return (
		<div className={`rounded-xl p-6 backdrop-blur-sm border transition-all ${
			highlighted 
				? 'bg-gray-800/60 border-gray-700' 
				: 'bg-gray-900/40 border-gray-800'
		}`}>
			<div className="flex items-center gap-2 text-gray-400 mb-3">
				{icon}
				<span className="text-sm font-medium uppercase tracking-wider">{label}</span>
			</div>
      
			<div className={`text-4xl font-bold mb-2 ${valueColor}`}>
				{value}
			</div>
      
			<div className={`flex items-center gap-1.5 text-sm font-medium ${subtextColor}`}>
				{subtextIcon && <span>{subtextIcon}</span>}
				<span>{subtext}</span>
			</div>
		</div>
	);
};

export default MetricCard;
