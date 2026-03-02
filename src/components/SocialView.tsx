import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDataStore } from '../store/useDataStore';

interface SocialViewProps {
  employees: any[];
}

const formatKachelValue = (value: number | string, isLoading: boolean) => {
  if (isLoading) return 'Lade Daten...';
  if (typeof value === 'number' && Number.isNaN(value)) return '—';
  return String(value);
};

export const SocialView: React.FC<SocialViewProps> = ({ employees }) => {
  const getMetrics = useDataStore((s) => s.getMetrics);
  const employeeCount = useDataStore((s) => s.employees.length);
  const metrics = getMetrics();
  const isLoading = employeeCount === 0;

  const histogram = useMemo(() => {
    const ageDistribution: Record<string, number> = {
      '20-29': 0, '30-39': 0, '40-49': 0, '50-59': 0, '60+': 0
    };
    employees.forEach((emp) => {
      if (emp.Alter < 30) ageDistribution['20-29']++;
      else if (emp.Alter < 40) ageDistribution['30-39']++;
      else if (emp.Alter < 50) ageDistribution['40-49']++;
      else if (emp.Alter < 60) ageDistribution['50-59']++;
      else ageDistribution['60+']++;
    });
    return Object.entries(ageDistribution).map(([name, count]) => ({ name, count }));
  }, [employees]);

  const stats = {
    tgPotential: metrics.tgPotential,
    haertefaelle: metrics.exklusion,
    vermittelt: metrics.vermittelt,
    avgAge: metrics.durchschnittsAlter,
    avgSkill: metrics.averageSkillIndex,
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards – dynamisch aus useDataStore.getMetrics() */}
      <div className="grid grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">TG-Potential</h3>
          <p className="text-3xl font-light text-slate-900">{formatKachelValue(stats.tgPotential, isLoading)}</p>
          <p className="text-sm text-slate-500 mt-2">Mitarbeiter für Transfer</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Exklusion (Härtefälle)</h3>
          <p className="text-3xl font-light text-slate-900">{formatKachelValue(stats.haertefaelle, isLoading)}</p>
          <p className="text-sm text-slate-500 mt-2">Vorruhestand / Rente</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Vermittelt</h3>
          <p className="text-3xl font-light text-emerald-600">{formatKachelValue(stats.vermittelt, isLoading)}</p>
          <p className="text-sm text-slate-500 mt-2">Erfolgreich in neuen Job</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Ø Alter</h3>
          <p className="text-3xl font-light text-slate-900">{formatKachelValue(stats.avgAge, isLoading)}</p>
          <p className="text-sm text-slate-500 mt-2">Jahre</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Skill-Index</h3>
          <p className="text-3xl font-light text-slate-900">{formatKachelValue(stats.avgSkill, isLoading)}</p>
          <p className="text-sm text-slate-500 mt-2">Qualifizierungspotential</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800 mb-6">Altersstruktur (Histogramm)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogram} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {histogram.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === '60+' ? '#f43f5e' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
