import React from 'react';
import { ArrowLeft, HardHat, Construction } from 'lucide-react';

interface DeveloperViewProps {
  onBack: () => void;
}

export const DeveloperView: React.FC<DeveloperViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col items-center justify-center relative selection:bg-red-500 selection:text-white">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zum Portal
      </button>

      <div className="text-center max-w-2xl px-6">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <HardHat className="w-24 h-24 text-red-500" />
            <Construction className="w-12 h-12 text-slate-300 absolute -bottom-2 -right-2" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif italic mb-6">
          Under Construction
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-mono">
          Die Developer View wird aktuell aufgebaut. Hier entstehen in Kürze detaillierte Einblicke in die Datenpipelines, ETL-Prozesse und Compliance-Watchdogs.
        </p>

        <div className="inline-block border border-slate-800 bg-slate-900/50 px-6 py-4 rounded-sm">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Status: <span className="text-red-500 font-bold">In Development</span>
          </p>
        </div>
      </div>
    </div>
  );
};
