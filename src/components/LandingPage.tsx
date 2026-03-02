import React from 'react';
import { ShieldCheck, Database, Linkedin, Link as LinkIcon, Award, Cpu, CheckCircle2, ExternalLink, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'stakeholder' | 'developer') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#e5e5e5] text-slate-900 font-sans selection:bg-red-500 selection:text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-1.5 rounded-sm text-xs font-mono tracking-widest mb-12">
          <Award className="w-4 h-4 text-red-500" />
          CPMAI BUREAUCRACY-IMMUNE AGILITY SHOWCASE
        </div>
        
        <h1 className="text-7xl md:text-9xl tracking-tight mb-12 flex flex-wrap justify-center gap-x-6">
          <span className="font-serif italic">Transfer Excellence</span>
          <span className="font-bold tracking-tighter">Portal</span>
        </h1>
        
        <p className="max-w-2xl text-sm md:text-base font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
          Ein Showcase für KI-gestützte, sozialverträgliche Transformation und Transfergesellschaften basierend auf der CPMAI Methodik.
        </p>
      </div>

      {/* View Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Stakeholder View Card */}
          <button 
            onClick={() => onNavigate('stakeholder')}
            className="group text-left bg-white p-12 border-2 border-transparent hover:border-red-500 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-16">
              <ShieldCheck className="w-10 h-10 text-red-600" />
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest">
                Management Level
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <h2 className="text-4xl font-serif italic mb-6">Stakeholder View</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-16 flex-1">
              Fokus auf soziale Verantwortung, Qualifizierung und Zukunftssicherung. Strategische Übersicht für Vorstand, Betriebsrat und PMO.
            </p>
            
            <div className="pt-8 border-t border-slate-200 w-full">
              <span className="text-xs font-mono font-bold tracking-widest uppercase">01 Strategisch & Kompakt</span>
            </div>
          </button>

          {/* Developer View Card */}
          <button 
            onClick={() => onNavigate('developer')}
            className="group text-left bg-[#111] text-white p-12 border-2 border-transparent hover:border-red-500 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-16">
              <Database className="w-10 h-10 text-red-500" />
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest">
                Engineering Level
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <h2 className="text-4xl font-serif italic mb-6">Developer View</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-16 flex-1">
              Technische Details der Datenpipelines, ETL-Prozesse und Compliance-Watchdogs. Für Data Scientists & IT-Controlling.
            </p>
            
            <div className="pt-8 border-t border-slate-800 w-full">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-300">02 Technisch & Detailliert</span>
            </div>
          </button>
        </div>
      </div>

      <div className="w-full border-t border-slate-300"></div>

      {/* Methodology Section */}
      <div className="max-w-6xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-5xl font-serif italic mb-6">The CPMAI Methodology</h2>
            <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">
              Cognitive Project Management for AI - Der Goldstandard für KI-Projekte
            </p>
          </div>
          <a href="#" className="bg-[#0077b5] hover:bg-[#006097] text-white px-6 py-3 text-sm font-mono tracking-widest uppercase flex items-center gap-3 transition-colors">
            <Linkedin className="w-4 h-4" />
            Connect on LinkedIn
          </a>
        </div>

        <div className="grid md:grid-cols-3 bg-slate-300 gap-[1px] border border-slate-300">
          {[
            { num: '01', title: 'Business Interest', desc: 'Definition der Transformationsziele & Stakeholder-Interessen.' },
            { num: '02', title: 'Data Interest', desc: 'Identifikation der HR-, ERP- & Dokumentenquellen.' },
            { num: '03', title: 'Data Prep', desc: 'Automatisierte ETL-Pipelines & Compliance-Enforcement.' },
            { num: '04', title: 'Model Dev', desc: 'Multimodale Mapping-Logik & KI-gestützte Extraktion.' },
            { num: '05', title: 'Evaluation', desc: 'Validierung der Ist-Werte & Fairness-Scoring.' },
            { num: '06', title: 'Operationalization', desc: 'Proaktives Live-Dashboard & Kontinuierliches Monitoring.' },
          ].map((step, i) => (
            <div key={i} className="bg-[#e5e5e5] p-10 hover:bg-white transition-colors">
              <div className="text-red-600 font-mono text-sm font-bold mb-8">{step.num}</div>
              <h3 className="text-2xl font-serif italic mb-4">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif italic mb-8">Über diesen Showcase</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                Dieses Projekt demonstriert die Verschmelzung von sozialverträglicher Restrukturierung (Transfergesellschaft) mit modernsten KI-Technologien. Als <strong>CPMAI-zertifizierter Experte</strong> stelle ich sicher, dass KI-Lösungen nicht nur technisch brillant, sondern vor allem menschlich zentriert und nachhaltig operationalisierbar sind.
              </p>
              <p>
                Von der automatisierten Extraktion unstrukturierter Daten bis hin zum proaktiven Echtzeit-Monitoring von Budgets und Vermittlungsquoten — dieser Showcase bildet den gesamten Lebenszyklus eines kognitiven Projekts ab.
              </p>
            </div>
          </div>
          
          <div className="bg-[#111] text-white p-12">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-xl font-serif italic">
                KZ
              </div>
              <div>
                <h3 className="text-2xl font-serif italic mb-1">Karsten Zenk</h3>
                <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">CPMAI Expert & AI Architect</p>
              </div>
            </div>
            
            <ul className="space-y-4 mb-12 font-mono text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-red-500" />
                Spezialist für KI-Operationalisierung
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                Fokus auf Daten-Veracity & Forensik
              </li>
              <li className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-red-500" />
                <a href="https://zenk-pm-now.de" target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-4 decoration-slate-700">zenk-pm-now.de</a>
              </li>
            </ul>
            
            <div className="space-y-4">
              <a href="#" className="w-full bg-[#0077b5] hover:bg-[#006097] text-white py-4 text-sm font-mono tracking-widest uppercase flex items-center justify-center gap-3 transition-colors">
                <Linkedin className="w-4 h-4" />
                Share on LinkedIn
              </a>
              <button className="w-full bg-transparent border border-slate-700 hover:border-slate-500 text-white py-4 text-sm font-mono tracking-widest uppercase flex items-center justify-center gap-3 transition-colors">
                <LinkIcon className="w-4 h-4" />
                Copy Showcase Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-300 py-12 text-center">
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">
          © 2026 Karsten Zenk. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
