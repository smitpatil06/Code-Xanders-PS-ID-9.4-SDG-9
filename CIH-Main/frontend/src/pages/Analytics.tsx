import React from 'react';
import MaintenanceDriversTable from '../components/tables/MaintenanceDriversTable';

const Analytics: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-950 text-white p-6 lg:p-8">
			{/* Header */}
			<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-3xl lg:text-4xl font-bold mb-2">Maintenance Analytics & Insights</h1>
					<p className="text-gray-400 text-base lg:text-lg">
						Long-term performance trends and cost-saving projections across all factory floors.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button className="px-5 py-2.5 rounded-lg bg-gray-800 text-white hover:bg-gray-750 transition-colors font-medium flex items-center gap-2 border border-gray-700 text-sm">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						Last 6 Months
					</button>
					<button className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 text-sm">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						Export PDF
					</button>
				</div>
			</div>

			{/* Top Metrics Row */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
				{/* Estimated Savings */}
				<div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
					<div className="flex items-start justify-between mb-4">
						<div className="text-gray-400 text-sm font-medium">Estimated Savings This Month</div>
						<div className="bg-blue-500/20 p-2 rounded-lg">
							<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					</div>
					<div className="flex items-end gap-2 mb-2">
						<div className="text-4xl lg:text-5xl font-bold">$42,500</div>
						<div className="text-green-400 text-sm font-medium mb-2 flex items-center gap-1">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
							</svg>
							+12.5%
						</div>
					</div>
					<div className="text-gray-400 text-sm">
						v.s. $37,780 previous period
					</div>
				</div>

				{/* Avoided Downtime */}
				<div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
					<div className="flex items-start justify-between mb-4">
						<div className="text-gray-400 text-sm font-medium">Avoided Downtime</div>
						<div className="bg-yellow-500/20 p-2 rounded-lg">
							<svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					</div>
					<div className="flex items-end gap-3 mb-2">
						<div className="text-4xl lg:text-5xl font-bold">128</div>
						<div className="text-xl lg:text-2xl font-semibold text-gray-400 mb-2">Hours</div>
						<div className="text-green-400 text-sm font-medium mb-2 flex items-center gap-1">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
							</svg>
							8.2%
						</div>
					</div>
					<div className="text-gray-400 text-sm">
						Approx. 4.2 full shifts saved
					</div>
				</div>

				{/* Maintenance ROI */}
				<div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
					<div className="flex items-start justify-between mb-4">
						<div className="text-gray-400 text-sm font-medium">Maintenance ROI</div>
						<div className="bg-blue-500/20 p-2 rounded-lg">
							<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>
					</div>
					<div className="flex items-end gap-2 mb-2">
						<div className="text-4xl lg:text-5xl font-bold">315%</div>
						<div className="text-green-400 text-sm font-medium mb-2 flex items-center gap-1">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
							</svg>
							4.1%
						</div>
					</div>
					<div className="text-gray-400 text-sm">
						Direct result of predictive logic
					</div>
				</div>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
				{/* Downtime by Machine Category */}
				<div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
					<div className="flex items-start justify-between mb-6">
						<div>
							<h2 className="text-xl font-bold mb-1">Downtime by Machine Category</h2>
							<p className="text-gray-400 text-sm">Cumulative hours (Jan - Jun)</p>
						</div>
						<div className="text-right">
							<div className="text-2xl lg:text-3xl font-bold mb-1">2,450 hrs</div>
							<div className="text-red-400 text-sm font-medium">-15% Total improvement</div>
						</div>
					</div>

					{/* Bar Chart (Visual Representation) */}
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="w-20 lg:w-24 text-gray-400 text-sm">CNC</div>
							<div className="flex-1">
								<div className="h-10 bg-gray-800 rounded-lg overflow-hidden">
									<div className="h-full bg-blue-500 rounded-lg" style={{ width: '68%' }}></div>
								</div>
							</div>
							<div className="w-16 text-right text-sm font-medium">680 hrs</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="w-20 lg:w-24 text-gray-400 text-sm">ROBOTIC</div>
							<div className="flex-1">
								<div className="h-10 bg-gray-800 rounded-lg overflow-hidden">
									<div className="h-full bg-blue-500 rounded-lg" style={{ width: '56%' }}></div>
								</div>
							</div>
							<div className="w-16 text-right text-sm font-medium">560 hrs</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="w-20 lg:w-24 text-gray-400 text-sm">CONVEYOR</div>
							<div className="flex-1">
								<div className="h-10 bg-gray-800 rounded-lg overflow-hidden">
									<div className="h-full bg-blue-500 rounded-lg" style={{ width: '44%' }}></div>
								</div>
							</div>
							<div className="w-16 text-right text-sm font-medium">440 hrs</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="w-20 lg:w-24 text-gray-400 text-sm">PRESS</div>
							<div className="flex-1">
								<div className="h-10 bg-gray-800 rounded-lg overflow-hidden">
									<div className="h-full bg-blue-500 rounded-lg" style={{ width: '36%' }}></div>
								</div>
							</div>
							<div className="w-16 text-right text-sm font-medium">360 hrs</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="w-20 lg:w-24 text-gray-400 text-sm">LATHE</div>
							<div className="flex-1">
								<div className="h-10 bg-gray-800 rounded-lg overflow-hidden">
									<div className="h-full bg-blue-500 rounded-lg" style={{ width: '28%' }}></div>
								</div>
							</div>
							<div className="w-16 text-right text-sm font-medium">280 hrs</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="w-20 lg:w-24 text-gray-400 text-sm">HVAC</div>
							<div className="flex-1">
								<div className="h-10 bg-gray-800 rounded-lg overflow-hidden">
									<div className="h-full bg-blue-500 rounded-lg" style={{ width: '13%' }}></div>
								</div>
							</div>
							<div className="w-16 text-right text-sm font-medium">130 hrs</div>
						</div>
					</div>
				</div>

				{/* Maintenance Efficiency Trend */}
				<div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
					<div className="flex items-start justify-between mb-6">
						<div>
							<h2 className="text-xl font-bold mb-1">Maintenance Efficiency Trend</h2>
							<p className="text-gray-400 text-sm">Overall equipment effectiveness %</p>
						</div>
						<div className="text-right">
							<div className="text-2xl lg:text-3xl font-bold mb-1">85.4%</div>
							<div className="text-red-400 text-sm font-medium">-2.5% vs Last Mo</div>
						</div>
					</div>

					{/* Line Chart */}
					<div className="h-64 relative">
						<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 200">
							{/* Grid lines */}
							<line x1="0" y1="50" x2="600" y2="50" stroke="rgb(31, 41, 55)" strokeWidth="1" opacity="0.5" />
							<line x1="0" y1="100" x2="600" y2="100" stroke="rgb(31, 41, 55)" strokeWidth="1" opacity="0.5" />
							<line x1="0" y1="150" x2="600" y2="150" stroke="rgb(31, 41, 55)" strokeWidth="1" opacity="0.5" />

							{/* Line chart path */}
							<path
								d="M 0,140 L 100,135 L 200,115 L 300,105 L 400,120 L 500,110 L 600,75"
								fill="none"
								stroke="rgb(59, 130, 246)"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>

							{/* Area under the line */}
							<path
								d="M 0,140 L 100,135 L 200,115 L 300,105 L 400,120 L 500,110 L 600,75 L 600,200 L 0,200 Z"
								fill="url(#efficiencyGradient)"
								opacity="0.2"
							/>

							<defs>
								<linearGradient id="efficiencyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
									<stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
								</linearGradient>
							</defs>
						</svg>

						{/* X-axis labels */}
						<div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
							<span>JAN</span>
							<span>FEB</span>
							<span>MAR</span>
							<span>APR</span>
							<span>MAY</span>
							<span>JUN</span>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Section */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
				{/* Top Maintenance Drivers Table */}
				<div className="lg:col-span-2">
					<MaintenanceDriversTable />
				</div>

				{/* Management Insights */}
				<div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-xl p-6 border border-blue-500/30">
					<div className="flex items-start gap-3 mb-4">
						<div className="bg-white/20 p-2 rounded-lg">
							<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
							</svg>
						</div>
						<div>
							<div className="text-xs font-bold uppercase tracking-wider mb-1 text-blue-100">
								Management Insights
							</div>
							<h3 className="text-xl font-bold text-white">Key Takeaways</h3>
						</div>
					</div>

					<div className="bg-blue-700/50 rounded-lg p-4 mb-4 backdrop-blur-sm">
						<p className="text-white leading-relaxed text-sm lg:text-base">
							Hydraulic systems show a <span className="font-bold">15% increase</span> in efficiency since the last service cycle.
						</p>
					</div>

					<div className="bg-blue-700/50 rounded-lg p-4 backdrop-blur-sm">
						<p className="text-white leading-relaxed text-sm lg:text-base">
							CNC machines contribute to <span className="font-bold">28% of total downtime</span>. Recommend priority maintenance scheduling.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Analytics;
