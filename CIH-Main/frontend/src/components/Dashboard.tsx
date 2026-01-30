import { useMemo, useState } from 'react';
import { useMachineStream } from '../hooks/UseMachineStream';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { AlertTriangle, CheckCircle, Activity, Zap, Gauge, RotateCcw, Upload } from 'lucide-react';
import UploadAnalysis from './UploadAnalysis';

// THRESHOLDS - Based on your training data analysis
const SAFE_LIMITS = {
  LPC_Outlet_Temp: { max: 644, label: "LPC Temp" },      
  Combustion_Pressure: { max: 554, label: "Combustion Press" }, 
  LPT_Coolant_Bleed: { max: 23.35, label: "Vibration" },    
  LPT_Outlet_Temp: { max: 1410, label: "LPT Temp" }            
};

export default function Dashboard() {
  const { data, history, isConnected } = useMachineStream();
  const [selectedEngine, setSelectedEngine] = useState(34);
  const [showUpload, setShowUpload] = useState(false);

  // Function to switch engines
  const switchEngine = async (id: number) => {
    setSelectedEngine(id);
    await fetch('http://localhost:8000/set_engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit_id: id })
    });
  };

  const diagnostics = useMemo(() => {
    if (!data || !data.sensors) return [];
    
    return Object.entries(SAFE_LIMITS).map(([key, config]) => {
      const currentVal = data.sensors[key] || 0;
      const deviation = currentVal - config.max;
      const isCritical = deviation > 0;
      
      return {
        id: key,
        name: config.label,
        value: currentVal,
        limit: config.max,
        status: isCritical ? 'Critical' : 'Normal',
        deviation: isCritical ? Math.round((deviation / config.max) * 100) : 0
      };
    }).sort((a, b) => b.deviation - a.deviation);
  }, [data]);

  // Show upload page
  if (showUpload) {
    return <UploadAnalysis onBack={() => setShowUpload(false)} />;
  }

  // Connecting state
  if (!isConnected) {
    return (
      <div className="flex h-screen bg-slate-950 items-center justify-center text-blue-500 font-mono">
        <div className="text-center">
          <Activity className="animate-spin h-12 w-12 mx-auto mb-4" />
          <h1 className="text-xl tracking-widest">CONNECTING TO AEGIS CORE...</h1>
        </div>
      </div>
    );
  }

  const statusColor = data?.status === 'Critical' ? 'text-red-500' : 
                      data?.status === 'Warning' ? 'text-yellow-500' : 'text-emerald-500';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Zap className="text-blue-500 fill-blue-500" /> AEGIS<span className="text-slate-500">FLOW</span>
          </h1>
          <div className="flex gap-4 mt-2">
            {/* ENGINE SELECTOR */}
            <select 
              className="bg-slate-800 text-sm p-2 rounded border border-slate-700 outline-none"
              value={selectedEngine}
              onChange={(e) => switchEngine(Number(e.target.value))}
            >
              <option value="34">Unit 34 (Perfect Failure Curve)</option>
              <option value="1">Unit 1 (Healthy Start)</option>
              <option value="50">Unit 50 (Random Pattern)</option>
              <option value="100">Unit 100 (Critical Early)</option>
            </select>

            <button 
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded transition"
            >
              <Upload size={14} /> BATCH ANALYSIS
            </button>
          </div>
        </div>

        {/* STATUS BADGE OR REPLAY */}
        {data?.finished ? (
           <button 
             onClick={() => switchEngine(selectedEngine)}
             className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-red-900/50 animate-pulse"
           >
             <RotateCcw /> ENGINE FAILURE - CLICK TO REPLAY
           </button>
        ) : (
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full border bg-slate-900/50 backdrop-blur border-slate-700`}>
            {data?.status === 'Critical' ? <AlertTriangle className="text-red-500" /> : <CheckCircle className="text-emerald-500" />}
            <span className={`text-2xl font-bold ${statusColor}`}>{data?.status}</span>
          </div>
        )}
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-6 h-[80vh]">
        
        {/* COLUMN 1: RUL & DIAGNOSTICS */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-6">
          
          {/* RUL CARD */}
          <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${data?.status === 'Critical' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <h3 className="text-slate-400 text-xs font-bold tracking-widest mb-4">REMAINING USEFUL LIFE</h3>
            
            <div className="flex flex-col items-center justify-center h-40">
              <div className="text-8xl font-bold text-white tracking-tighter">
                {Math.round(data?.RUL || 0)}
              </div>
              <span className="text-slate-500 text-lg">CYCLES</span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>AI CONFIDENCE</span>
                <span>94.2%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[94%]"></div>
              </div>
            </div>
          </div>

          {/* FAILURE ANALYSIS */}
          <div className="flex-[2] bg-slate-900/50 border border-slate-800 rounded-2xl p-6 overflow-y-auto">
            <h3 className="text-slate-400 text-xs font-bold tracking-widest mb-4 flex items-center gap-2">
              <Activity size={14} /> ROOT CAUSE ANALYSIS
            </h3>
            
            {/* Failure Reasons */}
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-400 mb-2">PRIMARY FAILURE MODES:</div>
              <div className="space-y-1">
                {data?.failure_reasons?.map((reason: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <span className="text-slate-200">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensor Diagnostics */}
            <div className="text-xs text-slate-400 mb-2">SENSOR STATUS:</div>
            <div className="flex flex-col gap-3">
              {diagnostics.map((sensor) => (
                <div key={sensor.id} className={`p-3 rounded-lg border ${sensor.status === 'Critical' ? 'bg-red-900/20 border-red-500/50' : 'bg-slate-800/30 border-slate-700'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-200">{sensor.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${sensor.status === 'Critical' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                      {sensor.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-500">Limit: {sensor.limit}</span>
                    <span className={`text-lg font-mono ${sensor.status === 'Critical' ? 'text-red-400' : 'text-slate-300'}`}>
                      {sensor.value.toFixed(1)}
                    </span>
                  </div>
                  {sensor.status === 'Critical' && (
                    <p className="text-xs text-red-400 mt-2 font-mono">
                      ⚠ +{sensor.deviation}% OVER LIMIT
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: GRAPHS */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
          
          {/* SENSOR FUSION GRAPH */}
          <div className="flex-[2] bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-slate-400 text-xs font-bold tracking-widest mb-4 flex gap-2">
              <Gauge size={16}/> MULTI-SENSOR FUSION
            </h3>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradPress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                  <XAxis dataKey="cycle" stroke="#475569" tick={{fontSize: 12}}/>
                  <YAxis stroke="#475569" tick={{fontSize: 12}} domain={['auto', 'auto']}/>
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc'}}/>
                  
                  {/* Temperature */}
                  <Area 
                    type="monotone" 
                    dataKey="sensors.LPC_Outlet_Temp" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#gradTemp)" 
                    name="LPC Temperature"
                    strokeWidth={2}
                  />
                  
                  {/* Pressure */}
                  <Area 
                    type="monotone" 
                    dataKey="sensors.Combustion_Pressure" 
                    stroke="#10B981" 
                    fillOpacity={1}
                    fill="url(#gradPress)"
                    strokeWidth={2} 
                    name="Combustion Pressure"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DEGRADATION TREND */}
          <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-slate-400 text-xs font-bold tracking-widest mb-4">PREDICTED DEGRADATION CURVE</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                  <XAxis dataKey="cycle" stroke="#475569" tick={{fontSize: 12}}/>
                  <YAxis domain={[0, 150]} stroke="#475569" tick={{fontSize: 12}}/>
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}}/>
                  <Line 
                    type="monotone" 
                    dataKey="RUL" 
                    stroke="#F59E0B" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Remaining Cycles"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}