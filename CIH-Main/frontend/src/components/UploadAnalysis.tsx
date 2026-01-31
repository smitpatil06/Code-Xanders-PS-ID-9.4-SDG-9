import { useState } from 'react';
import { Upload, ArrowLeft, CheckCircle, AlertTriangle, TrendingDown, Download } from 'lucide-react';

interface ReportRow {
  engine_id: number;
  current_cycle: number;
  predicted_RUL: number;
  estimated_failure_cycle: number;
  status: string;
  failure_reason: string;
  confidence: number;
}

interface UploadAnalysisProps {
  onBack: () => void;
  token: string;
}

export default function UploadAnalysis({ onBack, token }: UploadAnalysisProps) {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/upload_test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setReport(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const csv = [
      ['Engine ID', 'Current Cycle', 'Predicted RUL', 'Est. Failure Cycle', 'Status', 'Failure Reason', 'Confidence %'],
      ...report.map(row => [
        row.engine_id,
        row.current_cycle,
        row.predicted_RUL,
        row.estimated_failure_cycle,
        row.status,
        row.failure_reason,
        row.confidence
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rul_analysis_report.csv';
    a.click();
  };

  const stats = report.length > 0 ? {
    total: report.length,
    critical: report.filter(r => r.status === 'Critical').length,
    warning: report.filter(r => r.status === 'Warning').length,
    healthy: report.filter(r => r.status === 'Healthy').length,
    avgRUL: Math.round(report.reduce((sum, r) => sum + r.predicted_RUL, 0) / report.length)
  } : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={16} /> Back to Live Dashboard
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Batch RUL Analysis</h1>
          <p className="text-slate-400">Upload NASA C-MAPSS test data to predict failure times for multiple engines</p>
        </div>

        {/* UPLOAD BOX */}
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-12 text-center mb-8">
          <Upload className="mx-auto text-blue-500 mb-4" size={48} />
          <p className="text-slate-400 mb-4">Drop your test file or click to browse</p>
          <input 
            type="file" 
            accept=".txt,.csv"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setError(null);
            }}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 mx-auto max-w-xs"
          />
          {file && (
            <div className="mt-4">
              <p className="text-slate-300 text-sm mb-3">Selected: {file.name}</p>
              <button 
                onClick={handleUpload}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-8 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Analyzing..." : "Run AI Analysis"}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-8 text-red-400">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* STATS SUMMARY */}
        {stats && (
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">TOTAL ENGINES</div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">CRITICAL</div>
              <div className="text-3xl font-bold text-red-400">{stats.critical}</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">WARNING</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.warning}</div>
            </div>
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">HEALTHY</div>
              <div className="text-3xl font-bold text-emerald-400">{stats.healthy}</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">AVG RUL</div>
              <div className="text-3xl font-bold text-blue-400">{stats.avgRUL}</div>
            </div>
          </div>
        )}

        {/* RESULTS TABLE */}
        {report.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Analysis Results</h2>
              <button 
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm py-2 px-4 rounded transition"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="p-4">Engine</th>
                    <th className="p-4">Current Cycle</th>
                    <th className="p-4">Predicted RUL</th>
                    <th className="p-4">Est. Failure</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Failure Reason</th>
                    <th className="p-4">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {report.map((row) => (
                    <tr key={row.engine_id} className="hover:bg-slate-800/50 transition">
                      <td className="p-4 font-mono text-blue-400">Unit-{row.engine_id}</td>
                      <td className="p-4 text-slate-300">{row.current_cycle}</td>
                      <td className="p-4">
                        <span className="font-bold text-white">{row.predicted_RUL}</span>
                        <span className="text-slate-500 text-sm ml-1">cycles</span>
                      </td>
                      <td className="p-4 text-slate-300">
                        Cycle {row.estimated_failure_cycle}
                      </td>
                      <td className="p-4">
                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold w-fit ${
                          row.status === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                          row.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {row.status === 'Critical' ? <AlertTriangle size={12}/> : 
                           row.status === 'Warning' ? <TrendingDown size={12}/> :
                           <CheckCircle size={12}/>}
                          {row.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-sm max-w-xs truncate" title={row.failure_reason}>
                        {row.failure_reason}
                      </td>
                      <td className="p-4 text-slate-300">{row.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {report.length === 0 && !loading && (
          <div className="text-center text-slate-500 py-12">
            <p>No analysis results yet. Upload a test file to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}