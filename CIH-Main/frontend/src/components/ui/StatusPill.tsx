// File: src/components/ui/StatusPill.tsx

interface StatusPillProps {
  variant: 'critical' | 'warning' | 'healthy' | 'normal';
}

const StatusPill = ({ variant }: StatusPillProps) => {
  const variants = {
    critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    healthy: 'bg-green-500/20 text-green-400 border border-green-500/30',
    normal: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
  };

  const labels = {
    critical: 'CRITICAL',
    warning: 'WARNING',
    healthy: 'HEALTHY',
    normal: 'NORMAL'
  };

  return (
    <span
      className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${variants[variant]}`}
    >
      {labels[variant]}
    </span>
  );
};

export default StatusPill;