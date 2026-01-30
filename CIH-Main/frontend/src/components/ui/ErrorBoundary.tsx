import React, { ReactNode, ErrorInfo } from 'react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Error caught by boundary:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
						<div className="bg-gray-900 rounded-xl border border-red-500/30 p-8 max-w-md">
							<div className="flex items-center gap-3 mb-4">
								<div className="bg-red-500/20 p-2 rounded-lg">
									<svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h2 className="text-xl font-bold text-white">Something went wrong</h2>
							</div>
							<p className="text-gray-300 text-sm mb-4">
								{this.state.error?.message || 'An unexpected error occurred'}
							</p>
							<button
								onClick={() => window.location.reload()}
								className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
							>
								Reload Page
							</button>
						</div>
					</div>
				)
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
