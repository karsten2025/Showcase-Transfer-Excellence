import React from 'react';
import { Check, AlertTriangle, XCircle } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';

export const BenefitMatrix: React.FC = () => {
  const aufstockungNetto = useDataStore((s) => s.aufstockungNetto);
  const nettoProzent = Math.round(aufstockungNetto * 100);

  const rows = [
    {
      benefit: 'Monatliches Netto',
      kündigung: '60% Arbeitslosengeld (unsicher)',
      transfer: `~${nettoProzent}% Netto-Garantie (durch Aufstockung)`,
      kündigungIcon: 'warning' as const,
      transferIcon: 'check' as const,
    },
    {
      benefit: 'Abfindungs-Sicherheit',
      kündigung: 'Abfindung ungewiss (Prozessrisiko)',
      transfer: 'Garantierte Abfindung + Sprinter-Prämie',
      kündigungIcon: 'danger' as const,
      transferIcon: 'check' as const,
    },
    {
      benefit: 'Weiterbildungs-Budget',
      kündigung: 'Eigenfinanzierung / AA-Gutschein',
      transfer: 'Volles Budget für Up-Skilling (Speed-Profiling)',
      kündigungIcon: 'warning' as const,
      transferIcon: 'check' as const,
    },
    {
      benefit: 'Rechtsfrieden',
      kündigung: 'Harte Kündigung, Klage-Risiko',
      transfer: 'Rechtssichere Brücke (Klageverzicht)',
      kündigungIcon: 'danger' as const,
      transferIcon: 'check' as const,
    },
    {
      benefit: 'Status',
      kündigung: '"Arbeitslos" im Lebenslauf',
      transfer: '"In Transfer" / Weiterbildung',
      kündigungIcon: 'warning' as const,
      transferIcon: 'check' as const,
    },
  ];

  const IconKlage = ({ type }: { type: 'warning' | 'danger' }) =>
    type === 'danger' ? (
      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
    );

  return (
    <div
      className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      <div className="relative z-10">
        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">
          Benefit-Matrix
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
          <table className="w-full table-auto text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="sticky left-0 z-10 bg-slate-50 text-left py-2 pr-4 font-bold text-slate-700 uppercase tracking-tight">
                  Kategorie
                </th>
                <th className="text-left py-2 px-4 font-bold text-slate-600 uppercase tracking-tight">
                  Klassische Kündigung & Klage
                </th>
                <th className="text-left py-2 pl-4 font-bold text-emerald-700 uppercase tracking-tight">
                  Transfer-Navigations-Modell
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="sticky left-0 z-10 bg-slate-50 py-3 pr-4 font-medium text-slate-800">{row.benefit}</td>
                <td className="py-3 px-4">
                  <div className="flex items-start gap-2">
                    <IconKlage type={row.kündigungIcon} />
                    <span className="text-slate-600">{row.kündigung}</span>
                  </div>
                </td>
                <td className="py-3 pl-4">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800 font-medium">{row.transfer}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
