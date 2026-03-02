import React, { useEffect, useState } from "react";
import { loadData, Employee, GmbHMatrix, Cashflow } from "../data/parser";
import { useStore } from "../store";
import { useDataStore } from "../store/useDataStore";
import { FinancialView } from "./FinancialView";
import { SocialView } from "./SocialView";
import { OperationalView } from "./OperationalView";
import { VariableTooltip } from "./VariableTooltip";
import {
  Settings,
  Users,
  Briefcase,
  BarChart3,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

interface DynamicSummaryProps {
  view: "financial" | "social" | "operational";
  baseAbfindungsFaktor: number;
  haertefallAlter: number;
  aufstockungProzent: number;
  metrics: {
    tgPotential: number;
    exklusion: number;
    vermittelt: number;
    gesamtkosten: number;
  };
}

const DynamicSummary: React.FC<DynamicSummaryProps> = ({
  view,
  baseAbfindungsFaktor,
  haertefallAlter,
  aufstockungProzent,
  metrics,
}) => {
  const budgetChangePercent = ((baseAbfindungsFaktor - 1.2) / 1.2) * 100;

  let text = "";
  if (view === "financial") {
    text = `Du hast den Abfindungsfaktor auf ${baseAbfindungsFaktor.toFixed(
      1
    )} gesetzt. Effekt: Das Budget verändert sich um ${
      budgetChangePercent >= 0 ? "+" : ""
    }${budgetChangePercent.toFixed(0)}%, während die Zielmarke von ${
      metrics.tgPotential
    } MA im Transfer stabil bleibt.`;
  } else if (view === "social") {
    text = `Bei einem Härtefall-Alter von ${haertefallAlter} Jahren sichern wir ${metrics.exklusion} Mitarbeitern den direkten Übergang in den Ruhestand.`;
  } else {
    text = `Mit einer Aufstockung von ${aufstockungProzent}% und ${metrics.vermittelt} prognostizierten Vermittlungen liegt der Fokus auf der Reduktion der Verweildauer.`;
  }

  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-4 h-4 text-indigo-600" />
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Live-Feedback
        </span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
};

const STAKEHOLDER_HEURISTICS = {
  abfindungsfaktor: {
    heuristik: "Der Preis für den sozialen Frieden.",
    vorstand:
      "Jede Erhöhung um 0,1 kostet bei 2.500 MA signifikante Liquidität, reduziert aber das Risiko langwieriger Kündigungsschutzprozesse.",
    betriebsrat:
      "Ein Faktor unter 1,2 gefährdet die Akzeptanz des Programms und erhöht den Druck auf Härtefallklauseln.",
    pmo: "Beeinflusst die Geschwindigkeit: Höherer Faktor = Schnellere Unterzeichnung.",
  },
  nettoAufstockung: {
    heuristik: "Die Brücke in die neue Beschäftigung.",
    vorstand:
      "Steuert Remanenzkosten. 85% ist Marktstandard; jedes Prozent mehr erhöht die monatliche Burn-Rate.",
    betriebsrat:
      "Sicherheitsnetz für Familien. Ermöglicht Fokus auf Qualifizierung statt finanzieller Not.",
    pmo: "Hohe Aufstockung senkt Suchdruck. Balance zur Sprinter-Prämie halten.",
  },
  haertefallAlter: {
    heuristik: "Die Trennung zwischen Transfer und Ruhestand.",
    vorstand:
      "Senkung verschiebt MA vom günstigen Transfer ins teurere Vorruhestandsmodell.",
    betriebsrat:
      "Schutzschild für die älteste Generation. Sichert den Übergang zur Rente.",
    pmo: "Verändert die Zielgruppengröße für Qualifizierungen.",
  },
};

export const Dashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [data, setData] = useState<{
    employees: Employee[];
    matrix: GmbHMatrix[];
    cashflow: Cashflow[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "financial" | "social" | "operational"
  >("financial");

  const {
    abfindungsfaktor,
    setAbfindungsfaktor,
    nettoAufstockung,
    setNettoAufstockung,
    haertefallAlter,
    setHaertefallAlter,
    sprinterPraemie,
    setSprinterPraemie,
  } = useStore();

  const setEmployees = useDataStore((s) => s.setEmployees);
  const setBaseAbfindungsFaktor = useDataStore(
    (s) => s.setBaseAbfindungsFaktor
  );
  const setHaertefallAlterStore = useDataStore((s) => s.setHaertefallAlter);
  const setNettoAufstockungStore = useDataStore((s) => s.setNettoAufstockung);
  const baseAbfindungsFaktor = useDataStore((s) => s.baseAbfindungsFaktor);
  const haertefallAlterStore = useDataStore((s) => s.haertefallAlter);
  const aufstockungNetto = useDataStore((s) => s.aufstockungNetto);
  const getMetrics = useDataStore((s) => s.getMetrics);

  useEffect(() => {
    setError(null);
    loadData()
      .then((d) => {
        setData(d);
        setEmployees(d.employees);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Daten konnten nicht geladen werden."
        );
      });
  }, [setEmployees]);

  useEffect(() => {
    setBaseAbfindungsFaktor(abfindungsfaktor);
    setHaertefallAlterStore(haertefallAlter);
    setNettoAufstockungStore(nettoAufstockung / 100);
  }, [
    abfindungsfaktor,
    haertefallAlter,
    nettoAufstockung,
    setBaseAbfindungsFaktor,
    setHaertefallAlterStore,
    setNettoAufstockungStore,
  ]);

  const handleAbfindungsfaktorChange = (val: number) => {
    setAbfindungsfaktor(val);
    setBaseAbfindungsFaktor(val);
  };

  const handleHaertefallAlterChange = (val: number) => {
    setHaertefallAlter(val);
    setHaertefallAlterStore(val);
  };

  const handleNettoAufstockungChange = (val: number) => {
    setNettoAufstockung(val);
    setNettoAufstockungStore(val / 100);
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-8">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Fehler beim Laden
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Erneut versuchen
            </button>
            <button
              onClick={onBack}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Zurück
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto" />
          <p>Lade Daten...</p>
        </div>
      </div>
    );
  }

  // Process data based on global variables
  const processedEmployees = data.employees.map((emp) => {
    const isHaertefall = emp.Alter >= haertefallAlter;
    const status = isHaertefall ? "Exklusion_Vorruhestand" : "TG_Potential";

    let currentFaktor = abfindungsfaktor;
    if (emp.Montan) currentFaktor += 0.3;

    // Base Abfindung
    let abfindung = emp.Brutto_Monat * emp.Dienstjahre * currentFaktor;

    // Remanenzkosten (simplified: 12 months in TG)
    let remanenzMonate = 12;
    let remanenz = emp.Brutto_Monat * (nettoAufstockung / 100) * remanenzMonate;

    if (sprinterPraemie && status === "TG_Potential") {
      // 20% Ersparnis-Beteiligung bei vorzeitigem Austritt
      // Assuming average exit after 3 months instead of 12
      const savedMonths = 9;
      const savedRemanenz =
        emp.Brutto_Monat * (nettoAufstockung / 100) * savedMonths;
      remanenz = emp.Brutto_Monat * (nettoAufstockung / 100) * 3; // only 3 months paid
      abfindung += savedRemanenz * 0.2; // 20% premium
    }

    return {
      ...emp,
      Status_Logik: status,
      Calculated_Abfindung: abfindung,
      Calculated_Remanenz: remanenz,
      Calculated_Total: abfindung + remanenz,
    };
  });

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            ZURÜCK ZUM PORTAL
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            Restrukturierung
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">
            Showcase Dashboard
          </p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Settings className="w-4 h-4 text-slate-500" />
            System-Variablen
          </h2>

          <div className="space-y-6">
            <div>
              <label className="flex justify-between items-start text-sm font-medium text-slate-700 mb-2">
                <VariableTooltip
                  label="Abfindungsfaktor (Basis)"
                  content={STAKEHOLDER_HEURISTICS.abfindungsfaktor}
                />
                <span className="text-indigo-600 shrink-0 ml-2">
                  {abfindungsfaktor.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={abfindungsfaktor}
                onChange={(e) =>
                  handleAbfindungsfaktorChange(parseFloat(e.target.value))
                }
                className="w-full accent-indigo-600"
              />
              <p className="text-xs text-slate-500 mt-1">
                Montan-GmbHs automatisch +0.3
              </p>
            </div>

            <div>
              <label className="flex justify-between items-start text-sm font-medium text-slate-700 mb-2">
                <VariableTooltip
                  label="Netto-Aufstockung (%)"
                  content={STAKEHOLDER_HEURISTICS.nettoAufstockung}
                />
                <span className="text-indigo-600 shrink-0 ml-2">
                  {nettoAufstockung}%
                </span>
              </label>
              <input
                type="range"
                min="60"
                max="100"
                step="1"
                value={nettoAufstockung}
                onChange={(e) =>
                  handleNettoAufstockungChange(parseFloat(e.target.value))
                }
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="flex justify-between items-start text-sm font-medium text-slate-700 mb-2">
                <VariableTooltip
                  label="Härtefall-Alter"
                  content={STAKEHOLDER_HEURISTICS.haertefallAlter}
                />
                <span className="text-indigo-600 shrink-0 ml-2">
                  {haertefallAlter} Jahre
                </span>
              </label>
              <input
                type="range"
                min="55"
                max="65"
                step="1"
                value={haertefallAlter}
                onChange={(e) =>
                  handleHaertefallAlterChange(parseFloat(e.target.value))
                }
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={sprinterPraemie}
                    onChange={(e) => setSprinterPraemie(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Sprinter-Prämie (20%)
                </span>
              </label>
              <p className="text-xs text-slate-500 mt-1 ml-13">
                Beteiligung bei vorzeitigem Austritt
              </p>
            </div>

            {/* Dynamische Kurzzusammenfassung (Live-Feedback) */}
            <DynamicSummary
              view={activeTab}
              baseAbfindungsFaktor={baseAbfindungsFaktor}
              haertefallAlter={haertefallAlter}
              aufstockungProzent={Math.round(aufstockungNetto * 100)}
              metrics={getMetrics()}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex gap-8">
          <button
            onClick={() => setActiveTab("financial")}
            className={`flex items-center gap-2 pb-4 -mb-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "financial"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Vorstand (Financial)
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-2 pb-4 -mb-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "social"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            Betriebsrat (Social)
          </button>
          <button
            onClick={() => setActiveTab("operational")}
            className={`flex items-center gap-2 pb-4 -mb-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "operational"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Settings className="w-4 h-4" />
            PMO (Operational)
          </button>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "financial" && (
            <FinancialView cashflow={data.cashflow} />
          )}
          {activeTab === "social" && (
            <SocialView employees={processedEmployees} />
          )}
          {activeTab === "operational" && (
            <OperationalView
              employees={processedEmployees}
              matrix={data.matrix}
            />
          )}
        </div>
      </div>
    </div>
  );
};
