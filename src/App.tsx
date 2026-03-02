import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { DeveloperView } from './components/DeveloperView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useDataStore } from './store/useDataStore';
import type { Employee } from './store/useDataStore';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'stakeholder' | 'developer'>('landing');
  const setEmployees = useDataStore(s => s.setEmployees);

  useEffect(() => {
    fetch('/granular_ma_data_2500.csv')
      .then(res => res.text())
      .then(csvText => {
        const parsed = Papa.parse<Record<string, string>>(csvText, { header: true, skipEmptyLines: true });
        const employees: Employee[] = parsed.data.map(row => ({
          MA_ID: parseInt(row.MA_ID ?? '0', 10),
          GmbH: row.GmbH ?? '',
          Alter: parseInt(row.Alter ?? '0', 10),
          Dienstjahre: parseInt(row.Dienstjahre ?? '0', 10),
          Brutto_Monat: parseFloat(row.Brutto_Monat ?? '0'),
          Skill_Index: parseFloat(row.Skill_Index ?? '0'),
          Montan: row.Montan === 'True',
        }));
        setEmployees(employees);
      })
      .catch(err => console.error('Fehler beim Laden der Mitarbeiterdaten:', err));
  }, [setEmployees]);

  return (
    <ErrorBoundary>
      {currentView === 'landing' && <LandingPage onNavigate={setCurrentView} />}
      {currentView === 'developer' && <DeveloperView onBack={() => setCurrentView('landing')} />}
      {currentView === 'stakeholder' && <Dashboard onBack={() => setCurrentView('landing')} />}
    </ErrorBoundary>
  );
}
