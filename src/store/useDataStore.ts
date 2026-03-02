import { create } from 'zustand';

// Struktur eines Mitarbeiters (basierend auf deiner CSV)
export interface Employee {
  MA_ID: number;
  GmbH: string;
  Alter: number;
  Dienstjahre: number;
  Brutto_Monat: number;
  Skill_Index: number;
  Montan: boolean;
  Status_Logik?: string;
}

interface DataState {
  // 1. Die Rohdaten
  employees: Employee[];
  
  // 2. Die System-Variablen (steuerbar über Slider)
  baseAbfindungsFaktor: number;
  aufstockungNetto: number;
  haertefallAlter: number;
  sprinterPraemie: number;

  // 3. Aktionen (Funktionen zum Ändern der Daten)
  setEmployees: (data: Employee[]) => void;
  setBaseAbfindungsFaktor: (val: number) => void;
  setHaertefallAlter: (val: number) => void;
  setNettoAufstockung: (val: number) => void;

  // 4. Die Logik-Zentrale (Berechnete Werte)
  getMetrics: () => {
    tgPotential: number;
    exklusion: number;
    vermittelt: number;
    gesamtkosten: number;
    einsparung: number;
    durchschnittsAlter: number;
    averageSkillIndex: number;
  };

  // Financial-Breakdown für Quartals-Chart (Abfindung vs. Remanenz)
  getFinancialBreakdown: () => {
    abfindung: number;
    remanenz: number;
    total: number;
    tgPotential: number;
    exklusion: number;
  };
}

export const useDataStore = create<DataState>((set, get) => ({
  // Initialwerte
  employees: [], 
  baseAbfindungsFaktor: 1.2,
  aufstockungNetto: 0.85,
  haertefallAlter: 60,
  sprinterPraemie: 0.20,

  // Setter-Funktionen
  setEmployees: (employees) => set({ employees }),
  setBaseAbfindungsFaktor: (val) => set({ baseAbfindungsFaktor: val }),
  setHaertefallAlter: (val) => set({ haertefallAlter: val }),
  setNettoAufstockung: (val) => set({ aufstockungNetto: val }),

  // Das "Rechenwerk"
  getMetrics: () => {
    const { employees, baseAbfindungsFaktor, haertefallAlter } = get();
    
    if (employees.length === 0) return {
      tgPotential: 0, exklusion: 0, vermittelt: 0, gesamtkosten: 0, einsparung: 0, durchschnittsAlter: 0, averageSkillIndex: 0
    };

    let metrics = {
      tgPotential: 0,
      exklusion: 0,
      gesamtkosten: 0,
      direktKosten: 0,
      alterSumme: 0,
      skillSumme: 0
    };

    employees.forEach(ma => {
      metrics.alterSumme += ma.Alter;
      metrics.skillSumme += ma.Skill_Index;
      
      // Regel: Montan-Zuschlag +0.3
      const faktor = ma.Montan ? baseAbfindungsFaktor + 0.3 : baseAbfindungsFaktor;
      
      // Regel: Härtefall-Filter
      const isExklusion = ma.Alter >= haertefallAlter;
      
      if (isExklusion) {
        metrics.exklusion++;
        // Kosten Vorruhestand (Volle Abfindung)
        metrics.gesamtkosten += (ma.Brutto_Monat * ma.Dienstjahre * faktor);
      } else {
        metrics.tgPotential++;
        // Kosten Transfer (80% Abfindung + 12 Monate Remanenz à 1.850€)
        metrics.gesamtkosten += (ma.Brutto_Monat * ma.Dienstjahre * faktor * 0.8) + (12 * 1850);
      }
      
      // Vergleich: Direkter Abbau (Faktor 1.5 + 3 Mon. Kündigungsfrist)
      metrics.direktKosten += (ma.Brutto_Monat * ma.Dienstjahre * 1.5) + (ma.Brutto_Monat * 3);
    });

    return {
      tgPotential: metrics.tgPotential,
      exklusion: metrics.exklusion,
      vermittelt: Math.floor(metrics.tgPotential * 0.15),
      gesamtkosten: metrics.gesamtkosten,
      einsparung: metrics.direktKosten - metrics.gesamtkosten,
      durchschnittsAlter: Number((metrics.alterSumme / employees.length).toFixed(1)),
      averageSkillIndex: Number((metrics.skillSumme / employees.length).toFixed(2))
    };
  },

  getFinancialBreakdown: () => {
    const { employees, baseAbfindungsFaktor, haertefallAlter } = get();
    let abfindung = 0;
    let remanenz = 0;
    let tgPotential = 0;
    let exklusion = 0;

    employees.forEach(ma => {
      const isExklusion = ma.Alter >= haertefallAlter;
      const faktor = ma.Montan ? baseAbfindungsFaktor + 0.3 : baseAbfindungsFaktor;

      if (isExklusion) {
        exklusion++;
        abfindung += ma.Brutto_Monat * ma.Dienstjahre * faktor;
      } else {
        tgPotential++;
        abfindung += ma.Brutto_Monat * ma.Dienstjahre * faktor * 0.8;
        remanenz += 12 * 1850;
      }
    });

    return {
      abfindung,
      remanenz,
      total: abfindung + remanenz,
      tgPotential,
      exklusion,
    };
  },
}));