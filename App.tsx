
import React from 'react';
import Viewport3D from './components/Viewport3D';
import Sidebar from './components/Sidebar';
import AgeVerification from './components/AgeVerification';
import { HelpCircle, Info } from 'lucide-react';

function App() {
  return (
    <div className="flex h-screen w-screen bg-[#0f172a] text-white overflow-hidden selection:bg-blue-500/30">
      <AgeVerification />
      
      {/* Sidebar - Controls */}
      <Sidebar />

      {/* Main Viewport */}
      <main className="flex-1 relative flex flex-col">
        {/* Top Navbar */}
        <header className="absolute top-0 left-0 right-0 p-4 z-10 pointer-events-none flex justify-between items-start">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-3 py-1.5 rounded-full pointer-events-auto flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Pose Engine V2.4 Active
          </div>
          
          <div className="flex gap-2 pointer-events-auto">
            <button className="p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-full text-slate-400 hover:text-white transition-colors" title="How to use">
              <HelpCircle size={20} />
            </button>
            <button className="p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-full text-slate-400 hover:text-white transition-colors" title="App Info">
              <Info size={20} />
            </button>
          </div>
        </header>

        {/* 3D Scene */}
        <div className="flex-1">
          <Viewport3D />
        </div>

        {/* Viewport Overlay Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/80 backdrop-blur-lg border border-slate-700 p-2 rounded-2xl shadow-2xl z-10">
          <button className="px-4 py-2 hover:bg-slate-800 rounded-xl transition-colors text-xs font-semibold text-slate-300">Orbit</button>
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          <button className="px-4 py-2 hover:bg-slate-800 rounded-xl transition-colors text-xs font-semibold text-slate-300">Pan</button>
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          <button className="px-4 py-2 hover:bg-slate-800 rounded-xl transition-colors text-xs font-semibold text-slate-300">Zoom</button>
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors text-xs font-bold text-white shadow-lg shadow-blue-900/20">Snapshot</button>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-6 right-6 text-[10px] text-slate-500 font-mono text-right pointer-events-none">
          FPS: 60<br />
          VERTICES: 12.4K<br />
          POSE_ID: DX_992
        </div>
      </main>
    </div>
  );
}

export default App;
