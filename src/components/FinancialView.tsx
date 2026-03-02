import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { Cashflow } from '../data/parser';
import { useDataStore } from '../store/useDataStore';

interface FinancialViewProps {
  cashflow: Cashflow[];
}

export const FinancialView: React.FC<FinancialViewProps> = ({ cashflow }) => {
  const baseAbfindungsFaktor = useDataStore(s => s.baseAbfindungsFaktor);
  const employeeCount = useDataStore(s => s.employees.length);
  const getFinancialBreakdown = useDataStore(s => s.getFinancialBreakdown);
  const breakdown = getFinancialBreakdown();

  const quarterlyData = useMemo(() => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const staticTotalAbfindung = cashflow.reduce((sum, c) => sum + c.Abfindungen, 0) || 1;
    const staticTotalRemanenz = cashflow.reduce((sum, c) => sum + c.Remanenz, 0) || 1;

    return quarters.map(q => {
      const qData = cashflow.filter(c => c.Quartal === q);
      const staticAbfindungen = qData.reduce((sum, c) => sum + c.Abfindungen, 0);
      const staticRemanenz = qData.reduce((sum, c) => sum + c.Remanenz, 0);

      const dynamicAbfindungen = (staticAbfindungen / staticTotalAbfindung) * breakdown.abfindung;
      const dynamicRemanenz = (staticRemanenz / staticTotalRemanenz) * breakdown.remanenz;

      return {
        name: q,
        Abfindungen: dynamicAbfindungen / 1_000_000,
        Remanenz: dynamicRemanenz / 1_000_000,
        Total: (dynamicAbfindungen + dynamicRemanenz) / 1_000_000,
      };
    });
  }, [cashflow, breakdown.abfindung, breakdown.remanenz]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

  const isLoading = employeeCount === 0;
  const displayValue = (val: number, asCurrency = false) => {
    if (isLoading) return 'Lade Daten...';
    if (Number.isNaN(val)) return '—';
    return asCurrency ? formatCurrency(val) : String(val);
  };

  return (
    <div className="flex flex-col gap-6 min-h-0">
      {/* KPI-Kacheln – oben fixiert, responsives Grid */}
      <div className="sticky top-0 z-10 bg-slate-100 -mx-8 px-8 pt-0 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Gesamt Cashout</h3>
            <p className="text-2xl md:text-3xl font-light text-slate-900">{displayValue(breakdown.total, true)}</p>
            <div className="mt-2 md:mt-4 flex flex-wrap items-center gap-2 text-xs md:text-sm">
              <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Budget: 320 Mio. €</span>
              {breakdown.total > 320_000_000 && (
                <span className="text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded">Budget überschritten!</span>
              )}
            </div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">TG-Potential</h3>
            <p className="text-2xl md:text-3xl font-light text-slate-900">{displayValue(breakdown.tgPotential)}</p>
            <p className="text-xs md:text-sm text-slate-500 mt-2">Mitarbeiter für Transfer</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Abfindungen (Kumuliert)</h3>
            <p className="text-2xl md:text-3xl font-light text-slate-900">{displayValue(breakdown.abfindung, true)}</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Remanenzkosten (TG)</h3>
            <p className="text-2xl md:text-3xl font-light text-slate-900">{displayValue(breakdown.remanenz, true)}</p>
            <p className="text-xs md:text-sm text-slate-500 mt-2">Burn-Rate über 12 Monate</p>
          </div>
        </div>
      </div>

      {/* Chart – reagiert in Echtzeit auf Abfindungsfaktor */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm flex-1 min-h-0">
        <h3 className="text-base font-semibold text-slate-800 mb-4 md:mb-6">Cashflow Phasen (in Mio. €)</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={quarterlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value.toFixed(2)} Mio. €`, '']}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Abfindungen" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Remanenz" stackId="a" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="Total" stroke="#0f172a" strokeWidth={2} dot={{ r: 4, fill: '#0f172a' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
