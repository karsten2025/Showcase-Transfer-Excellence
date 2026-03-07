/**
 * Legal-Link-Provider: Zentrale Zuordnungsliste für rechtliche Quellen der Dashboard-Parameter.
 * Jede Funktion/Parameter ist einer rechtlichen Grundlage zugeordnet.
 */

export interface LegalMapping {
  label: string;
  quelle: string;
  beschreibung: string;
  link: string;
}

export const legalMappings: Record<string, LegalMapping> = {
  haertefallAlter: {
    label: 'Härtefall-Alter',
    quelle: 'Betriebsvereinbarung (BV) § 4.2 / Sozialplan',
    beschreibung:
      'Regelt den privilegierten Übergang (Vorruhestand) für Mitarbeiter, die innerhalb der Transferlaufzeit die Altersgrenze für eine abschlagsfreie Rente erreichen.',
    link: '§ 112 BetrVG',
  },
  transferDauer: {
    label: 'Transfer-Laufzeit',
    quelle: '§ 111 SGB III (Transferkurzarbeitergeld)',
    beschreibung:
      "Gesetzliche Höchstdauer für die Unterstützung durch die Agentur für Arbeit. Definiert den zeitlichen Rahmen der 'Navigation' im System.",
    link: 'SGB III § 111',
  },
  nettoAufstockung: {
    label: 'Netto-Aufstockung',
    quelle: 'Sozialplan Ziffer 7.1 / § 106 SGB III',
    beschreibung:
      'Berechnet den Arbeitgeber-Zuschuss zum staatlichen Transfer-KUG, um die finanzielle Lücke (Suffer) zu minimieren und Sicherheit zu garantieren.',
    link: 'SGB III § 106',
  },
  abfindungsfaktor: {
    label: 'Abfindungsfaktor',
    quelle: 'Betriebsvereinbarung Ziffer 3.1 / Sozialplan',
    beschreibung:
      'Basis-Faktor und Montan-Zuschlag für die Abfindungsberechnung. Definiert die Höhe der einmaligen Abfindung.',
    link: 'BetrVG § 88',
  },
  sprinterPraemie: {
    label: 'Sprinter-Prämie',
    quelle: 'Freiwillige Betriebsvereinbarung / Sozialplan',
    beschreibung:
      "Ein finanzieller Anreiz zur Beschleunigung des Flows (Joy). Belohnt den vorzeitigen Austritt aus der TG bei erfolgreicher Eigenvermittlung.",
    link: 'BetrVG § 88',
  },
  qualifizierungsBudget: {
    label: 'Qualifizierungs-Budget',
    quelle: '§ 110 SGB III (Transfermaßnahmen)',
    beschreibung:
      "Fördermittel für Profiling und Weiterbildung, um die 'Marktfähigkeit' der Agenten im Modell zu erhöhen.",
    link: 'SGB III § 110',
  },
};

/** Formatiert die Quelle für den Chatbot: [Rechtliche Grundlage: XYZ] */
export function formatRechtlicheGrundlage(key: string): string {
  const m = legalMappings[key];
  return m ? `[Rechtliche Grundlage: ${m.quelle}]` : '';
}
