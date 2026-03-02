import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SocialViewProps {
  employees: any[];
}

export const SocialView: React.FC<SocialViewProps> = ({ employees }) => {
  const stats = useMemo(() => {
    let haertefaelle = 0;
    let tgPotential = 0;
    let avgAge = 0;
    let avgSkill = 0;

    const ageDistribution: Record<string, number> = {
      '20-29': 0, '30-39': 0, '40-49': 0, '50-59': 0, '60+': 0
    };

    employees.forEach(emp => {
      if (emp.Status_Logik === 'Exklusion_Vorruhestand') haertefaelle++;
      else tgPotential++;

      avgAge += emp.Alter;
      avgSkill += emp.Skill_Index;

      if (emp.Alter < 30) ageDistribution['20-29']++;
      else if (emp.Alter < 40) ageDistribution['30-39']++;
      else if (emp.Alter < 50) ageDistribution['40-49']++;
      else if (emp.Alter < 60) ageDistribution['50-59']++;
      else ageDistribution['60+']++;
    });

    const total = employees.length;

    return {
      haertefaelle,
      tgPotential,
      vermittelt: Math.floor(tgPotential * 0.15), // Placeholder for Vermittelt (15% of TG Potential)
      avgAge: (avgAge / total).toFixed(1),
      avgSkill: (avgSkill / total).toFixed(2),
      histogram: Object.entries(ageDistribution).map(([name, count]) => ({ name, count }))
    };
  }, [employees]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">TG-Potential</h3>
          <p className="text-3xl font-light text-slate-900">{stats.tgPotential}</p>
          <p className="text-sm text-slate-500 mt-2">Mitarbeiter für Transfer</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Exklusion (Härtefälle)</h3>
          <p className="text-3xl font-light text-slate-900">{stats.haertefaelle}</p>
          <p className="text-sm text-slate-500 mt-2">Vorruhestand / Rente</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Vermittelt</h3>
          <p className="text-3xl font-light text-emerald-600">{stats.vermittelt}</p>
          <p className="text-sm text-slate-500 mt-2">Erfolgreich in neuen Job</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Ø Alter</h3>
          <p className="text-3xl font-light text-slate-900">{stats.avgAge}</p>
          <p className="text-sm text-slate-500 mt-2">Jahre</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Skill-Index</h3>
          <p className="text-3xl font-light text-slate-900">{stats.avgSkill}</p>
          <p className="text-sm text-slate-500 mt-2">Qualifizierungspotential</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800 mb-6">Altersstruktur (Histogramm)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.histogram} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stats.histogram.map((entry, index) => (
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
