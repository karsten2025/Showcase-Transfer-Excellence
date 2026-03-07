import React from 'react';
import { useDataStore } from '../store/useDataStore';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const WeightingPanel: React.FC = () => {
  const securityBias = useDataStore((s) => s.securityBias);
  const innovationDrive = useDataStore((s) => s.innovationDrive);
  const socialPeerPressure = useDataStore((s) => s.socialPeerPressure);
  const setSecurityBias = useDataStore((s) => s.setSecurityBias);
  const setInnovationDrive = useDataStore((s) => s.setInnovationDrive);
  const setSocialPeerPressure = useDataStore((s) => s.setSocialPeerPressure);
  const resetWeightingsToDefaults = useDataStore((s) => s.resetWeightingsToDefaults);

  const total = securityBias + innovationDrive + socialPeerPressure || 1;
  const sPct = (securityBias / total) * 100;
  const iPct = (innovationDrive / total) * 100;
  const pPct = (socialPeerPressure / total) * 100;

  const SliderRow = ({
    label,
    short,
    value,
    onChange,
    color,
    tooltipText,
  }: {
    label: string;
    short: string;
    value: number;
    onChange: (v: number) => void;
    color: string;
    tooltipText?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center gap-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 shrink">
          <span className="text-xs font-medium text-slate-700 truncate">{label}</span>
          {tooltipText && (
            <InfoTooltip text={tooltipText} ariaLabel={`Info: ${label}`} />
          )}
        </div>
        <span className="text-xs font-mono text-slate-500 tabular-nums shrink-0">{value.toFixed(2)}</span>
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <div
          className="w-12 h-2 rounded-full overflow-hidden flex shrink-0 bg-slate-100"
          title={`${short}: ${(value * 100).toFixed(0)}%`}
        >
          <div
            className="h-full transition-all duration-150"
            style={{ width: `${value * 100}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Agenten-Gewichtung
        </h3>
      </div>

      <SliderRow
        label="Security Bias (S)"
        short="S"
        value={securityBias}
        onChange={setSecurityBias}
        color="#6366f1"
        tooltipText="Gibt an, wie stark Agenten (Mitarbeiter) an Sicherheit und dem Status Quo festhalten. Ein hoher Wert verlangsamt den Wechselwillen und simuliert das Verharren im gewohnten Umfeld (Montan-Stahl)."
      />
      <p className="text-[10px] text-slate-500 -mt-2">
        Verweildauer im Status &apos;Suffer&apos;
      </p>

      <SliderRow
        label="Innovation Drive (I)"
        short="I"
        value={innovationDrive}
        onChange={setInnovationDrive}
        color="#10b981"
        tooltipText="Misst die Anziehungskraft neuer Chancen. Ein hoher Wert simuliert eine Belegschaft, die proaktiv nach Qualifizierung und neuen Job-Perspektiven (Joy) sucht."
      />
      <p className="text-[10px] text-slate-500 -mt-2">
        Geschwindigkeit Richtung &apos;Joy&apos;
      </p>

      <SliderRow
        label="Social Peer Pressure (P)"
        short="P"
        value={socialPeerPressure}
        onChange={setSocialPeerPressure}
        color="#f59e0b"
        tooltipText="Simuliert den soziologischen Effekt des Mitläuferverhaltens. Ein hoher Wert bedeutet, dass Agenten ihre Entscheidung stark davon abhängig machen, wie viele Kollegen bereits den Transformations-Vertrag unterschrieben haben."
      />
      <p className="text-[10px] text-slate-500 -mt-2">
        Effekt: &apos;Ich unterschreibe erst, wenn Kollegen es tun&apos;
      </p>

      {/* Machtverteilung */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
          Machtverteilung
        </p>
        <div className="h-2 rounded-full overflow-hidden flex bg-slate-100">
          <div
            className="h-full bg-indigo-500 transition-all duration-200"
            style={{ width: `${sPct}%` }}
            title={`S: ${sPct.toFixed(0)}%`}
          />
          <div
            className="h-full bg-emerald-500 transition-all duration-200"
            style={{ width: `${iPct}%` }}
            title={`I: ${iPct.toFixed(0)}%`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-200"
            style={{ width: `${pPct}%` }}
            title={`P: ${pPct.toFixed(0)}%`}
          />
        </div>
      </div>

      <button
        onClick={resetWeightingsToDefaults}
        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Expert Defaults wiederherstellen
      </button>
    </div>
  );
};
