import Papa from 'papaparse';
import type { RegulatoryFrame } from '../store/useDataStore';

export interface Employee {
  MA_ID: string;
  GmbH: string;
  Alter: number;
  Dienstjahre: number;
  Brutto_Monat: number;
  Skill_Index: number;
  regulatoryFrame: RegulatoryFrame;
  Status_Logik: string;
  Individuelle_Kosten?: number;
}

export interface GmbHMatrix {
  GmbH: string;
  Alter: number;
  Dienstjahre: number;
  Brutto_Monat: number;
  Skill_Index: number;
  Individuelle_Kosten: number;
}

export interface Cashflow {
  Quartal: string;
  GmbH: string;
  Abfindungen: number;
  Remanenz: number;
  Total_Cashout: number;
}

/** CSV Montan true → extreme, false → standard. Später erweiterbar (z.B. per GmbH-Mapping). */
function toRegulatoryFrame(row: Record<string, unknown>): RegulatoryFrame {
  const montan = String(row.Montan ?? row.regulatoryFrame ?? '').toLowerCase() === 'true';
  const frame = String(row.RegulatoryFrame ?? row.regulatoryFrame ?? '').toLowerCase();
  if (frame === 'high-impact' || frame === 'tarifgebunden') return 'high-impact';
  if (frame === 'extreme' || frame === 'montan' || montan) return 'extreme';
  return 'standard';
}

const parseEmployeeRow = (row: Record<string, unknown>): Employee => {
  const num = (v: unknown) => (typeof v === 'number' ? v : parseFloat(String(v ?? 0)) || 0);
  const int = (v: unknown) => (typeof v === 'number' ? Math.round(v) : parseInt(String(v ?? 0), 10) || 0);
  return {
    MA_ID: String(row.MA_ID ?? ''),
    GmbH: String(row.GmbH ?? ''),
    Alter: int(row.Alter),
    Dienstjahre: int(row.Dienstjahre),
    Brutto_Monat: num(row.Brutto_Monat),
    Skill_Index: num(row.Skill_Index),
    regulatoryFrame: toRegulatoryFrame(row),
    Status_Logik: String(row.Status_Logik ?? ''),
    Individuelle_Kosten: num(row.Individuelle_Kosten),
  };
};

const fetchCsvSafe = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url);
    return res.ok ? res.text() : null;
  } catch {
    return null;
  }
};

export const loadData = async () => {
  const empRes =
    (await fetchCsvSafe('/granular_ma_data_2500.csv')) ??
    (await fetchCsvSafe('/granular_ma_data_sample.csv'));

  if (!empRes) {
    throw new Error(
      'Mitarbeiterdaten konnten nicht geladen werden. Bitte granular_ma_data_sample.csv in public/ ablegen.'
    );
  }

  const matrixRes = await fetchCsvSafe('/refined_matrix_2500.csv');
  const cashflowRes = await fetchCsvSafe('/cashflow_phasen_2500.csv');

  const empParsed = Papa.parse<Record<string, unknown>>(empRes, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  const employees = empParsed.data.map(parseEmployeeRow) as Employee[];

  const matrix: GmbHMatrix[] = matrixRes
    ? Papa.parse<Record<string, unknown>>(matrixRes, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      }).data.map((row) => ({
        GmbH: String(row.GmbH ?? ''),
        Alter: Number(row.Alter) || 0,
        Dienstjahre: Number(row.Dienstjahre) || 0,
        Brutto_Monat: Number(row.Brutto_Monat) || 0,
        Skill_Index: Number(row.Skill_Index) || 0,
        Individuelle_Kosten: Number(row.Individuelle_Kosten) || 0,
      })) as GmbHMatrix[]
    : [];

  const cashflow: Cashflow[] = cashflowRes
    ? Papa.parse<Record<string, unknown>>(cashflowRes, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      }).data.map((row) => ({
        Quartal: String(row.Quartal ?? ''),
        GmbH: String(row.GmbH ?? ''),
        Abfindungen: Number(row.Abfindungen) || 0,
        Remanenz: Number(row.Remanenz) || 0,
        Total_Cashout: Number(row.Total_Cashout) || 0,
      })) as Cashflow[]
    : [];

  return { employees, matrix, cashflow };
};
