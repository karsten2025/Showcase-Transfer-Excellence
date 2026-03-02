import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface HeuristicContent {
  heuristik: string;
  vorstand: string;
  betriebsrat: string;
  pmo: string;
}

interface VariableTooltipProps {
  label: string;
  content: HeuristicContent;
}

export const VariableTooltip: React.FC<VariableTooltipProps> = ({ label, content }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="group relative inline-flex items-center gap-1.5">
      <span>{label}</span>
      <button
        type="button"
        className="text-slate-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-label={`Info zu ${label}`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {visible && (
        <div
          className="absolute left-0 top-full mt-2 z-50 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-lg text-left"
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          <p className="text-xs font-semibold text-indigo-600 mb-2 italic">&bdquo;{content.heuristik}&ldquo;</p>
          <div className="space-y-2 text-xs text-slate-600">
            <div>
              <span className="font-medium text-slate-700">Vorstand:</span>
              <p>{content.vorstand}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Betriebsrat:</span>
              <p>{content.betriebsrat}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">PMO:</span>
              <p>{content.pmo}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
