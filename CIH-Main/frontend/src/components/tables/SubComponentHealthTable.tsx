import React from 'react';
import StatusPill from '../ui/StatusPill';

interface SubComponent {
	id: number;
	name: string;
	type: string;
	status: 'healthy' | 'warning' | 'critical';
	health: number;
	temperature: number;
	lastChecked: string;
}

const SubComponentHealthTable: React.FC = () => {
	const subComponents: SubComponent[] = [
		{
			id: 1,
			name: 'Bearing Assembly',
			type: 'Mechanical',
			status: 'healthy',
			health: 94,
			temperature: 45,
			lastChecked: '2 min ago',
		},
		{
			id: 2,
			name: 'Seal Ring',
			type: 'Mechanical',
			status: 'healthy',
			health: 88,
			temperature: 52,
			lastChecked: '5 min ago',
		},
		{
			id: 3,
			name: 'Rotor Blade',
			type: 'Mechanical',
			status: 'warning',
			health: 72,
			temperature: 78,
			lastChecked: '1 min ago',
		},
		{
			id: 4,
			name: 'Lubrication System',
			type: 'Hydraulic',
			status: 'warning',
			health: 65,
			temperature: 68,
			lastChecked: '3 min ago',
		},
		{
			id: 5,
			name: 'Vibration Damper',
			type: 'Mechanical',
			status: 'healthy',
			health: 91,
			temperature: 41,
			lastChecked: '4 min ago',
		},
	];

	const getHealthColor = (health: number) => {
		if (health >= 85) return 'text-green-400';
		if (health >= 70) return 'text-yellow-400';
		return 'text-red-400';
	};

	const getTemperatureColor = (temp: number) => {
		if (temp < 50) return 'text-blue-400';
		if (temp < 70) return 'text-yellow-400';
		return 'text-red-400';
	};

	return (
		<div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-800">
				<h3 className="text-xl lg:text-2xl font-bold text-white">Sub-Component Health Monitor</h3>
				<p className="text-gray-400 text-sm mt-1">Real-time monitoring of all sub-components</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-800/50 border-b border-gray-700">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Component Name</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Type</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Health Score</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Temperature</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Last Checked</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-800">
						{subComponents.map((component) => (
							<tr key={component.id} className="hover:bg-gray-800/50 transition-colors">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{component.name}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{component.type}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center gap-2">
										<div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
											<div
												className="h-full bg-linear-to-r from-blue-500 to-green-500"
												style={{ width: `${component.health}%` }}
											></div>
										</div>
										<span className={`text-sm font-semibold ${getHealthColor(component.health)}`}>
											{component.health}%
										</span>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span className={`text-sm font-semibold ${getTemperatureColor(component.temperature)}`}>
										{component.temperature}°C
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{component.lastChecked}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<StatusPill status={component.status} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default SubComponentHealthTable;
