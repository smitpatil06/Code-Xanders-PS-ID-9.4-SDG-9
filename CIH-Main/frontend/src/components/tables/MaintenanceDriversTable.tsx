import React from 'react';

const MaintenanceDriversTable: React.FC = () => {
	const maintenanceData = [
		{
			id: 1,
			assetId: 'HYD-001',
			assetName: 'Hydraulic System A',
			department: 'Assembly',
			lastService: '2024-01-15',
			nextDue: '2024-03-15',
			hoursRemaining: 450,
			status: 'healthy',
		},
		{
			id: 2,
			assetId: 'CNC-002',
			assetName: 'CNC Machine 2',
			department: 'Machining',
			lastService: '2024-01-08',
			nextDue: '2024-02-20',
			hoursRemaining: 120,
			status: 'warning',
		},
		{
			id: 3,
			assetId: 'PTS-003',
			assetName: 'Pneumatic System 3',
			department: 'Packaging',
			lastService: '2023-12-28',
			nextDue: '2024-02-10',
			hoursRemaining: 60,
			status: 'critical',
		},
		{
			id: 4,
			assetId: 'MOT-004',
			assetName: 'Motor Assembly 4',
			department: 'Assembly',
			lastService: '2024-01-12',
			nextDue: '2024-03-20',
			hoursRemaining: 620,
			status: 'healthy',
		},
		{
			id: 5,
			assetId: 'PMP-005',
			assetName: 'Pump System 5',
			department: 'Fluid Transfer',
			lastService: '2024-01-05',
			nextDue: '2024-02-15',
			hoursRemaining: 180,
			status: 'warning',
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'healthy':
				return 'bg-green-500/20 text-green-400 border-green-500/30';
			case 'warning':
				return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
			case 'critical':
				return 'bg-red-500/20 text-red-400 border-red-500/30';
			default:
				return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
		}
	};

	const getStatusDot = (status: string) => {
		switch (status) {
			case 'healthy':
				return 'bg-green-500';
			case 'warning':
				return 'bg-yellow-500';
			case 'critical':
				return 'bg-red-500';
			default:
				return 'bg-gray-500';
		}
	};

	return (
		<div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-800">
				<h2 className="text-xl lg:text-2xl font-bold text-white">Top Maintenance Drivers</h2>
				<p className="text-gray-400 text-sm mt-1">Assets requiring attention sorted by priority</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-800/50 border-b border-gray-700">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Asset ID</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Asset Name</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Department</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Last Service</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Next Due</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Hours Left</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-800">
						{maintenanceData.map((item) => (
							<tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">{item.assetId}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{item.assetName}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{item.department}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{item.lastService}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{item.nextDue}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{item.hoursRemaining}h</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center gap-2">
										<div className={`w-2 h-2 rounded-full ${getStatusDot(item.status)}`}></div>
										<span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
											{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
										</span>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default MaintenanceDriversTable;
