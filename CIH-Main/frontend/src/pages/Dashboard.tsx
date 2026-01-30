import React, { useState, useEffect } from 'react';
import Topbar from '../components/layout/Topbar';
import MetricCard from '../components/cards/MetricCard';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/ui/SkeletonLoader';
import { useToast } from '../context/ToastContext';

const Dashboard: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const { showToast } = useToast();

	// Simulate data loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
			showToast('Dashboard loaded successfully', 'success', 2000);
		}, 1500);
		return () => clearTimeout(timer);
	}, [showToast]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-950 text-white">
				<Topbar />
				<div className="px-6 lg:px-8 pt-8 pb-8">
					<div className="mb-8">
						<div className="h-10 w-48 bg-gray-800 rounded-lg animate-pulse mb-2"></div>
						<div className="h-4 w-96 bg-gray-800 rounded-lg animate-pulse"></div>
					</div>
					<CardSkeleton count={3} />
					<div className="mt-8">
						<ChartSkeleton />
					</div>
					<div className="mt-8">
						<TableSkeleton />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-950 text-white">
			<Topbar />

			<div className="px-6 lg:px-8 pt-8 pb-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl lg:text-5xl font-bold mb-2 animate-fade-in">Dashboard</h1>
					<p className="text-gray-400 text-lg">Real-time system health and performance monitoring</p>
				</div>

				{/* Key Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
					<div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
						<MetricCard
							icon={
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							}
							label="System Uptime"
							value="99.8%"
							subtext="Last 30 days"
							subtextColor="text-green-400"
							subtextIcon={
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
								</svg>
							}
						/>
					</div>

					<div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
						<MetricCard
							icon={
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							}
							label="Est. Savings"
							value="$125K"
							subtext="+15% vs last quarter"
							subtextColor="text-blue-400"
							subtextIcon={
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							}
						/>
					</div>

					<div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
						<MetricCard
							icon={
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							}
							label="Active Assets"
							value="247"
							subtext="12 require attention"
							subtextColor="text-yellow-400"
							valueColor="text-blue-400"
						/>
					</div>
				</div>

				{/* System Health Overview */}
				<div className="bg-gray-900 rounded-xl p-6 lg:p-8 border border-gray-800 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
					<h2 className="text-2xl font-bold mb-6">System Health Overview</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
						{/* Health Score Chart */}
						<div>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold">Overall Health Score</h3>
								<span className="text-3xl font-bold text-green-400">87%</span>
							</div>
							<div className="h-48 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
								<svg className="w-32 h-32" viewBox="0 0 120 120">
									<circle cx="60" cy="60" r="50" fill="none" stroke="rgb(31, 41, 55)" strokeWidth="8" />
									<circle cx="60" cy="60" r="50" fill="none" stroke="rgb(34, 197, 94)" strokeWidth="8" strokeDasharray={`${(87 / 100) * 314} 314`} strokeLinecap="round" transform="rotate(-90 60 60)" />
									<text x="60" y="70" textAnchor="middle" className="text-2xl font-bold fill-white">
										87%
									</text>
								</svg>
							</div>
						</div>

						{/* Status Summary */}
						<div className="space-y-4">
							<div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
								<div className="flex items-center justify-between mb-2">
									<span className="text-gray-300 font-medium">Healthy Assets</span>
									<span className="text-2xl font-bold text-green-400">235</span>
								</div>
								<div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
									<div className="h-full bg-green-500" style={{ width: '95%' }}></div>
								</div>
							</div>

							<div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
								<div className="flex items-center justify-between mb-2">
									<span className="text-gray-300 font-medium">Warning Status</span>
									<span className="text-2xl font-bold text-yellow-400">8</span>
								</div>
								<div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
									<div className="h-full bg-yellow-500" style={{ width: '35%' }}></div>
								</div>
							</div>

							<div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
								<div className="flex items-center justify-between mb-2">
									<span className="text-gray-300 font-medium">Critical Status</span>
									<span className="text-2xl font-bold text-red-400">4</span>
								</div>
								<div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
									<div className="h-full bg-red-500" style={{ width: '15%' }}></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Recent Alerts */}
				<div className="bg-gray-900 rounded-xl p-6 lg:p-8 border border-gray-800 animate-fade-in" style={{ animationDelay: '0.5s' }}>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold">Recent Alerts</h2>
						<button className="px-4 py-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
							View All →
						</button>
					</div>

					<div className="space-y-3">
						{[
							{ asset: 'CNC-Machine-02', severity: 'critical', message: 'Temperature exceeds safe threshold' },
							{ asset: 'Hydraulic-System-01', severity: 'warning', message: 'Pressure fluctuations detected' },
							{ asset: 'Motor-Assembly-04', severity: 'warning', message: 'Vibration levels increasing' },
						].map((alert, idx) => (
							<div key={idx} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
								<div className={`w-3 h-3 rounded-full ${alert.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
								<div className="flex-1">
									<p className="font-medium text-white">{alert.asset}</p>
									<p className="text-sm text-gray-400">{alert.message}</p>
								</div>
								<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
									alert.severity === 'critical'
										? 'bg-red-500/20 text-red-300 border border-red-500/30'
										: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
								}`}>
									{alert.severity}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
