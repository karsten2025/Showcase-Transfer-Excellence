import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GmbHMatrix } from '../data/parser';
import { TransformationSim } from './TransformationSim';

interface OperationalViewProps {
  employees: any[];
  matrix: GmbHMatrix[];
}

export const OperationalView: React.FC<OperationalViewProps> = ({ employees, matrix }) => {
  const stats = useMemo(() => {
    const byGmbH: Record<string, { count: number; total: number; abfindung: number; remanenz: number }> = {};

    employees.forEach(emp => {
      if (!byGmbH[emp.GmbH]) {
        byGmbH[emp.GmbH] = { count: 0, total: 0, abfindung: 0, remanenz: 0 };
      }
      byGmbH[emp.GmbH].count++;
      byGmbH[emp.GmbH].total += emp.Calculated_Total ?? 0;
      byGmbH[emp.GmbH].abfindung += emp.Calculated_Abfindung ?? 0;
      byGmbH[emp.GmbH].remanenz += emp.Calculated_Remanenz ?? 0;
    });

    const gmbhData = Object.entries(byGmbH).map(([name, data]) => ({
      name,
      count: data.count,
      total: data.total / 1000000,
      abfindung: data.abfindung / 1000000,
      remanenz: data.remanenz / 1000000,
    }));

    const totalEmployees = employees.length;
    const totalCost = employees.reduce((sum, e) => sum + (e.Calculated_Total ?? 0), 0);

    return {
      gmbhData,
      totalEmployees,
      totalCost,
      gmbhCount: Object.keys(byGmbH).length,
    };
  }, [employees]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* ABM-Light: Mitarbeiter-Navigation */}
      <TransformationSim />

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">GmbHs</h3>
          <p className="text-3xl font-light text-slate-900">{stats.gmbhCount}</p>
          <p className="text-sm text-slate-500 mt-2">Betroffene Gesellschaften</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Mitarbeiter gesamt</h3>
          <p className="text-3xl font-light text-slate-900">{stats.totalEmployees}</p>
          <p className="text-sm text-slate-500 mt-2">In Restrukturierung</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Gesamtkosten</h3>
          <p className="text-3xl font-light text-slate-900">{formatCurrency(stats.totalCost)}</p>
          <p className="text-sm text-slate-500 mt-2">Abfindung + Remanenz</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Ø pro MA</h3>
          <p className="text-3xl font-light text-slate-900">{formatCurrency(stats.totalCost / stats.totalEmployees)}</p>
          <p className="text-sm text-slate-500 mt-2">Durchschnittliche Kosten</p>
        </div>
      </div>

      {/* Chart: Kosten pro GmbH */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800 mb-6">Kosten pro GmbH (in Mio. €)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.gmbhData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value.toFixed(2)} Mio. €`, '']}
              />
              <Bar dataKey="total" name="Gesamt" radius={[4, 4, 0, 0]}>
                {stats.gmbhData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabelle: Mitarbeiter pro GmbH */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800 mb-4">Übersicht pro GmbH</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                <th className="pb-3 font-medium">GmbH</th>
                <th className="pb-3 font-medium text-right">MA</th>
                <th className="pb-3 font-medium text-right">Abfindung</th>
                <th className="pb-3 font-medium text-right">Remanenz</th>
                <th className="pb-3 font-medium text-right">Gesamt</th>
              </tr>
            </thead>
            <tbody>
              {stats.gmbhData.map(row => (
                <tr key={row.name} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-slate-800">{row.name}</td>
                  <td className="py-3 text-right text-slate-600">{row.count}</td>
                  <td className="py-3 text-right text-slate-600">{row.abfindung.toFixed(2)} Mio. €</td>
                  <td className="py-3 text-right text-slate-600">{row.remanenz.toFixed(2)} Mio. €</td>
                  <td className="py-3 text-right font-medium text-slate-800">{row.total.toFixed(2)} Mio. €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
