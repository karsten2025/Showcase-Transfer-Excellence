import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { DeveloperView } from './components/DeveloperView';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'stakeholder' | 'developer'>('landing');

  if (currentView === 'landing') {
    return <LandingPage onNavigate={setCurrentView} />;
  }

  if (currentView === 'developer') {
    return <DeveloperView onBack={() => setCurrentView('landing')} />;
  }

  return <Dashboard onBack={() => setCurrentView('landing')} />;
}
