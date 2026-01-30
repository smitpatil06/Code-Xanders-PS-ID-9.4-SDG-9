import React, { createContext, useState, ReactNode, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
}

interface ToastContextType {
	toasts: Toast[];
	showToast: (message: string, type: ToastType, duration?: number) => void;
	removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback((message: string, type: ToastType, duration = 3000) => {
		const id = Math.random().toString(36).substr(2, 9);
		const toast: Toast = { id, message, type, duration };

		setToasts((prev) => [...prev, toast]);

		if (duration > 0) {
			setTimeout(() => removeToast(id), duration);
		}
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, showToast, removeToast }}>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
};

interface ToastContainerProps {
	toasts: Toast[];
	onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
	const getStyles = (type: ToastType) => {
		switch (type) {
			case 'success':
				return 'bg-green-600 text-white border-green-500/30';
			case 'error':
				return 'bg-red-600 text-white border-red-500/30';
			case 'warning':
				return 'bg-yellow-600 text-white border-yellow-500/30';
			case 'info':
			default:
				return 'bg-blue-600 text-white border-blue-500/30';
		}
	};

	const getIcon = (type: ToastType) => {
		switch (type) {
			case 'success':
				return (
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				);
			case 'error':
				return (
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				);
			case 'warning':
				return (
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				);
			case 'info':
			default:
				return (
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				);
		}
	};

	return (
		<div className="fixed bottom-6 right-6 space-y-3 pointer-events-none z-50">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm animate-in fade-in slide-in-from-right pointer-events-auto ${getStyles(
						toast.type
					)}`}
				>
					{getIcon(toast.type)}
					<span className="text-sm font-medium">{toast.message}</span>
					<button
						onClick={() => onRemove(toast.id)}
						className="ml-4 text-white/70 hover:text-white transition-colors"
					>
						<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			))}
		</div>
	);
};

export const useToast = () => {
	const context = React.useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within ToastProvider');
	}
	return context;
};
