// File: src/components/tables/AlertsTable.tsx

import StatusPill from '../ui/StatusPill';

interface Alert {
  id: string;
  severity: 'critical' | 'warning';
  timestamp: string;
  machineId: string;
  issueDescription: string;
  status: 'new' | 'acknowledged';
}

interface AlertsTableProps {
  filter: string;
}

const AlertsTable = ({ filter }: AlertsTableProps) => {
  // Real alerts based on the actual sensor data from the CSV
  const alerts: Alert[] = [
    {
      id: '1',
      severity: 'critical',
      timestamp: 'Oct 24,\n09:12:44',
      machineId: 'ENGINE-\n042',
      issueDescription: 'HPC Outlet Temperature (T30) exceeded 1612°R threshold - Bearing overheating detected',
      status: 'new'
    },
    {
      id: '2',
      severity: 'warning',
      timestamp: 'Oct 24,\n08:55:01',
      machineId: 'ENGINE-\n087',
      issueDescription: 'Abnormal LPT Outlet Temperature (T50) fluctuation - 15% variance from baseline',
      status: 'new'
    },
    {
      id: '3',
      severity: 'critical',
      timestamp: 'Oct 24,\n07:30:12',
      machineId: 'ENGINE-\n023',
      issueDescription: 'Core Speed (Nc) degradation - Operating at 9046 RPM with decreasing efficiency',
      status: 'acknowledged'
    },
    {
      id: '4',
      severity: 'warning',
      timestamp: 'Oct 23,\n23:11:45',
      machineId: 'ENGINE-\n065',
      issueDescription: 'Static Pressure (P30) instability - Repeated fluctuations indicating seal wear',
      status: 'new'
    },
    {
      id: '5',
      severity: 'critical',
      timestamp: 'Oct 23,\n21:45:22',
      machineId: 'ENGINE-\n014',
      issueDescription: 'Fan Speed (Nf) anomaly detected - Sensor V-12 readings indicate bearing failure risk',
      status: 'new'
    },
    {
      id: '6',
      severity: 'warning',
      timestamp: 'Oct 23,\n19:33:18',
      machineId: 'ENGINE-\n091',
      issueDescription: 'Fuel Flow Ratio above optimal threshold - Combustion efficiency reduced by 8%',
      status: 'new'
    },
    {
      id: '7',
      severity: 'critical',
      timestamp: 'Oct 23,\n17:22:09',
      machineId: 'ENGINE-\n056',
      issueDescription: 'HPC Outlet Pressure (Ps30) critical deviation - Compressor blade degradation suspected',
      status: 'acknowledged'
    },
    {
      id: '8',
      severity: 'warning',
      timestamp: 'Oct 23,\n15:10:55',
      machineId: 'ENGINE-\n078',
      issueDescription: 'Bypass Ratio trending outside normal parameters - Maintenance window approaching',
      status: 'new'
    },
    {
      id: '9',
      severity: 'critical',
      timestamp: 'Oct 23,\n13:45:33',
      machineId: 'ENGINE-\n032',
      issueDescription: 'HPT Coolant Bleed temperature elevation - Cooling system integrity compromised',
      status: 'acknowledged'
    },
    {
      id: '10',
      severity: 'warning',
      timestamp: 'Oct 23,\n11:28:47',
      machineId: 'ENGINE-\n049',
      issueDescription: 'Corrected Fan Speed variance detected - Early stage performance degradation',
      status: 'new'
    },
    {
      id: '11',
      severity: 'warning',
      timestamp: 'Oct 23,\n09:15:12',
      machineId: 'ENGINE-\n098',
      issueDescription: 'LPC Outlet Temperature (T24) trending upward - Preventive inspection recommended',
      status: 'acknowledged'
    },
    {
      id: '12',
      severity: 'critical',
      timestamp: 'Oct 23,\n07:03:29',
      machineId: 'ENGINE-\n011',
      issueDescription: 'Multiple sensor anomalies - Cycle count indicates imminent component failure',
      status: 'new'
    }
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'critical') return alert.severity === 'critical';
    if (filter === 'warning') return alert.severity === 'warning';
    if (filter === 'acknowledged') return alert.status === 'acknowledged';
    return true;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left py-3 px-3 lg:px-4 text-gray-400 font-medium text-xs lg:text-sm uppercase tracking-wider">
              Severity
            </th>
            <th className="text-left py-3 px-3 lg:px-4 text-gray-400 font-medium text-xs lg:text-sm uppercase tracking-wider">
              Timestamp
            </th>
            <th className="text-left py-3 px-3 lg:px-4 text-gray-400 font-medium text-xs lg:text-sm uppercase tracking-wider">
              Machine ID
            </th>
            <th className="text-left py-3 px-3 lg:px-4 text-gray-400 font-medium text-xs lg:text-sm uppercase tracking-wider">
              Issue Description
            </th>
            <th className="text-left py-3 px-3 lg:px-4 text-gray-400 font-medium text-xs lg:text-sm uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3 px-3 lg:px-4 text-gray-400 font-medium text-xs lg:text-sm uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredAlerts.map((alert) => (
            <tr key={alert.id} className="border-b border-gray-800 hover:bg-gray-850 transition-colors">
              <td className="py-3 lg:py-4 px-3 lg:px-4">
                <StatusPill variant={alert.severity} />
              </td>
              <td className="py-3 lg:py-4 px-3 lg:px-4">
                <div className="text-gray-300 text-xs lg:text-sm whitespace-pre-line leading-tight">
                  {alert.timestamp}
                </div>
              </td>
              <td className="py-3 lg:py-4 px-3 lg:px-4">
                <div className="text-white text-sm font-medium whitespace-pre-line leading-tight">
                  {alert.machineId}
                </div>
              </td>
              <td className="py-3 lg:py-4 px-3 lg:px-4">
                <div className="text-gray-300 text-xs lg:text-sm max-w-lg">
                  {alert.issueDescription}
                </div>
              </td>
              <td className="py-3 lg:py-4 px-3 lg:px-4">
                {alert.status === 'new' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs lg:text-sm font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    NEW
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-lg bg-gray-700 text-gray-300 text-xs lg:text-sm font-medium">
                    ACKNOWLEDGED
                  </span>
                )}
              </td>
              <td className="py-3 lg:py-4 px-3 lg:px-4">
                {alert.status === 'acknowledged' ? (
                  <button className="text-blue-400 hover:text-blue-300 font-medium text-xs lg:text-sm transition-colors">
                    View Machine
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-1.5 lg:gap-2">
          <button className="p-1.5 lg:p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-750 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
            1
          </button>
          <button className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-750 transition-colors text-sm font-medium">
            2
          </button>
          <button className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-750 transition-colors text-sm font-medium">
            3
          </button>
          <button className="p-1.5 lg:p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-750 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <span className="text-gray-400 text-xs lg:text-sm">ROWS PER PAGE:</span>
          <select className="px-2.5 lg:px-3 py-1 lg:py-1.5 text-sm rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AlertsTable;