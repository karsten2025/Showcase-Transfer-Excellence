import { create } from 'zustand';

/** Regulatorischer Rahmen – bestimmt Abfindungs- und Remanenz-Logik */
export type RegulatoryFrame = 'standard' | 'high-impact' | 'extreme';

/** Abfindungszuschlag pro Frame (additiv zum Basis-Faktor) */
const ABFINDUNGS_ZUSCHLAG: Record<RegulatoryFrame, number> = {
  standard: 0,
  'high-impact': 0.15,
  extreme: 0.3,
};

/** Remanenz pro Monat (€) – Extreme behält 1.850 € wie bisher Montan */
const REMANENZ_PRO_MONAT: Record<RegulatoryFrame, number> = {
  standard: 1850,
  'high-impact': 1850,
  extreme: 1850,
};

/** Abfindungsanteil bei TG (Exklusion = 100%) */
const ABFINDUNGS_ANTEIL_TG: Record<RegulatoryFrame, number> = {
  standard: 0.8,
  'high-impact': 0.85,
  extreme: 0.8,
};

export function getAbfindungsFaktorForFrame(
  baseFaktor: number,
  frame: RegulatoryFrame
): number {
  return baseFaktor + ABFINDUNGS_ZUSCHLAG[frame];
}

// Struktur eines Mitarbeiters (basierend auf deiner CSV)
export interface Employee {
  MA_ID: number;
  GmbH: string;
  Alter: number;
  Dienstjahre: number;
  Brutto_Monat: number;
  Skill_Index: number;
  regulatoryFrame: RegulatoryFrame;
  Status_Logik?: string;
}

interface DataState {
  employees: Employee[];
  baseAbfindungsFaktor: number;
  aufstockungNetto: number;
  haertefallAlter: number;
  sprinterPraemie: number;

  setEmployees: (data: Employee[]) => void;
  setBaseAbfindungsFaktor: (val: number) => void;
  setHaertefallAlter: (val: number) => void;
  setNettoAufstockung: (val: number) => void;

  getMetrics: () => {
    tgPotential: number;
    exklusion: number;
    vermittelt: number;
    gesamtkosten: number;
    einsparung: number;
    durchschnittsAlter: number;
    averageSkillIndex: number;
  };

  getFinancialBreakdown: () => {
    abfindung: number;
    remanenz: number;
    total: number;
    tgPotential: number;
    exklusion: number;
  };
}

export const useDataStore = create<DataState>((set, get) => ({
  employees: [],
  baseAbfindungsFaktor: 1.2,
  aufstockungNetto: 0.85,
  haertefallAlter: 60,
  sprinterPraemie: 0.20,

  setEmployees: (employees) => set({ employees }),
  setBaseAbfindungsFaktor: (val) => set({ baseAbfindungsFaktor: val }),
  setHaertefallAlter: (val) => set({ haertefallAlter: val }),
  setNettoAufstockung: (val) => set({ aufstockungNetto: val }),

  getMetrics: () => {
    const { employees, baseAbfindungsFaktor, haertefallAlter } = get();

    if (employees.length === 0) {
      return {
        tgPotential: 0,
        exklusion: 0,
        vermittelt: 0,
        gesamtkosten: 0,
        einsparung: 0,
        durchschnittsAlter: 0,
        averageSkillIndex: 0,
      };
    }

    let metrics = {
      tgPotential: 0,
      exklusion: 0,
      gesamtkosten: 0,
      direktKosten: 0,
      alterSumme: 0,
      skillSumme: 0,
    };

    employees.forEach((ma) => {
      metrics.alterSumme += ma.Alter;
      metrics.skillSumme += ma.Skill_Index;

      const faktor = getAbfindungsFaktorForFrame(baseAbfindungsFaktor, ma.regulatoryFrame);
      const remanenzProMonat = REMANENZ_PRO_MONAT[ma.regulatoryFrame];
      const abfindungsAnteil = ABFINDUNGS_ANTEIL_TG[ma.regulatoryFrame];
      const isExklusion = ma.Alter >= haertefallAlter;

      if (isExklusion) {
        metrics.exklusion++;
        metrics.gesamtkosten += ma.Brutto_Monat * ma.Dienstjahre * faktor;
      } else {
        metrics.tgPotential++;
        metrics.gesamtkosten +=
          ma.Brutto_Monat * ma.Dienstjahre * faktor * abfindungsAnteil +
          12 * remanenzProMonat;
      }

      metrics.direktKosten +=
        ma.Brutto_Monat * ma.Dienstjahre * 1.5 + ma.Brutto_Monat * 3;
    });

    return {
      tgPotential: metrics.tgPotential,
      exklusion: metrics.exklusion,
      vermittelt: Math.floor(metrics.tgPotential * 0.15),
      gesamtkosten: metrics.gesamtkosten,
      einsparung: metrics.direktKosten - metrics.gesamtkosten,
      durchschnittsAlter: Number((metrics.alterSumme / employees.length).toFixed(1)),
      averageSkillIndex: Number((metrics.skillSumme / employees.length).toFixed(2)),
    };
  },

  getFinancialBreakdown: () => {
    const { employees, baseAbfindungsFaktor, haertefallAlter } = get();
    let abfindung = 0;
    let remanenz = 0;
    let tgPotential = 0;
    let exklusion = 0;

    employees.forEach((ma) => {
      const isExklusion = ma.Alter >= haertefallAlter;
      const faktor = getAbfindungsFaktorForFrame(baseAbfindungsFaktor, ma.regulatoryFrame);
      const remanenzProMonat = REMANENZ_PRO_MONAT[ma.regulatoryFrame];
      const abfindungsAnteil = ABFINDUNGS_ANTEIL_TG[ma.regulatoryFrame];

      if (isExklusion) {
        exklusion++;
        abfindung += ma.Brutto_Monat * ma.Dienstjahre * faktor;
      } else {
        tgPotential++;
        abfindung += ma.Brutto_Monat * ma.Dienstjahre * faktor * abfindungsAnteil;
        remanenz += 12 * remanenzProMonat;
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
