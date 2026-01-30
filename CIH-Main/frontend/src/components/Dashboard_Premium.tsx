import { useMemo, useState, useEffect } from 'react';
import { useMachineStream } from '../hooks/UseMachineStream';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  AlertTriangle, CheckCircle, Activity, Zap, Gauge, RotateCcw, Upload,
  TrendingUp, TrendingDown, Minus, AlertCircle
} from 'lucide-react';
import UploadAnalysis from './UploadAnalysis';

// ==================== NASA C-MAPSS CONFIGURATION ====================

const SENSOR_GROUPS = {
  TEMPERATURE: {
    title: 'TEMPERATURE SENSORS',
    sensors: {
      LPC_Outlet_Temp: { max: 644, min: 640, label: 'LPC Temp', unit: '°R', color: '#3B82F6' },
      HPC_Outlet_Temp: { max: 1590, min: 1580, label: 'HPC Temp', unit: '°R', color: '#8B5CF6' },
      LPT_Outlet_Temp: { max: 1420, min: 1390, label: 'LPT Temp', unit: '°R', color: '#EF4444' }
    }
  },
  PRESSURE: {
    title: 'PRESSURE SYSTEMS',
    sensors: {
      HPC_Outlet_Pressure: { max: 555, min: 545, label: 'HPC Press', unit: 'psia', color: '#10B981' },
      Combustion_Pressure: { max: 48.5, min: 36, label: 'Combustion Press', unit: 'psia', color: '#F59E0B' }
    }
  },
  SPEED: {
    title: 'ROTATIONAL SPEEDS',
    sensors: {
      Fan_Speed: { max: 2400, min: 2380, label: 'Fan Speed', unit: 'rpm', color: '#06B6D4' },
      Core_Speed: { max: 9100, min: 9000, label: 'Core Speed', unit: 'rpm', color: '#8B5CF6' },
      Corrected_Fan_Speed: { max: 2390, min: 2380, label: 'Corr Fan', unit: 'rpm', color: '#14B8A6' },
      Corrected_Core_Speed: { max: 8150, min: 8100, label: 'Corr Core', unit: 'rpm', color: '#A855F7' }
    }
  },
  FLOW: {
    title: 'FLOW & RATIOS',
    sensors: {
      Bypass_Ratio: { max: 8.5, min: 8.3, label: 'Bypass Ratio', unit: '--', color: '#EC4899' },
      Fuel_Flow_Ratio: { max: 537, min: 128, label: 'Fuel Flow φ', unit: 'temp-like', color: '#F59E0B' }
    }
  },
  BLEED: {
    title: 'BLEED & ENTHALPY',
    sensors: {
      Bleed_Enthalpy: { max: 395, min: 390, label: 'Bleed Enthalpy', unit: '--', color: '#6366F1' },
      HPT_Coolant_Bleed: { max: 39.5, min: 38.5, label: 'HPT Coolant', unit: 'lbm/s', color: '#F43F5E' },
      LPT_Coolant_Bleed: { max: 23.5, min: 23.0, label: 'LPT Coolant (Vib)', unit: 'lbm/s', color: '#EF4444' }
    }
  }
};

// Abbreviation explanations
const NASA_ABBREVIATIONS = {
  'LPC': 'Low Pressure Compressor',
  'HPC': 'High Pressure Compressor',
  'HPT': 'High Pressure Turbine',
  'LPT': 'Low Pressure Turbine',
  'EGT': 'Exhaust Gas Temperature',
  'RUL': 'Remaining Useful Life'
};

export default function Dashboard() {
  const { data, history, isConnected } = useMachineStream();
  const [selectedEngine, setSelectedEngine] = useState(34);
  const [showUpload, setShowUpload] = useState(false);
  const [activeGroup, setActiveGroup] = useState('TEMPERATURE');

  const switchEngine = async (id: number) => {
    setSelectedEngine(id);
    await fetch('http://localhost:8000/set_engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit_id: id })
    });
  };

  // 🔧 FIX: Transform history data to flatten sensor values for charts
  // - Guard against undefined history
  // - Coerce numeric fields to numbers so Recharts receives numeric values
  const chartData = useMemo(() => {
    const hist = history || [];
    return hist.map(item => {
      const flattened: any = {
        cycle: Number(item.cycle) || 0,
        RUL: Number(item.RUL) || 0,
        status: item.status
      };

      if (item.sensors) {
        Object.entries(item.sensors).forEach(([key, value]) => {
          // Keep null for missing values, otherwise coerce to Number
          flattened[key] = value === undefined || value === null ? null : Number(value);
        });
      }

      return flattened;
    });
  }, [history]);

  // Calculate sensor statuses
  const sensorStatuses = useMemo(() => {
    if (!data || !data.sensors) return {};
    
    const statuses: Record<string, any> = {};
    
    Object.entries(SENSOR_GROUPS).forEach(([groupKey, group]) => {
      Object.entries(group.sensors).forEach(([sensorKey, config]) => {
        const value = data.sensors[sensorKey] || 0;
        const deviation = ((value - config.max) / config.max) * 100;
        const isCritical = value > config.max;
        const isWarning = value > (config.max - (config.max - config.min) * 0.2);
        
        statuses[sensorKey] = {
          value,
          config,
          deviation: Math.abs(deviation),
          status: isCritical ? 'Critical' : isWarning ? 'Warning' : 'Normal',
          trend: history.length > 1 ? 
            (value > history[history.length-2]?.sensors[sensorKey] ? 'up' : 
             value < history[history.length-2]?.sensors[sensorKey] ? 'down' : 'stable') : 'stable'
        };
      });
    });
    
    return statuses;
  }, [data, history]);

  // Critical sensors only with sticky retention to avoid flicker
  // Keep alerts visible for a short duration after they stop being critical
  const MIN_CRITICAL_DISPLAY_MS = 5000; // keep for 5 seconds
  const [stickyCriticals, setStickyCriticals] = useState<Record<string, any>>({});

  // Update sticky list whenever sensorStatuses changes
  useEffect(() => {
    const now = Date.now();

    setStickyCriticals(prev => {
      const next: Record<string, any> = { ...prev };

      // Add/update currently critical sensors with new expiry
      Object.entries(sensorStatuses).forEach(([key, status]) => {
        if (status.status === 'Critical') {
          next[key] = { ...status, _expiry: now + MIN_CRITICAL_DISPLAY_MS };
        }
      });

      // Purge expired entries that are no longer critical
      Object.keys(next).forEach(k => {
        const entry = next[k];
        if (entry._expiry && entry._expiry < now && sensorStatuses[k]?.status !== 'Critical') {
          delete next[k];
        }
      });

      return next;
    });
  }, [sensorStatuses]);

  // Interval purge to ensure entries are removed after expiry even without new incoming data
  useEffect(() => {
    const iv = setInterval(() => {
      const now = Date.now();
      setStickyCriticals(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (next[k]._expiry && next[k]._expiry < now && sensorStatuses[k]?.status !== 'Critical') {
            delete next[k];
          }
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(iv);
  }, [sensorStatuses]);

  const criticalSensors = useMemo(() => {
    // Merge current criticals and sticky criticals (current takes precedence)
    const merged = new Map<string, any>();

    Object.entries(stickyCriticals).forEach(([k, v]) => merged.set(k, v));
    Object.entries(sensorStatuses).forEach(([k, v]) => {
      if (v.status === 'Critical') merged.set(k, v);
    });

    return Array.from(merged.entries()).sort((a, b) => (b[1].deviation || 0) - (a[1].deviation || 0));
  }, [sensorStatuses, stickyCriticals]);

  if (showUpload) {
    return <UploadAnalysis onBack={() => setShowUpload(false)} />;
  }

  if (!isConnected) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-blue-500/20 animate-pulse"></div>
            <Activity className="relative animate-spin h-16 w-16 text-blue-400 mx-auto mb-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest mb-2">AEGISFLOW SYSTEM</h1>
          <p className="text-blue-400 text-sm">Establishing secure connection to C-MAPSS...</p>
        </div>
      </div>
    );
  }

  const statusColor = data?.status === 'Critical' ? 'text-red-400' : 
                      data?.status === 'Warning' ? 'text-yellow-400' : 'text-emerald-400';
  const glowColor = data?.status === 'Critical' ? 'shadow-red-500/50' : 
                    data?.status === 'Warning' ? 'shadow-yellow-500/50' : 'shadow-emerald-500/50';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4">
      
      {/* PREMIUM HEADER */}
      <header className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 mb-4 shadow-2xl">
        <div className="flex justify-between items-center">
          
          {/* Left: Branding */}
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                <div className="absolute inset-0 blur-xl bg-blue-500/30"></div>
                <Zap className="relative text-blue-400 fill-blue-400 h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-white">
                  AEGIS<span className="text-blue-400">FLOW</span>
                </h1>
                <p className="text-xs text-slate-400 tracking-widest">NASA C-MAPSS TURBOFAN MONITORING SYSTEM</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <select 
                className="bg-slate-800/50 backdrop-blur text-sm px-4 py-2 rounded-lg border border-slate-700 hover:border-blue-500 transition-all outline-none cursor-pointer"
                value={selectedEngine}
                onChange={(e) => switchEngine(Number(e.target.value))}
              >
                <option value="34">🔥 Unit 34 (Perfect Failure Curve)</option>
                <option value="1">✅ Unit 1 (Healthy Start)</option>
                <option value="50">📊 Unit 50 (Variable Pattern)</option>
                <option value="100">⚠️ Unit 100 (Critical Early)</option>
              </select>

              <button 
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-all font-bold shadow-lg shadow-blue-900/50"
              >
                <Upload size={16} /> Batch Analysis
              </button>

              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm px-4 py-2 rounded-lg transition-all"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          {/* Right: Status Indicator */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">SYSTEM STATUS</div>
              <div className={`text-2xl font-black ${statusColor}`}>
                {data?.status || 'STANDBY'}
              </div>
            </div>
            
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-2xl ${glowColor} ${
              data?.status === 'Critical' ? 'border-red-500 bg-red-500/20' : 
              data?.status === 'Warning' ? 'border-yellow-500 bg-yellow-500/20' : 
              'border-emerald-500 bg-emerald-500/20'
            }`}>
              {data?.status === 'Critical' && <AlertTriangle className="text-red-400 h-10 w-10" />}
              {data?.status === 'Warning' && <AlertCircle className="text-yellow-400 h-10 w-10" />}
              {data?.status === 'Healthy' && <CheckCircle className="text-emerald-400 h-10 w-10" />}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: RUL & ALERTS */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          
          {/* RUL CARD */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Gauge className="text-blue-400 h-6 w-6" />
              <h3 className="text-slate-400 text-xs font-bold tracking-widest">REMAINING USEFUL LIFE</h3>
            </div>
            
            <div className="text-center mb-6">
              <div className={`text-6xl font-black mb-2 ${statusColor}`}>
                {data?.RUL || 0}
              </div>
              <div className="text-slate-500 text-sm">CYCLES REMAINING</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">AI CONFIDENCE</span>
                <span className="text-blue-400 font-bold">94.2%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 w-[94%] shadow-lg shadow-blue-500/50"></div>
              </div>
              
              <div className="flex justify-between text-xs mt-4">
                <span className="text-slate-500">CURRENT CYCLE</span>
                <span className="text-white font-bold">{data?.cycle || 0}</span>
              </div>
            </div>
          </div>

          {/* CRITICAL ALERTS */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl max-h-[600px] overflow-y-auto">
            <h3 className="text-slate-400 text-xs font-bold tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-400" /> CRITICAL ALERTS
            </h3>
            
            {criticalSensors.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                <p className="text-sm">All systems nominal</p>
              </div>
            ) : (
              <div className="space-y-3">
                {criticalSensors.map(([key, status]) => (
                  <div key={key} className="p-4 rounded-xl bg-red-900/20 border border-red-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold text-white">{status.config.label}</span>
                      <span className="text-xs px-2 py-1 rounded bg-red-500 text-white font-bold">CRITICAL</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-slate-400">Max: {status.config.max} {status.config.unit}</span>
                      <span className="text-xl font-bold text-red-400">{status.value.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 text-xs text-red-400 font-mono">
                      ⚠ +{status.deviation.toFixed(1)}% OVER LIMIT
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAILURE CAUSES */}
          {data?.failure_reasons && data.failure_reasons.length > 0 && (
            <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-slate-400 text-xs font-bold tracking-widest mb-4">PRIMARY FAILURE MODES</h3>
              <div className="space-y-2">
                {data.failure_reasons.map((reason: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-red-900/10 border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5"></div>
                    <span className="text-sm text-slate-200">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SENSOR VISUALIZATIONS */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          
          {/* SENSOR GROUP TABS */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-2 flex gap-2 overflow-x-auto">
            {Object.keys(SENSOR_GROUPS).map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeGroup === group 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {SENSOR_GROUPS[group as keyof typeof SENSOR_GROUPS].title}
              </button>
            ))}
          </div>

          {/* SENSOR GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(SENSOR_GROUPS[activeGroup as keyof typeof SENSOR_GROUPS].sensors).map(([key, config]) => {
              const status = sensorStatuses[key];
              if (!status) return null;

              return (
                <div key={key} className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-white font-bold">{config.label}</h4>
                      <p className="text-xs text-slate-500">{config.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {status.trend === 'up' && <TrendingUp className="text-red-400 h-5 w-5" />}
                      {status.trend === 'down' && <TrendingDown className="text-green-400 h-5 w-5" />}
                      {status.trend === 'stable' && <Minus className="text-slate-500 h-5 w-5" />}
                      <span className={`text-2xl font-black ${
                        status.status === 'Critical' ? 'text-red-400' : 
                        status.status === 'Warning' ? 'text-yellow-400' : 'text-emerald-400'
                      }`}>
                        {status.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* 🔧 FIX: Use flattened chartData with correct dataKey */}
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.slice(-30)} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="#1e293b" vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="cycle" hide={true} />
                        <YAxis domain={[config.min, config.max]} hide={true} />
                        <Tooltip
                          contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}}
                          labelFormatter={(label) => `Cycle: ${label}`}
                          formatter={(value: any) => (typeof value === 'number' ? value.toFixed(2) : value)}
                        />
                        <Line
                          type="monotone"
                          dataKey={key}
                          stroke={config.color}
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-3 flex justify-between text-xs text-slate-500">
                    <span>Min: {config.min}</span>
                    <span>Max: {config.max}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RUL DEGRADATION CURVE */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-slate-400 text-xs font-bold tracking-widest mb-4">PREDICTED DEGRADATION CURVE</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {/* 🔧 FIX: Use chartData instead of history */}
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="rulGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                  <XAxis dataKey="cycle" stroke="#475569" tick={{fontSize: 12}}/>
                  <YAxis domain={[0, 150]} stroke="#475569" tick={{fontSize: 12}}/>
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}}
                    labelStyle={{color: '#94a3b8'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="RUL" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    fill="url(#rulGrad)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* NASA ABBREVIATIONS FOOTER */}
      <div className="mt-4 backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <h4 className="text-slate-400 text-xs font-bold tracking-widest mb-3">NASA C-MAPSS ABBREVIATIONS</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(NASA_ABBREVIATIONS).map(([abbr, full]) => (
            <div key={abbr} className="text-xs">
              <span className="text-blue-400 font-bold">{abbr}</span>
              <span className="text-slate-500"> = {full}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
