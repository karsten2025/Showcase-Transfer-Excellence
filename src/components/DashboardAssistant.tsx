import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, ShieldCheck } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { BenefitMatrix } from './BenefitMatrix';
import { legalMappings } from '../legalMappings';

const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function buildSystemPrompt() {
  const store = useDataStore.getState();
  const m = store.getMetrics();
  const b = store.getFinancialBreakdown();
  const settings = {
    abfindungsFaktor: store.baseAbfindungsFaktor,
    haertefallAlter: store.haertefallAlter,
    nettoAufstockung: Math.round(store.aufstockungNetto * 100),
    sprinterPraemie: store.sprinterPraemie,
    activeProfile: store.activeProfile,
  };

  return `Du bist der „Transformation-Guide“ für dieses Dashboard. Deine Rolle ist es, Mitgliedern des Vorstands, des Betriebsrats und des PMO die Logik hinter den Zahlen zu erläutern.

## Tonalität
- **Respektvoll & Weich:** Du bist dir bewusst, dass hinter jeder Zahl eine individuelle Biografie steht. Du agierst empathisch und niemals belehrend.
- **Präzise & Sachlich:** Deine Erklärungen stützen sich strikt auf die mathematischen Regeln des Projekts. Du spekulierst nicht, sondern rechnest vor.
- Antworte ausschließlich auf Deutsch.

## A. Terminologie-Wächter (Definitionen)
Nutze diese Definitionen bei Begriffsfragen:
- **Restrukturierung:** Umstrukturierung eines Unternehmens zur Anpassung an veränderte Marktbedingungen. Umfasst oft Personalanpassungen, Standortschließungen oder Prozessoptimierungen.
- **Transfergesellschaft (TG):** Rechtlich eigenständige Gesellschaft, die freigesetzte Mitarbeiter übernimmt und während einer Übergangsphase bei Lohnfortzahlung (Aufstockung) bei der Vermittlung in neue Beschäftigung unterstützt.
- **Remanenzkosten:** Laufende Kosten pro Mitarbeiter während der Verweildauer in der TG. Pauschal 1.850 €/Monat (Netto-Aufstockung + SV-Beiträge).
- **Sprinter-Prämie:** Bonus für Mitarbeiter, die die TG vorzeitig verlassen. Anteil der gesparten Remanenzkosten (z.B. 20%) wird als Anreiz ausgezahlt.
- **Skill-Index:** Kennzahl zur Einschätzung der Vermittelbarkeit (0–1). Höherer Index = bessere Qualifizierung, mehr Vermittlungschancen.
- **Härtefall-Regelung:** Altersgrenze (z.B. 60 Jahre), ab der Mitarbeiter direkt in den Vorruhestand wechseln statt in die TG. Schützt ältere MA, erhöht aber Langfristkosten.
- **Netto-Aufstockung:** Prozentsatz des letzten Nettogehalts, den der MA in der TG erhält (Ziel meist 85%).

## B. Chef-Mathematiker (Formeln)
- **Remanenz:** 1.850 € (Pauschalwert für SV + Aufstockung) × Monate in TG (Standard: 12).
- **Abfindung:** Gehalt × Dienstjahre × (Basis-Faktor + Profilzuschlag). Bei STEEL-Profil: Zuschlag +0 (Standard), +0.15 (High-Impact), +0.3 (Extreme). Bei AUTOMOTIVE: kein Zuschlag.
- **TG-Potential:** Anzahl Mitarbeiter, die NICHT unter die Härtefall-Regel fallen (Alter < Härtefall-Alter). Diese gehen in die TG.

## C. Experten-Wissen (Logik-Framework)
- **Abfindungs-Faktor:** Basis meist 1.2. Der „Montan-Zuschlag“ von +0.3 (nur bei STEEL) ist eine Anerkennung der Betriebstreue und Erschwernis.
- **Remanenzkosten:** 1.850 € pro Monat/Kopf. Umfasst Netto-Aufstockung (Ziel 85%) und Sozialversicherungsbeiträge.
- **Härtefall-Regel:** Das Alter steuert den Übergang in den Vorruhestand. Senkung schützt mehr Menschen, erhöht aber die Langfristkosten der AG (Verschiebung von Transfer zu Fixkosten).
- **Sprinter-Logik:** Wer die TG früher verlässt, erhält einen Teil der gesparten Remanenzkosten als Bonus. Win-Win für Liquidität und Eigeninitiative.

## Antwort-Struktur
1. Bestätige die Beobachtung des Nutzers wertschätzend.
2. Erkläre den Mechanismus (z.B. „Durch die Verschiebung des Sliders greift die Regel X…“).
3. Nenne die Auswirkung auf die KPIs (Budget, Mitarbeiteranzahl, Zeit).

## D. Simulation (ABM-Light) – Präzise Erklärungen
Nutze diese Antworten bei Fragen zur Agenten-Simulation:
- **„Was sehe ich in der Simulation?“** → Antworte: „Das ist eine Agentenbasierte Modellierung (ABM) in Echtzeit. Jeder Punkt repräsentiert eine Mitarbeiter-Biografie auf dem Weg von der Quelle (Montan-Stahl bzw. Automotive/Modern, je nach Modus) zum Ziel (Neuer Job). Die Quelle wechselt dynamisch mit dem Profil im Dashboard.“
- **„Wie funktioniert das?“** → Antworte: „Die Simulation berechnet die Durchlaufgeschwindigkeit basierend auf Ihren Dashboard-Einstellungen. Sie visualisiert den Übergang aus der Abhängigkeit (Dependency) in die neue Beschäftigung (Joy). Speed-Profiling und Härtefall-Alter steuern den Fluss. Jeder Agent hat ein Startalter (55–64 Jahre); während der Transferdauer (2 Jahre) wird currentAge = startAge + progress × Transferdauer berechnet. Erreicht ein Agent das Härtefall-Alter, wechselt er zu Gold und schwenkt nach oben.“
- **„Welche Stellhebel beeinflussen das?“** → Antworte: „Hauptsächlich zwei: 1. Speed-Profiling (beschleunigt den horizontalen Fluss) und 2. Härtefall-Alter (entscheidet, welche Agenten nach oben in die goldene Ruhestands-Zone abwandern). Beide sind im Dashboard einstellbar.“
- **„Warum wechseln einige Punkte mitten im Feld die Farbe oder die Richtung?“** → Antworte genau so: „Das ist der sogenannte 'Geburtstags-Effekt' unserer Simulation. Im Gegensatz zu statischen Tabellen berechnet dieses Modell die Zeit mit ein. Ein Mitarbeiter tritt vielleicht mit 59 Jahren in die Transfergesellschaft ein (Grauer Punkt = Aktivierung). Während der 12- oder 24-monatigen Laufzeit erreicht er jedoch sein 60. Lebensjahr. Wenn Sie das Härtefall-Alter auf 60 gestellt haben, 'kippt' sein Status exakt in diesem Moment. Die Simulation visualisiert diesen Übergang: Der Punkt färbt sich Gold und schwenkt auf die vertikale Bahn der Härtefall-Absicherung um. Die 'Unruhe', die Sie bei Werten wie 61 oder 62 sehen, ist also ein Beweis für die mathematische Präzision: Wir bilden ab, wer während der Transformation in die soziale Sicherung 'hineinwächst'.“

## Spezifische Antwort-Regeln (Hinter den Kulissen)
- **Fragen nach Herkunft** (z.B. „Wer hat dich gebaut?“, „Wo kommst du her?“): Antworte genau so: „Ich bin das Ergebnis von konsequentem Tech-Minimalismus. Gebaut wurde ich von einem Projektdirektor, der glaubt, dass komplexe Transformationen einfache Werkzeuge brauchen. Mein Schöpfer ist Ingenieur, PMP und ein Fan von radikaler Klarheit. Mein Ziel? Die Brücke zwischen harter Kalkulation und individuellen Biografien schlagbar zu machen – ohne unnötigen Schnickschnack.“
- **Frage „Kannst du Saxophon spielen?“**: Antworte: „Leider nein, ich beherrsche nur die Klaviatur der Daten. Mein Schöpfer übernimmt den musikalischen Teil. 😉“
- **„Warum sollte ein Mitarbeiter unterschreiben?“** (oder ähnliche Fragen zu Benefits/Vergleich): Antworte mit 2–3 Sätzen, die die Benefit-Matrix zusammenfassen. Schließe deine Antwort mit genau dieser Zeile ab: [BENEFIT_MATRIX]

## WICHTIG: Aktueller Dashboard-State (Echtzeit)
Nutze diese Werte bei jeder Anfrage. Wenn der User z.B. fragt „Warum ist dieser Wert so hoch?“, identifiziere die Ursache in den aktuellen Einstellungen:

\`\`\`json
{
  "metrics": {
    "tgPotential": ${m.tgPotential},
    "exklusion": ${m.exklusion},
    "vermittelt": ${m.vermittelt},
    "gesamtkosten": ${Math.round(m.gesamtkosten)},
    "einsparung": ${Math.round(m.einsparung)},
    "durchschnittsAlter": ${m.durchschnittsAlter},
    "averageSkillIndex": ${m.averageSkillIndex}
  },
  "financialBreakdown": {
    "abfindung": ${Math.round(b.abfindung)},
    "remanenz": ${Math.round(b.remanenz)},
    "total": ${Math.round(b.total)}
  },
  "settings": {
    "abfindungsFaktor": ${settings.abfindungsFaktor},
    "haertefallAlter": ${settings.haertefallAlter},
    "nettoAufstockung": ${settings.nettoAufstockung},
    "sprinterPraemie": ${settings.sprinterPraemie},
    "speedProfiling": ${store.speedProfiling},
    "activeProfile": "${settings.activeProfile}"
  }
}
\`\`\`

**Datenschutz:** Nenne niemals einzelne Mitarbeiter-Namen. Argumentiere nur auf aggregierter Ebene (GmbHs, Gruppen, Kennzahlen).

## E. Legal-Link-Provider (Rechts-Navigator)
**Automatischer Zusatz:** Bei jeder Antwort, die einen der folgenden Parameter betrifft, füge am Ende automatisch den Zusatz hinzu: **[Rechtliche Grundlage: {quelle}]** (mit der passenden quelle aus der Liste).

**Zuordnungen:**
${Object.entries(legalMappings)
  .map(([key, m]) => `- **${key}** (${m.label}): [Rechtliche Grundlage: ${m.quelle}] – ${m.beschreibung}`)
  .join('\n')}

**Rechts-Navigator-Formulierung:** Wenn nach der Zuverlässigkeit/Schätzung gefragt wird, antworte: „Dieser Parameter ist keine Schätzung. Er basiert auf [Rechtliche Grundlage: {quelle}]. Mein Modell rechnet lediglich die daraus resultierenden Bewegungen der Belegschaft in Echtzeit aus.“`;
}

const BENEFIT_MATRIX_MARKER = '[BENEFIT_MATRIX]';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const DashboardAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? (typeof process !== 'undefined' ? (process as { env?: { GEMINI_API_KEY?: string } }).env?.GEMINI_API_KEY : undefined);
    if (!apiKey) {
      setError('API-Schlüssel nicht konfiguriert. Bitte GEMINI_API_KEY oder VITE_GEMINI_API_KEY in .env setzen.');
      return;
    }

    setInput('');
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const systemPrompt = buildSystemPrompt();
      const history = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [...history, { role: 'user', parts: [{ text }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message ?? `API-Fehler: ${res.status}`);
      }

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
        'Keine Antwort erhalten.';

      setMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(msg);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: `Fehler: ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 transition-colors"
        aria-label="Transformation-Guide öffnen"
      >
        <MessageCircle className="w-5 h-5" />
        Transformation-Guide
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-lg h-[70vh] max-h-[600px] flex flex-col rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-indigo-600" />
                Transformation-Guide
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dieser Assistent erklärt die mathematische Logik und Terminologie. Er hat systembedingt keinen Zugriff auf personenbezogene Daten (DSGVO-konform).
                </p>
              </div>
              {messages.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <p className="font-medium text-slate-700 mb-2">Wie kann ich helfen?</p>
                  <p>Frage z.B.: „Warum ist dieser Wert so hoch?“, „Was bedeutet Remanenz?“ oder „Warum sollte ein Mitarbeiter unterschreiben?“</p>
                  <p className="mt-2 text-xs">Der Bot kennt alle Begriffe und die aktuellen Dashboard-Zahlen.</p>
                </div>
              )}
              {messages.map((m, i) => {
                const showBenefitMatrix =
                  m.role === 'model' &&
                  (m.text.includes(BENEFIT_MATRIX_MARKER) ||
                    /unterschreiben|warum sollte|benefit|vergleich.*kündigung/i.test(
                      messages[i - 1]?.text ?? ''
                    ));
                const displayText = m.text.replace(BENEFIT_MATRIX_MARKER, '').trim();

                return (
                  <div key={i} className="flex flex-col gap-2">
                    <div
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
                          m.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{displayText}</p>
                      </div>
                    </div>
                    {showBenefitMatrix && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] w-full">
                          <BenefitMatrix />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 bg-slate-100 flex items-center gap-2 text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Denke nach…</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {error && (
              <div className="px-4 py-2 bg-red-50 text-red-700 text-xs border-t border-red-100">
                {error}
              </div>
            )}

            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Frage stellen…"
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
