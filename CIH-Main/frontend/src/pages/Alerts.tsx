
import React, { useState } from 'react';
import AlertsTable from '../components/tables/AlertsTable';

type FilterType = 'all' | 'critical' | 'warning' | 'acknowledged';

const Alerts: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const stats = {
    totalActive: 24,
    percentChange: '+12% vs last week',
    critical: 8,
    criticalResolved: '-5% resolved',
    warning: 16,
    warningMonitored: '+8% monitored'
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Predictive Maintenance Alerts</h1>
        <p className="text-gray-400 text-lg">
          Monitor and manage real-time equipment health notifications across the facility.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Total Active */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="text-gray-400 text-sm font-medium">TOTAL ACTIVE</div>
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <div className="text-5xl font-bold mb-2">{stats.totalActive}</div>
          <div className="text-green-400 text-sm font-medium">{stats.percentChange}</div>
        </div>

        {/* Critical Priority */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="text-gray-400 text-sm font-medium">CRITICAL PRIORITY</div>
            <div className="bg-red-500/20 p-2 rounded-lg">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="text-5xl font-bold mb-2">{stats.critical}</div>
          <div className="text-red-400 text-sm font-medium">{stats.criticalResolved}</div>
        </div>

        {/* Warning Level */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="text-gray-400 text-sm font-medium">WARNING LEVEL</div>
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="text-5xl font-bold mb-2">{stats.warning}</div>
          <div className="text-green-400 text-sm font-medium">{stats.warningMonitored}</div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        {/* Filter Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
              }`}
            >
              All Alerts
              <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
            <button
              onClick={() => setActiveFilter('critical')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeFilter === 'critical'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
              }`}
            >
              Critical
              <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveFilter('warning')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeFilter === 'warning'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
              }`}
            >
              Warning
              <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveFilter('acknowledged')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeFilter === 'acknowledged'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
              }`}
            >
              Acknowledged
              <svg className="inline-block ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="text-gray-400 text-sm">
            Showing 1-10 of 24 alerts
          </div>
        </div>

        {/* Alerts Table */}
        <AlertsTable filter={activeFilter} />
      </div>
    </div>
  );
};

export default Alerts;