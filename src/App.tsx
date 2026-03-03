import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { DeveloperView } from './components/DeveloperView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useDataStore } from './store/useDataStore';
import type { Employee, RegulatoryFrame } from './store/useDataStore';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'stakeholder' | 'developer'>('landing');
  const setEmployees = useDataStore(s => s.setEmployees);

  useEffect(() => {
    const loadEmployees = async () => {
      const urls = ['/granular_ma_data_2500.csv', '/granular_ma_data_sample.csv'];
      let csvText = '';
      for (const url of urls) {
        const res = await fetch(url);
        if (res.ok) {
          csvText = await res.text();
          break;
        }
      }
      if (!csvText) {
        console.error('Keine Mitarbeiter-CSV gefunden.');
        return;
      }
      const parsed = Papa.parse<Record<string, unknown>>(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      const num = (v: unknown) => (typeof v === 'number' ? v : parseFloat(String(v ?? 0)) || 0);
      const int = (v: unknown) => (typeof v === 'number' ? Math.round(v) : parseInt(String(v ?? 0), 10) || 0);
      const toFrame = (r: Record<string, unknown>): RegulatoryFrame => {
        const m = String(r.Montan ?? '').toLowerCase() === 'true';
        return m ? 'extreme' : 'standard';
      };
      const employees: Employee[] = parsed.data.map((row) => ({
        MA_ID: int(row.MA_ID),
        GmbH: String(row.GmbH ?? ''),
        Alter: int(row.Alter),
        Dienstjahre: int(row.Dienstjahre),
        Brutto_Monat: num(row.Brutto_Monat),
        Skill_Index: num(row.Skill_Index),
        regulatoryFrame: toFrame(row),
      }));
      setEmployees(employees);
    };
    loadEmployees().catch((err) => console.error('Fehler beim Laden der Mitarbeiterdaten:', err));
  }, [setEmployees]);

  return (
    <ErrorBoundary>
      {currentView === 'landing' && <LandingPage onNavigate={setCurrentView} />}
      {currentView === 'developer' && <DeveloperView onBack={() => setCurrentView('landing')} />}
      {currentView === 'stakeholder' && <Dashboard onBack={() => setCurrentView('landing')} />}
    </ErrorBoundary>
  );
}
