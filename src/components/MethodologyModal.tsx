import React from 'react';
import { X, Network, Award, Globe, BarChart2, Target } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-4 md:inset-12 lg:inset-16 z-50 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-labelledby="methodology-modal-title"
      >
        {/* Dezentes Wasserzeichen: Netzwerkgraph im Hintergrund */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden
        >
          <Network
            className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-slate-100"
            strokeWidth={0.5}
          />
        </div>

        <div className="relative p-8 md:p-12 lg:p-16">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2
                id="methodology-modal-title"
                className="text-2xl md:text-3xl font-serif italic text-slate-900 mb-2"
              >
                Wissenschaftliche Fundierung & Validität
              </h2>
              <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">
                Agentenbasierte Modellierung (ABM): Der Goldstandard der Komplexitätsforschung
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              aria-label="Modal schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Zitat-Box (hervorgehoben) */}
          <div className="mb-10 p-6 rounded-lg border-l-4 border-indigo-600 bg-slate-50/90">
            <p className="font-serif italic text-slate-700 text-lg leading-relaxed">
              „Systemische Transformation ist kein Rechenbeispiel, sondern ein lebendiger Prozess. ABM macht diesen Prozess navigierbar.“
            </p>
          </div>

          {/* Inhalt: Fakten (font-sans) */}
          <div className="space-y-8">
            <section className="flex gap-4">
              <Award className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
                  Nobelpreis-prämiertes Fundament
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Die Methodik geht maßgeblich auf Thomas Schelling zurück (Nobelpreis für Ökonomie 2005), der bewies, dass systemische Muster nur durch das Verständnis individueller Agenten-Entscheidungen erklärbar sind.
                </p>
              </div>
            </section>

            <section className="flex gap-4">
              <Globe className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
                  Internationaler Standard
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  ABM ist das zentrale Werkzeug führender Institutionen wie dem Santa Fe Institute, der ETH Zürich und der EZB zur Simulation hochkomplexer, adaptiver Systeme.
                </p>
              </div>
            </section>

            <section className="flex gap-4">
              <BarChart2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
                  Überlegenheit gegenüber Excel
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Während klassische Kalkulationen linear und statisch sind, erfasst ABM nicht-lineare Dynamiken und Emergenz – also Effekte wie Gruppendruck, Angst oder Aufbruchstimmung, die eine Restrukturierung in der Realität zum Erfolg oder Scheitern bringen.
                </p>
              </div>
            </section>

            <section className="flex gap-4">
              <Network className="w-6 h-6 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
                  Einsatzgebiete
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Bewährt in der Krisensimulation von Finanzmärkten, der Epidemiologie und der Optimierung globaler Lieferketten bei Konzernen wie Amazon oder DHL.
                </p>
              </div>
            </section>

            <section className="flex gap-4">
              <Target className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
                  Das Ziel
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Wir ersetzen das „Bauchgefühl“ durch eine mathematisch-soziologische Simulation, die zeigt, wie individuelle Biografien das Gesamtsystem stabilisieren.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
