import { useState } from 'react';
import Dashboard from "./components/Dashboard_Premium";
import Landing from "./components/Landing";
import './index.css';

function App() {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {showLanding ? (
        <Landing onEnter={() => setShowLanding(false)} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;