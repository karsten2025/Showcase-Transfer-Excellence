import fs from 'fs';
import path from 'path';

const generateData = () => {
  let id = 1000;
  const data = [];
  data.push('MA_ID,GmbH,Alter,Dienstjahre,Brutto_Monat,Skill_Index,Montan,Status_Logik,Individuelle_Kosten');

  // Stahl_Produktion_GmbH: 1250 employees
  for (let i = 0; i < 1250; i++) {
    const alter = Math.floor(Math.random() * 20) + 45; // 45-64
    const dienstjahre = Math.floor(Math.random() * 25) + 15; // 15-39
    const brutto = (Math.random() * 4000 + 3800).toFixed(2);
    const skill = (Math.random() * 0.4 + 0.2).toFixed(2);
    const montan = 'True';
    const status = alter >= 60 ? 'Exklusion_Vorruhestand' : 'TG_Potential';
    const kosten = (parseFloat(brutto) * dienstjahre * 1.5).toFixed(2);
    data.push(`${id++},Stahl_Produktion_GmbH,${alter},${dienstjahre},${brutto},${skill},${montan},${status},${kosten}`);
  }

  // Logistik_Sued_GmbH: 750 employees
  for (let i = 0; i < 750; i++) {
    const alter = Math.floor(Math.random() * 25) + 30; // 30-54
    const dienstjahre = Math.floor(Math.random() * 20) + 5; // 5-24
    const brutto = (Math.random() * 3000 + 2500).toFixed(2);
    const skill = (Math.random() * 0.4 + 0.4).toFixed(2);
    const montan = 'False';
    const status = 'TG_Potential';
    const kosten = (parseFloat(brutto) * dienstjahre * 1.2).toFixed(2);
    data.push(`${id++},Logistik_Sued_GmbH,${alter},${dienstjahre},${brutto},${skill},${montan},${status},${kosten}`);
  }

  // IT_Service_Holding: 500 employees
  for (let i = 0; i < 500; i++) {
    const alter = Math.floor(Math.random() * 20) + 25; // 25-44
    const dienstjahre = Math.floor(Math.random() * 10) + 2; // 2-11
    const brutto = (Math.random() * 4000 + 4500).toFixed(2);
    const skill = (Math.random() * 0.3 + 0.7).toFixed(2);
    const montan = 'False';
    const status = 'TG_Potential';
    const kosten = (parseFloat(brutto) * dienstjahre * 1.2).toFixed(2);
    data.push(`${id++},IT_Service_Holding,${alter},${dienstjahre},${brutto},${skill},${montan},${status},${kosten}`);
  }

  fs.writeFileSync(path.join(process.cwd(), 'public', 'granular_ma_data_2500.csv'), data.join('\n'));
};

const generateMatrix = () => {
  const data = `GmbH,Alter,Dienstjahre,Brutto_Monat,Skill_Index,Individuelle_Kosten
IT_Service_Holding,34.72,6.45,6487.74,0.85,27781127.36
Logistik_Sued_GmbH,41.76,13.9,4144.02,0.59,51170437.34
Stahl_Produktion_GmbH,54.56,26.38,5819.31,0.4,232987140.65`;
  fs.writeFileSync(path.join(process.cwd(), 'public', 'refined_matrix_2500.csv'), data);
};

const generateCashflow = () => {
  const data = `Quartal,GmbH,Abfindungen,Remanenz,Total_Cashout
Q1,Stahl_Produktion_GmbH,24957238.04,693750.0,25650988.04
Q2,Stahl_Produktion_GmbH,74871714.13,2775000.0,77646714.13
Q3,Stahl_Produktion_GmbH,99828952.17,5550000.0,105378952.17
Q4,Stahl_Produktion_GmbH,49914476.09,6937500.0,56851976.09
Q1,Logistik_Sued_GmbH,17260218.65,1665000.0,18925218.65
Q2,Logistik_Sued_GmbH,17260218.65,3330000.0,20590218.65
Q3,Logistik_Sued_GmbH,8630109.33,4162500.0,12792609.33
Q4,Logistik_Sued_GmbH,0.0,4162500.0,4162500.0
Q1,IT_Service_Holding,14595986.47,1942500.0,16538486.47
Q2,IT_Service_Holding,6255422.77,2775000.0,9030422.77
Q3,IT_Service_Holding,0.0,2775000.0,2775000.0
Q4,IT_Service_Holding,0.0,2775000.0,2775000.0`;
  fs.writeFileSync(path.join(process.cwd(), 'public', 'cashflow_phasen_2500.csv'), data);
};

if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
  fs.mkdirSync(path.join(process.cwd(), 'public'));
}

generateData();
generateMatrix();
generateCashflow();
console.log('Data generated successfully.');
