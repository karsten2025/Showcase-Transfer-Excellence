import React from 'react';
import { X, FileText, Rocket, BarChart3, DollarSign, Users, Cpu, Download } from 'lucide-react';

interface StrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StrategyModal: React.FC<StrategyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Dummy: Öffnet vorerst ein leeres Fenster oder könnte später auf PDF verlinken
    window.open('#', '_blank');
  };

  return (
    <>
      {/* Backdrop mit Frosted Glass */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div
        className="fixed inset-4 md:inset-12 lg:inset-16 z-50 overflow-y-auto rounded-xl border border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-2xl"
        role="dialog"
        aria-labelledby="strategy-modal-title"
      >
        <div className="p-8 md:p-12 lg:p-16">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 id="strategy-modal-title" className="text-3xl md:text-4xl font-serif italic text-slate-900 mb-2">
                Transfergesellschaft 2.0
              </h2>
              <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">
                Strategische Steuerung & Operative Exzellenz in der Transformation
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Modal schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Meta */}
          <div className="mb-12 pb-8 border-b border-slate-200">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Vorgelegt von:</span> Karsten Zenk
            </p>
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-semibold">Fokus:</span> Komplexitätsnutzung | Datenbasierte Empathie | Remanenz-Optimierung
            </p>
            <p className="text-sm font-mono text-slate-500 mt-4 italic">
              Mission: Transformation durch Klarheit — Nutzung von Komplexität am Beispiel von 2.500 individuellen Erwerbsbiografien in regulierten Industrien/Systemen.
            </p>
          </div>

          {/* 1. Der Hebel (The Core) */}
          <section className="mb-12">
            <h3 className="text-xl font-serif italic text-slate-900 mb-6 flex items-center gap-3">
              <FileText className="w-5 h-5 text-red-600" />
              1. Der Hebel (The Core)
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-100">
                <Rocket className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Speed-Profiling:</span>
                  <span className="text-slate-600 ml-2">Wer ist „Ready for Market“?</span>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-100">
                <BarChart3 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Live-Simulation:</span>
                  <span className="text-slate-600 ml-2">Cashflow & Sozialpläne per Slider.</span>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-100">
                <DollarSign className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Remanenz-Check:</span>
                  <span className="text-slate-600 ml-2">Kostensenkung durch aktive Vermittlung.</span>
                </div>
              </li>
            </ul>
          </section>

          {/* 2. Stakeholder Value */}
          <section className="mb-12">
            <h3 className="text-xl font-serif italic text-slate-900 mb-6 flex items-center gap-3">
              <Users className="w-5 h-5 text-red-600" />
              2. Stakeholder Value
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-100">
                <span className="text-xs font-mono font-bold text-red-600 uppercase shrink-0">Vorstand</span>
                <p className="text-slate-600">Liquiditätssicherung durch kürzere TG-Laufzeiten.</p>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-100">
                <span className="text-xs font-mono font-bold text-red-600 uppercase shrink-0">Betriebsrat</span>
                <p className="text-slate-600">Transparente & faire Skill-Matching-Logik.</p>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-100">
                <span className="text-xs font-mono font-bold text-red-600 uppercase shrink-0">PMO</span>
                <p className="text-slate-600">Radikale Reduktion von administrativem „Noise“.</p>
              </li>
            </ul>
          </section>

          {/* 3. Methodik: CPMAI */}
          <section className="mb-12">
            <h3 className="text-xl font-serif italic text-slate-900 mb-6 flex items-center gap-3">
              <Cpu className="w-5 h-5 text-red-600" />
              3. Methodik: CPMAI
            </h3>
            <div className="p-6 rounded-lg bg-slate-50/80 border border-slate-100">
              <p className="text-slate-600 leading-relaxed">
                Keine Experimente. Wir nutzen das <strong className="text-slate-800">Cognitive Project Management for AI</strong>, um diverse Datenformate (SAP, Cloud, PDFs, Excel, etc.) in operative PS auf die Straße zu übersetzen.
              </p>
            </div>
          </section>

          {/* Zitat */}
          <blockquote className="mb-12 pl-6 border-l-4 border-red-600 text-slate-600 italic">
            „Minimalismus ist die ultimative Form der Komplexitätsbeherrschung.“
          </blockquote>

          {/* Download Button */}
          <div className="pt-8 border-t border-slate-200">
            <button
              onClick={handleDownload}
              className="flex items-center gap-3 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-mono tracking-widest uppercase transition-colors rounded-lg"
            >
              <Download className="w-4 h-4" />
              Download PDF Summary
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
