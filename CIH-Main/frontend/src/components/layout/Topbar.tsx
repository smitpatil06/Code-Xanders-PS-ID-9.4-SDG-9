import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Topbar: React.FC = () => {
	const navigate = useNavigate();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const navLinks = [
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/analytics', label: 'Analytics' },
		{ href: '/alerts', label: 'Alerts' },
		{ href: '/settings', label: 'Settings' },
	];

	return (
		<nav className="sticky top-0 z-50 px-6 lg:px-8 py-4 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Logo */}
				<Link 
					to="/" 
					className="flex items-center gap-2 hover:opacity-80 transition-opacity active:scale-95 transform"
				>
					<div className="relative">
						<svg className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
							<path d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
						<div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full"></div>
					</div>
					<span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
						AeroPulse
					</span>
				</Link>

				{/* Desktop Navigation Links */}
				<div className="hidden md:flex items-center gap-6 lg:gap-8">
					{navLinks.map((link) => (
						<Link 
							key={link.href}
							to={link.href} 
							className="text-gray-300 hover:text-white transition-colors font-medium text-sm lg:text-base relative group"
						>
							{link.label}
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
						</Link>
					))}
				</div>

				{/* Right Side Actions */}
				<div className="flex items-center gap-3">
					{/* Mobile Menu Button */}
					<button 
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
					>
						<svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>

					{/* Auth Buttons */}
					<button className="hidden sm:block px-4 lg:px-5 py-2 rounded-lg text-white hover:bg-gray-800 transition-colors font-medium text-sm lg:text-base">
						Log in
					</button>
					<button 
						onClick={() => navigate('/dashboard')}
						className="px-4 lg:px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium shadow-lg shadow-blue-500/25 text-sm lg:text-base active:scale-95 transform"
					>
						Dashboard
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="md:hidden absolute top-full left-0 right-0 bg-gray-950 border-b border-gray-800 animate-in fade-in">
					<div className="px-6 py-4 space-y-3">
						{navLinks.map((link) => (
							<Link 
								key={link.href}
								to={link.href}
								onClick={() => setMobileMenuOpen(false)}
								className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors font-medium text-sm"
							>
								{link.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Topbar;
