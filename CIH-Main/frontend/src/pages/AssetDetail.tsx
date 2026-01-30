import React, { useState } from 'react';
import InsightCard from '../components/cards/InsightCard';
import SubComponentHealthTable from '../components/tables/SubComponentHealthTable';

const AssetDetail: React.FC = () => {
	const [timeRange, setTimeRange] = useState<'1H' | '6H' | '24H'>('6H');

	const assetData = {
		id: 'Turbine-04',
		assetId: '99283475',
		location: 'Factory Floor B',
		lastServiced: 'Oct 12, 2023',
		failureProbability: 28,
		probabilityChange: -5,
		estimatedDaysToFailure: 14,
		daysChange: -2,
		confidence: 92,
		operationalCycles: 240
	};

	return (
		<div className="min-h-screen bg-gray-950 text-white">
			{/* Breadcrumb */}
			<div className="px-6 lg:px-8 pt-6 pb-4">
				<div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
					<span className="hover:text-white cursor-pointer">Assets</span>
					<span>/</span>
					<span className="hover:text-white cursor-pointer">Factory Floor B</span>
					<span>/</span>
					<span className="text-white">{assetData.id}</span>
				</div>

				{/* Header */}
				<div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-2">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<h1 className="text-3xl lg:text-4xl font-bold">{assetData.id}</h1>
							<span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30">
								<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								Warning
							</span>
						</div>
						<p className="text-gray-400 text-sm lg:text-base">
							Asset ID: {assetData.assetId} • Location: {assetData.location} • Last Serviced: {assetData.lastServiced}
						</p>
					</div>

					<div className="flex gap-3">
						<button className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-750 transition-colors font-medium flex items-center gap-2 text-sm">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Download Manual
						</button>
						<button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 text-sm">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							Maintenance Mode
						</button>
					</div>
				</div>
			</div>

			<div className="px-6 lg:px-8 pb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
					{/* Predicted Failure Probability */}
					<div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
						<div className="flex items-start justify-between mb-4">
							<div className="text-gray-400 text-sm font-medium">PREDICTED FAILURE PROB</div>
							<div className="bg-blue-500/20 p-2 rounded-lg">
								<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>
						</div>
						<div className="flex items-end gap-2 mb-3">
							<div className="text-4xl lg:text-5xl font-bold">{assetData.failureProbability}%</div>
							<div className="text-red-400 text-sm font-medium mb-2 flex items-center gap-1">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
								</svg>
								{assetData.probabilityChange}%
							</div>
						</div>
						<div className="text-gray-400 text-sm">
							Based on last {assetData.operationalCycles} operational cycles
						</div>
					</div>

					{/* Estimated Time to Failure */}
					<div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
						<div className="flex items-start justify-between mb-4">
							<div className="text-gray-400 text-sm font-medium">ESTIMATED TIME TO FAILURE</div>
							<div className="bg-red-500/20 p-2 rounded-lg">
								<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
						<div className="flex items-end gap-2 mb-3">
							<div className="text-4xl lg:text-5xl font-bold">{assetData.estimatedDaysToFailure}</div>
							<div className="text-xl lg:text-2xl font-semibold text-gray-400 mb-2">days</div>
							<div className="text-red-400 text-sm font-medium mb-2 flex items-center gap-1">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
								</svg>
								{assetData.daysChange}d
							</div>
						</div>
						<div className="w-full bg-gray-800 rounded-full h-2 mb-2">
							<div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
						</div>
						<div className="text-gray-400 text-sm">
							High confidence prediction ({assetData.confidence}%)
						</div>
					</div>

					{/* AI Insights */}
					<InsightCard />
				</div>

				{/* Real-time Sensor Monitoring */}
				<div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
						<h2 className="text-xl font-bold">Real-time Sensor Monitoring</h2>
						<div className="flex items-center gap-2">
							<button
								onClick={() => setTimeRange('1H')}
								className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
									timeRange === '1H' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
								}`}
							>
								1H
							</button>
							<button
								onClick={() => setTimeRange('6H')}
								className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
									timeRange === '6H' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
								}`}
							>
								6H
							</button>
							<button
								onClick={() => setTimeRange('24H')}
								className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
									timeRange === '24H' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
								}`}
							>
								24H
							</button>
						</div>
					</div>

					{/* Temperature Chart */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-4">
							<div className="text-gray-400 text-sm font-medium">TEMPERATURE (°C)</div>
							<div className="text-green-400 text-sm font-medium">72.4°C • Nominal</div>
						</div>
						<div className="h-32 relative">
							<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 100">
								<path
									d="M 0,50 Q 200,45 400,48 T 800,52"
									fill="none"
									stroke="rgb(59, 130, 246)"
									strokeWidth="2"
									vectorEffect="non-scaling-stroke"
								/>
								<path
									d="M 0,50 Q 200,45 400,48 T 800,52 L 800,100 L 0,100 Z"
									fill="url(#tempGradient)"
									opacity="0.2"
								/>
								<defs>
									<linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
										<stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
										<stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
									</linearGradient>
								</defs>
							</svg>
						</div>
					</div>

					{/* Vibration Chart */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-4">
							<div className="text-gray-400 text-sm font-medium">VIBRATION (RMS)</div>
							<div className="text-red-400 text-sm font-medium flex items-center gap-1">
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
								4.8 mm/s • High
							</div>
						</div>
						<div className="h-32 relative">
							<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 100">
								<path
									d="M 0,60 L 100,58 L 200,62 L 300,55 L 400,65 L 500,68 L 600,70 L 700,72 L 800,70"
									fill="none"
									stroke="rgb(239, 68, 68)"
									strokeWidth="2"
									vectorEffect="non-scaling-stroke"
								/>
								<path
									d="M 0,60 L 100,58 L 200,62 L 300,55 L 400,65 L 500,68 L 600,70 L 700,72 L 800,70 L 800,100 L 0,100 Z"
									fill="url(#vibGradient)"
									opacity="0.2"
								/>
								<defs>
									<linearGradient id="vibGradient" x1="0%" y1="0%" x2="0%" y2="100%">
										<stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.5" />
										<stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0" />
									</linearGradient>
								</defs>
							</svg>
						</div>
					</div>

					{/* Oil Pressure Chart */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<div className="text-gray-400 text-sm font-medium">OIL PRESSURE (PSI)</div>
							<div className="text-gray-400 text-sm font-medium">42.1 PSI • Stable</div>
						</div>
						<div className="h-32 relative bg-linear-to-b from-gray-800/30 to-transparent rounded-lg"></div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Sub-component Health */}
					<div className="lg:col-span-2">
						<SubComponentHealthTable />
					</div>

					{/* Unit Specifications */}
					<div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
						<h2 className="text-xl font-bold mb-6">Unit Specifications</h2>
            
						<div className="space-y-4">
							<div>
								<div className="text-gray-400 text-sm mb-1">Model Number</div>
								<div className="text-white font-medium">TX-400 v2</div>
							</div>

							<div>
								<div className="text-gray-400 text-sm mb-1">Serial No.</div>
								<div className="text-white font-medium">SN-99283475-B</div>
							</div>

							<div>
								<div className="text-gray-400 text-sm mb-1">Installation Date</div>
								<div className="text-white font-medium">Jan 22, 2021</div>
							</div>

							<div>
								<div className="text-gray-400 text-sm mb-1">Service Group</div>
								<div className="text-white font-medium">H.V. Mechanical</div>
							</div>

							<div className="mt-6 pt-6 border-t border-gray-800">
								<div className="bg-gray-800/50 rounded-lg p-4 text-center">
									<div className="text-gray-400 text-xs uppercase tracking-wider mb-2">
										Location Mapping
									</div>
									<div className="text-white font-bold text-lg">
										Zone B-4, Floor 2
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="px-6 lg:px-8 py-4 border-t border-gray-800">
				<div className="text-center text-gray-500 text-sm">
					System Health: All monitoring agents active • Last Data Refresh: 10s ago
				</div>
			</div>
		</div>
	);
};

export default AssetDetail;
