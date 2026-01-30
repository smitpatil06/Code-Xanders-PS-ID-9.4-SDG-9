export default function Landing({ onEnter }: { onEnter: () => void }) {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-10 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <div className="text-sm text-blue-400 font-bold mb-2">AegisFlow</div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Shielding Assets Through Data Velocity.</h1>
            <p className="text-slate-300 mb-6">AegisFlow transforms raw sensor streams into actionable maintenance intelligence. We predict the Remaining Useful Life (RUL) of critical components with industry-leading precision.</p>

            <div className="flex gap-3 items-center">
              <button
                onClick={onEnter}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-md"
              >
                Enter Dashboard
              </button>
              <button
                onClick={() => window.open('https://github.com/smitpatil06/Code-Xanders-PS-ID-9.4-SDG-9', '_blank')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-lg"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="flex-1 text-sm text-slate-400">
            <div className="bg-slate-800/40 p-6 rounded-xl">
              <h3 className="text-slate-100 font-bold mb-2">Project</h3>
              <p className="mb-3">Team name: <span className="text-blue-400 font-semibold">Code Xanders</span></p>
              <p className="mb-2">Project made by:</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Vaishnav Raut</li>
                <li>Smit Patil</li>
                <li>Vaidehee Daf</li>
                <li>Yukti Raurkar</li>
              </ul>
              <div className="text-sm">
                <div className="mb-1">
                  <span className="text-slate-400 font-bold">PS ID:</span>
                  <span className="font-mono text-blue-400 text-lg font-semibold ml-2">9.4</span>
                </div>
                <div className="text-xs text-slate-500">Design ML software predicting factory equipment failures using sensor data, predictive maintenance startup.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
