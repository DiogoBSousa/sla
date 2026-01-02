
import React from 'react';
import { useStore } from '../store/useStore';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const AgeVerification: React.FC = () => {
  const { isAgeVerified, setAgeVerified } = useStore();

  if (isAgeVerified) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Age Verification Required</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          To access professional anatomical drawing references and full character editing features, you must confirm that you are at least 18 years of age.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setAgeVerified(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/40"
          >
            I am 18+ years old
          </button>
          <button 
            onClick={() => window.location.href = 'https://google.com'}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
          >
            Exit Studio
          </button>
        </div>
        
        <div className="mt-8 flex items-start gap-2 text-left p-3 bg-slate-800/50 rounded-lg">
          <AlertCircle size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-slate-500">
            Professional anatomical references are provided for artistic study only. We prioritize maintaining a high-quality, safe environment for creatives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;
