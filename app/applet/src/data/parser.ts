import Papa from 'papaparse';

export interface Employee {
  MA_ID: string;
  GmbH: string;
  Alter: number;
  Dienstjahre: number;
  Brutto_Monat: number;
  Skill_Index: number;
  Montan: boolean;
  Status_Logik: string;
  Individuelle_Kosten: number;
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

export const loadData = async () => {
  const [empRes, matrixRes, cashflowRes] = await Promise.all([
    fetch('/granular_ma_data_2500.csv').then(res => res.text()),
    fetch('/refined_matrix_2500.csv').then(res => res.text()),
    fetch('/cashflow_phasen_2500.csv').then(res => res.text()),
  ]);

  const employees = Papa.parse<any>(empRes, { header: true, skipEmptyLines: true }).data.map(row => ({
    MA_ID: row.MA_ID,
    GmbH: row.GmbH,
    Alter: parseInt(row.Alter, 10),
    Dienstjahre: parseInt(row.Dienstjahre, 10),
    Brutto_Monat: parseFloat(row.Brutto_Monat),
    Skill_Index: parseFloat(row.Skill_Index),
    Montan: row.Montan === 'True',
    Status_Logik: row.Status_Logik,
    Individuelle_Kosten: parseFloat(row.Individuelle_Kosten),
  })) as Employee[];

  const matrix = Papa.parse<any>(matrixRes, { header: true, skipEmptyLines: true }).data.map(row => ({
    GmbH: row.GmbH,
    Alter: parseFloat(row.Alter),
    Dienstjahre: parseFloat(row.Dienstjahre),
    Brutto_Monat: parseFloat(row.Brutto_Monat),
    Skill_Index: parseFloat(row.Skill_Index),
    Individuelle_Kosten: parseFloat(row.Individuelle_Kosten),
  })) as GmbHMatrix[];

  const cashflow = Papa.parse<any>(cashflowRes, { header: true, skipEmptyLines: true }).data.map(row => ({
    Quartal: row.Quartal,
    GmbH: row.GmbH,
    Abfindungen: parseFloat(row.Abfindungen),
    Remanenz: parseFloat(row.Remanenz),
    Total_Cashout: parseFloat(row.Total_Cashout),
  })) as Cashflow[];

  return { employees, matrix, cashflow };
};
