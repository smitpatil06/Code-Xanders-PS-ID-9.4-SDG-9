// File: src/pages/Landing.tsx

import React from 'react';
import Topbar from '../components/layout/Topbar';
import MetricCard from '../components/cards/MetricCard';
import FeatureCard from '../components/cards/FeatureCard';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Topbar />

      {/* Hero Section */}
      <div className="relative px-6 lg:px-8 py-16 lg:py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="text-blue-400 text-xs font-medium uppercase tracking-wider">
                Next-Gen Predictive AI
              </span>
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 leading-tight">
            Predict failure before it
            <br />
            happens.
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base lg:text-lg text-gray-400 text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            AeroPulse: Enterprise-grade Predictive Maintenance. Minimize downtime
            and maximize efficiency with real-time AI-driven diagnostics for industrial
            assets.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-3 mb-12">
            <button className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-colors shadow-lg shadow-blue-500/25">
              Enter Dashboard
            </button>
            <button className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-750 text-white font-semibold text-base transition-colors border border-gray-700">
              Request Demo
            </button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 max-w-4xl mx-auto">
            <MetricCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              }
              label="Total Machines"
              value="1,240"
              subtext="+2.4% this month"
              subtextColor="text-green-400"
            />
            <MetricCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Factory Health"
              value="92%"
              subtext="8% requires attention"
              subtextColor="text-yellow-400"
              subtextIcon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              }
              valueColor="text-green-400"
              highlighted
            />
            <MetricCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
              label="Active Alerts"
              value="12"
              subtext="3 Critical Incidents"
              subtextColor="text-red-400"
              subtextIcon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="4" />
                </svg>
              }
              valueColor="text-red-400"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 lg:px-8 py-16 lg:py-20 bg-linear-to-b from-gray-950 to-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3">
            Engineered for Enterprise Reliability
          </h2>
          <p className="text-base lg:text-lg text-gray-400 text-center max-w-2xl mx-auto mb-10">
            Our platform provides deep technical insights into your factory floor's performance using
            proprietary neural network analysis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              }
              title="Real-time Telemetry"
              description="Continuous high-fidelity tracking of every sensor across your entire facility with sub-millisecond latency."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title="AI Diagnostics"
              description="Advanced transformer-based algorithms identify vibration and heat patterns weeks before a failure occurs."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
              title="Predictive Smart Alerts"
              description="Smart notifications delivered to your maintenance team via mobile, Slack, or integrated ERP systems."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl lg:rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                Ready to optimize your
                <br />
                factory?
              </h2>
              <p className="text-base lg:text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
                Join over 500 leading industrial enterprises using AeroPulse to eliminate unplanned
                downtime and secure their operations.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button className="px-6 py-3 rounded-lg bg-white hover:bg-gray-100 text-blue-600 font-semibold text-base transition-colors shadow-lg">
                  Enter Dashboard
                </button>
                <button className="px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base transition-colors border-2 border-blue-400">
                  Book Technical Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-8 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-lg font-bold">AeroPulse</span>
            </div>

            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
            </div>

            <div className="text-gray-500 text-xs">
              © 2024 AeroPulse Systems Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
